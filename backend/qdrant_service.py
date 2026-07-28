"""
Qdrant vector database service.
Manages two collections:
  - clinical_guidelines : embedded triage/clinical rules for RAG
  - patient_memory      : per-patient consultation history

Performance notes
-----------------
* QdrantClient is created once as a module-level singleton.
  Re-creating it (and running get_collections() as a connectivity test)
  on every request added ~200-400 ms of latency per call.
* All blocking Qdrant/embedding operations are offloaded to a thread-pool
  executor via asyncio.run_in_executor so the event loop is never blocked.
* asyncio.get_running_loop() replaces the deprecated get_event_loop().
"""

import uuid
import asyncio
from functools import partial
from typing import Optional, List, Dict, Any

from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
)

from config import settings
from rag.embed import embed_text as rag_embed_text
from rag.qdrant import init_collection as rag_init_collection, upsert_document as rag_upsert_document
from rag.retrieve import search_collection_sync as rag_search_collection_sync

VECTOR_SIZE = 768   # text-embedding-004 / fallback hash-based mock

GUIDELINES_COLLECTION   = "clinical_guidelines"
PATIENT_MEMORY_COLLECTION = "patient_memory"

# ─── Singleton Qdrant client ──────────────────────────────────────────────────
# Created once; reused for every request. Thread-safe for read operations.
# Write operations are serialised per-collection by Qdrant itself.
_qdrant_client: Optional[QdrantClient] = None


def _get_client() -> Optional[QdrantClient]:
    """Return the module-level singleton QdrantClient (or None if unavailable)."""
    global _qdrant_client
    if _qdrant_client is not None:
        return _qdrant_client
    try:
        client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            api_key=settings.qdrant_api_key or None,
            timeout=5,
        )
        client.get_collections()   # connectivity test — only once at startup
        _qdrant_client = client
        return _qdrant_client
    except Exception as exc:
        print(f"[Qdrant] Client init failed: {exc}")
        return None


def _embed_text(text: str) -> List[float]:
    """
    Embed text via Gemini text-embedding-004.
    Falls back to a deterministic mock vector if Gemini is unavailable.
    """
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.google_api_key)
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception:
        # Mock: hash-based deterministic vector (works for demo without API key)
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        base = [((b / 255.0) * 2 - 1) for b in h]
        return (base * (VECTOR_SIZE // len(base) + 1))[:VECTOR_SIZE]


async def _run_in_executor(fn, *args):
    """Run a synchronous blocking function in a thread pool executor."""
    loop = asyncio.get_running_loop()   # replaces deprecated get_event_loop()
    return await loop.run_in_executor(None, partial(fn, *args))


# ─── Collection Setup ─────────────────────────────────────────────────────────

def _init_collections_sync():
    client = _get_client()
    if not client:
        print("[WARN] Qdrant unavailable - skipping collection init")
        return

    existing = {c.name for c in client.get_collections().collections}

    for name in [GUIDELINES_COLLECTION, PATIENT_MEMORY_COLLECTION]:
        if name not in existing:
            client.create_collection(
                collection_name=name,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )
            print(f"[OK] Created Qdrant collection: {name}")

    # Also initialise via RAG module (idempotent)
    rag_init_collection(GUIDELINES_COLLECTION)


async def init_collections():
    await _run_in_executor(_init_collections_sync)


# ─── Patient Memory ───────────────────────────────────────────────────────────

def _upsert_patient_memory_sync(patient_id, consultation_id, text, metadata):
    client = _get_client()
    if not client:
        return

    vector = _embed_text(text)
    point = PointStruct(
        id=str(uuid.uuid5(uuid.NAMESPACE_URL, consultation_id)),
        vector=vector,
        payload={
            "patient_id": patient_id,
            "consultation_id": consultation_id,
            "text": text,
            **metadata,
        },
    )
    client.upsert(collection_name=PATIENT_MEMORY_COLLECTION, points=[point])


async def upsert_patient_memory(
    patient_id: str,
    consultation_id: str,
    text: str,
    metadata: Dict[str, Any],
):
    await _run_in_executor(_upsert_patient_memory_sync, patient_id, consultation_id, text, metadata)


def _search_patient_memory_sync(patient_id, query, top_k):
    client = _get_client()
    if not client:
        return _mock_patient_memory(patient_id)

    vector = _embed_text(query)
    results = client.search(
        collection_name=PATIENT_MEMORY_COLLECTION,
        query_vector=vector,
        query_filter=Filter(
            must=[FieldCondition(key="patient_id", match=MatchValue(value=patient_id))]
        ),
        limit=top_k,
        with_payload=True,
    )
    return [r.payload for r in results]


async def search_patient_memory(
    patient_id: str,
    query: str,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    return await _run_in_executor(_search_patient_memory_sync, patient_id, query, top_k)


# ─── Clinical Guidelines RAG ──────────────────────────────────────────────────

def _search_guidelines_sync(query, top_k):
    results = rag_search_collection_sync(GUIDELINES_COLLECTION, query, top_k=top_k)
    if not results:
        return _mock_guidelines(query)
    return results


async def search_guidelines(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    return await _run_in_executor(_search_guidelines_sync, query, top_k)


def _upsert_guideline_sync(guideline_id, title, text, category):
    metadata = {"title": title, "category": category}
    rag_upsert_document(GUIDELINES_COLLECTION, guideline_id, text, metadata)


async def upsert_guideline(guideline_id: str, title: str, text: str, category: str):
    await _run_in_executor(_upsert_guideline_sync, guideline_id, title, text, category)


# ─── Mock Fallbacks ───────────────────────────────────────────────────────────

def _mock_patient_memory(patient_id: str) -> List[Dict]:
    return [
        {
            "patient_id": patient_id,
            "text": "Previous visit: Chest pain — triaged P1. ECG normal.",
            "priority": "P1",
            "date": "2024-10-15",
        },
        {
            "patient_id": patient_id,
            "text": "Follow-up: Hypertension monitoring — BP 145/90. Medications adjusted.",
            "priority": "P2",
            "date": "2024-11-02",
        },
    ]


def _mock_guidelines(query: str) -> List[Dict]:
    guidelines = [
        {
            "title": "P1 Emergency Criteria",
            "text": "Chest pain with diaphoresis, dyspnea, or syncope — immediate resuscitation.",
            "category": "triage",
        },
        {
            "title": "Stroke Protocol",
            "text": "FAST: Face drooping, Arm weakness, Speech difficulty, Time to call. Activate stroke team.",
            "category": "triage",
        },
        {
            "title": "P2 Urgent Criteria",
            "text": "Moderate pain, stable vitals, requires evaluation within 30 minutes.",
            "category": "triage",
        },
        {
            "title": "P3 Non-Urgent Criteria",
            "text": "Minor symptoms, stable vitals, can wait for standard consultation queue.",
            "category": "triage",
        },
    ]
    q = query.lower()
    matched = [g for g in guidelines if any(w in q for w in ["chest", "pain", "stroke", "breath", "urgent"])]
    return matched or guidelines[:2]
