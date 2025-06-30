from fastapi import APIRouter
from fastapi.responses import JSONResponse

health_router = APIRouter()

@health_router.get("/health")
def healthcheck():
    return JSONResponse(
        content={
            "status": "ok",
            "agent": "Dubin",
            "uptime_check": "pass"
        },
        status_code=200
    )
