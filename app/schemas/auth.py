from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(min_length=2, max_length=100)


class Token(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {"access_token": "eyJhbGciOi...", "token_type": "bearer"}
        }
    )

    access_token: str
    token_type: str = "bearer"
