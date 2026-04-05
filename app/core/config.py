from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Finance Dashboard Backend"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:3002",
        ]
    )

    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60

    database_url: str = "sqlite:///./finance_dashboard.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
