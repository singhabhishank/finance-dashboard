from pydantic import BaseModel, Field


class PaginatedResponse(BaseModel):
    total: int = Field(ge=0)
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)


class ErrorResponse(BaseModel):
    detail: str


class HealthResponse(BaseModel):
    status: str
    service: str
