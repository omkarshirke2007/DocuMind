import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AI_ENGINE_HOST: str = os.getenv("AI_ENGINE_HOST", "0.0.0.0")
    AI_ENGINE_PORT: int = int(os.getenv("AI_ENGINE_PORT", "8000"))
    
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://demo-placeholder.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "demo-service-role-key")
    
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models/llama-3.2-3b-instruct-q4_k_m.gguf")
    N_GPU_LAYERS: int = int(os.getenv("N_GPU_LAYERS", "-1"))
    CONTEXT_SIZE: int = int(os.getenv("CONTEXT_SIZE", "4096"))
    STORAGE_BUCKET: str = os.getenv("STORAGE_BUCKET", "document-vault")
    MOCK_FALLBACK: bool = os.getenv("MOCK_FALLBACK", "false").lower() in ("true", "1", "yes")
    DOCUMIND_API_KEY: str = os.getenv("DOCUMIND_API_KEY", "documind-secure-hackathon-key-2026")

settings = Settings()
