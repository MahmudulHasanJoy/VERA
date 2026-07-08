from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "VERA API"
    database_url: str = "sqlite:///./vera.db"
    secret_key: str = "dev-secret-change-in-production"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:3000"

    # Optional notification channels (disabled unless configured)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "vera@localhost"
    sms_enabled: bool = False
    sms_provider_url: str = ""
    sms_api_key: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host)


settings = Settings()
