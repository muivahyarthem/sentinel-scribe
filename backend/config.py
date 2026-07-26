from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_secret_key: str = "supersecret-hackathon-key"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # PostgreSQL
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/clinical_db"

    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_api_key: str = ""   # Leave empty for local Docker. Set in .env for Qdrant Cloud.

    # Gemini (primary LLM)
    google_api_key: str = ""   # Set in .env — get a key at https://aistudio.google.com/app/apikey

    # HuggingFace (fallback LLM)
    hf_api_token: str = ""     # Set in .env — get a free token at https://huggingface.co/settings/tokens
    hf_model: str = "mistralai/Mistral-7B-Instruct-v0.3"  # Change to any HF Inference-supported model

    # Lyzr AI — shared credentials
    lyzr_api_key: str = ""
    lyzr_user_id: str = ""
    lyzr_base_url: str = "https://agent-prod.studio.lyzr.ai"

    # Lyzr AI — individual agent IDs
    lyzr_copilot_agent_id: str = ""
    lyzr_copilot_session_id: str = ""

    lyzr_soap_agent_id: str = ""
    lyzr_soap_session_id: str = ""

    lyzr_triage_agent_id: str = ""
    lyzr_triage_session_id: str = ""

    lyzr_symptom_agent_id: str = ""
    lyzr_symptom_session_id: str = ""

    lyzr_red_flag_agent_id: str = ""
    lyzr_red_flag_session_id: str = ""

    lyzr_transcript_agent_id: str = ""
    lyzr_transcript_session_id: str = ""

    # Legacy — kept for backward compat, maps to copilot agent
    lyzr_agent_id: str = ""

    # JWT
    jwt_secret: str = "clinical-jwt-secret-2024"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
