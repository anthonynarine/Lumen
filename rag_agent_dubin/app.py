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

# 🔀 Import Dubin router (after logging is ready)
from master_agent.router import router

# 🧪 Optional: Preload Julia on boot to verify readiness
try:
    from master_agent.dubin import Dubin
    _ = Dubin()
    logger.info("✅ Julia loaded successfully during app boot.")
except Exception as e:
    logger.error(f"❌ Julia failed to initialize: {e}")

# 🚀 Create FastAPI instance
app = FastAPI(
    title="Dubin RAG Agent API",
    description=(
        "Master RAG agent for the Lumen ultrasound platform.\n\n"
        "Routes questions to Julia (developer agent) or Kadian (clinical agent) "
        "based on classification, and responds with context-aware answers."
    ),
    version="1.0.0"
)

# 🔗 Register all routes
app.include_router(router, prefix="/agent/master")
