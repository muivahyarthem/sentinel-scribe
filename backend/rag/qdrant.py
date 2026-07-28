"""
RAG Qdrant client — singleton wrapper.

Performance: Client is created once and reused across all calls.
Previously a new QdrantClient was created (with a get_collections() round-trip)
on every embed/search/upsert, adding 200-400 ms per operation.
"""

import uuid
from typing import Optional, Dict, Any

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct

from config import settings
from .embed import VECTOR_SIZE, embed_text

# ─── Module-level singleton ───────────────────────────────────────────────────
_client: Optional[QdrantClient] = None


def get_qdrant_client() -> Optional[QdrantClient]:
    """Return the singleton QdrantClient, initialising it on first call."""
    global _client
    if _client is not None:
        return _client
    try:
        c = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            api_key=settings.qdrant_api_key or None,
            timeout=5,
        )
        c.get_collections()   # connectivity test — only once
        _client = c
        return _client
    except Exception as exc:
        print(f"[RAG Qdrant] Client init failed: {exc}")
        return None


def init_collection(collection_name: str):
    """Creates a collection if it doesn't exist."""
    client = get_qdrant_client()
    if not client:
        print(f"[WARN] Qdrant unavailable - skipping init for {collection_name}")
        return

    existing = {c.name for c in client.get_collections().collections}
    if collection_name not in existing:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )
        print(f"[OK] Created Qdrant collection: {collection_name}")
    # Do NOT close — we keep the connection alive for reuse


def upsert_document(collection_name: str, doc_id: str, text: str, metadata: Dict[str, Any]):
    """Embeds text and upserts a document into the specified collection."""
    client = get_qdrant_client()
    if not client:
        return

    vector = embed_text(text)
    point_id = str(uuid.uuid5(uuid.NAMESPACE_URL, doc_id))
    payload = {"id": doc_id, "text": text, **metadata}
    point = PointStruct(id=point_id, vector=vector, payload=payload)
    client.upsert(collection_name=collection_name, points=[point])
    # Do NOT close — keep connection alive
