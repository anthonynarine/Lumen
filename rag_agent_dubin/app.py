"""
Dubin – Master RAG Agent FastAPI App

Bootstraps the routing layer for developer (Julia) and clinical (Kadian) sub-agents,
initializes shared logging configuration, and sets environment variables early.

This file serves as the main FastAPI entrypoint for the rag_agent_dubin microservice.
"""

import os
import logging
from decouple import config
from fastapi import FastAPI

# 🔐 Set OpenAI API key before LangChain initializes
os.environ["OPENAI_API_KEY"] = config("OPENAI_API_KEY")

# 🧠 Configure logging before importing any agents or routers
from logging_conf import julia_fiesta_logs
julia_fiesta_logs()

logger = logging.getLogger("app")
logger.debug("🟢 Logging system initialized successfully.")

# 🔀 Import routers
from master_agent.router import router
from master_agent.health import health_router

# 🧪 Optional: Preload Julia on boot to verify readiness
try:
    from master_agent.dubin import Dubin
    _ = Dubin()
    logger.info("✅ Dubin loaded successfully during app boot.")
except Exception as e:
    logger.error(f"❌ Dubin failed to initialize: {e}")

# 🚀 Create FastAPI instance
app = FastAPI(
    title="Dubin RAG Agent API",
    description=(
        "Master RAG agent for the Lumen ultrasound platform.\n\n"
        "Routes questions to Julia (developer agent) or Kadian (clinical agent) "
        "based on classification, and responds with context-aware answers."
    ),
    version="1.0.1"
)

# 🔗 Register routers
app.include_router(router, prefix="/oracle")  # main /ask route
app.include_router(health_router)  # GET /health
