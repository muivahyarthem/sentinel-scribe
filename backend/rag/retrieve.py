from typing import List, Dict, Any, Optional
from qdrant_client.http.models import Filter, FieldCondition, MatchValue

from .embed import embed_text
from .qdrant import get_qdrant_client


def search_collection_sync(
    collection_name: str,
    query: str,
    top_k: int = 5,
    filter_dict: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Embeds a query and searches the specified Qdrant collection.

    Uses the module-level singleton client — no per-call reconnection overhead.
    Optional filter_dict filters by payload fields (e.g. {"patient_id": "123"}).
    """
    client = get_qdrant_client()
    if not client:
        return []

    vector = embed_text(query)

    query_filter = None
    if filter_dict:
        must_conditions = [
            FieldCondition(key=k, match=MatchValue(value=v))
            for k, v in filter_dict.items()
        ]
        query_filter = Filter(must=must_conditions)

    try:
        results = client.search(
            collection_name=collection_name,
            query_vector=vector,
            query_filter=query_filter,
            limit=top_k,
            with_payload=True,
        )
        # Do NOT close — keep singleton alive
        return [r.payload for r in results]
    except Exception as e:
        print(f"[RAG Retrieve] Error searching collection {collection_name}: {e}")
        return []
