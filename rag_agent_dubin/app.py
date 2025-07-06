# ...existing imports
import os
import logging
from decouple import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← Add this

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

# 🧪 Optional: Preload LangGraph to verify agent readiness
try:
    from master_agent.dubin_graph import dubin_graph
    test_input = {"input": "What is ICA/CCA ratio?"}
    _ = dubin_graph.invoke(test_input)
    logger.info("✅ Dubin LangGraph initialized and routed correctly.")
except Exception as e:
    logger.exception("❌ LangGraph agent initialization failed")

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

# 🔐 Add CORS middleware — 🔥 GLOBAL and reusable across all routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Dev frontend
        "https://your-frontend.com"   # Prod domain (set this correctly later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔗 Register routers
app.include_router(router, prefix="/oracle")
app.include_router(health_router)
