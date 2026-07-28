"""
Lyzr AI Agent client for the Doctor Copilot.

Wraps the Lyzr v3 inference/chat API:
  POST https://agent-prod.studio.lyzr.ai/v3/inference/chat/

Performance: Uses httpx (async-native) instead of urllib (blocking).
The original urllib.urlopen blocked the FastAPI async event loop for up to
the full 60-second timeout, stalling all other concurrent requests.

Each specialised agent has its own agent_id and a fixed session_id as
configured in Lyzr Studio. Pass the agent_key to route to the right agent:

  agent_key values:
    "copilot"    — Doctor Copilot Main Agent
    "soap"       — SOAP Note Agent
    "triage"     — Triage Agent
    "symptom"    — Symptom Extraction Agent
    "red_flag"   — Red Flag Agent
    "transcript" — Transcript Cleaning Agent
"""

import json
from typing import Optional, Literal
from config import settings

AgentKey = Literal["copilot", "soap", "triage", "symptom", "red_flag", "transcript"]

# ---------------------------------------------------------------------------
# Agent registry — maps agent_key → (agent_id, session_id)
# ---------------------------------------------------------------------------

def _get_agent_config(agent_key: AgentKey) -> tuple[str, str]:
    """Return (agent_id, session_id) for the given agent key."""
    registry = {
        "copilot":    (settings.lyzr_copilot_agent_id,    settings.lyzr_copilot_session_id),
        "soap":       (settings.lyzr_soap_agent_id,        settings.lyzr_soap_session_id),
        "triage":     (settings.lyzr_triage_agent_id,      settings.lyzr_triage_session_id),
        "symptom":    (settings.lyzr_symptom_agent_id,     settings.lyzr_symptom_session_id),
        "red_flag":   (settings.lyzr_red_flag_agent_id,    settings.lyzr_red_flag_session_id),
        "transcript": (settings.lyzr_transcript_agent_id,  settings.lyzr_transcript_session_id),
    }
    return registry.get(agent_key, (settings.lyzr_copilot_agent_id, settings.lyzr_copilot_session_id))


def lyzr_chat(
    message: str,
    agent_key: AgentKey = "copilot",
) -> Optional[str]:
    """
    Send a message to a specific Lyzr AI agent and return its text response.

    This is a synchronous function — call it from a thread-pool executor to
    avoid blocking the async event loop.

    Returns the agent's reply string, or None on any error.
    """
    api_key  = settings.lyzr_api_key
    user_id  = settings.lyzr_user_id
    base_url = settings.lyzr_base_url.rstrip("/")

    if not api_key:
        print("[Lyzr] SKIPPED: LYZR_API_KEY not configured.")
        return None

    agent_id, session_id = _get_agent_config(agent_key)

    if not agent_id:
        print(f"[Lyzr] SKIPPED: No agent_id configured for key '{agent_key}'.")
        return None

    payload = json.dumps({
        "user_id":    user_id,
        "agent_id":   agent_id,
        "session_id": session_id,
        "message":    message,
    }).encode("utf-8")

    # Use httpx (sync) so that when this runs in a thread executor it doesn't
    # bring blocking urllib into the async event loop.
    try:
        import httpx
        with httpx.Client(timeout=60) as client:
            resp = client.post(
                f"{base_url}/v3/inference/chat/",
                content=payload,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key":    api_key,
                },
            )
            resp.raise_for_status()
            body = resp.json()
    except ImportError:
        # Fallback to urllib if httpx is not installed
        import urllib.request
        import urllib.error
        req = urllib.request.Request(
            f"{base_url}/v3/inference/chat/",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key":    api_key,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = ""
            try:
                error_body = e.read().decode("utf-8")[:300]
            except Exception:
                pass
            print(f"[Lyzr:{agent_key}] HTTP {e.code} error: {e.reason} — {error_body}")
            return None
        except Exception as e:
            print(f"[Lyzr:{agent_key}] Network error: {e}")
            return None
    except Exception as exc:
        print(f"[Lyzr:{agent_key}] Request error: {exc}")
        return None

    # Parse response
    for key in ("response", "message", "answer", "text", "output", "content"):
        val = body.get(key)
        if val and isinstance(val, str) and len(val.strip()) > 5:
            print(f"[Lyzr:{agent_key}] ✓ Response received ({len(val)} chars, session={session_id})")
            return val.strip()

    # Some versions nest inside choices
    choices = body.get("choices") or []
    if choices and isinstance(choices, list):
        text = (
            choices[0].get("message", {}).get("content")
            or choices[0].get("text")
            or ""
        )
        if text:
            return text.strip()

    print(f"[Lyzr:{agent_key}] Unexpected response shape: {list(body.keys())}")
    return None
