"""
Dubin RAG Agent Microservice

This FastAPI application serves as the entrypoint for the Dubin Agent system,
a modular RAG (Retrieval-Augmented Generation) architecture that routes developer
or clinical questions to specialized sub-agents (e.g., Julia for backend logic).

Sub-agents are powered by LangChain + OpenAI and retrieve answers from curated
markdown files stored under the `brain/` directory.
"""

import os
import logging
from decouple import config
from fastapi import FastAPI
from agents.julia import Julia

# 🔐 Step 1: Inject OpenAI key early (before any LangChain client instantiates)
os.environ["OPENAI_API_KEY"] = config("OPENAI_API_KEY")

# 📊 Step 2: Initialize logging system BEFORE importing any agents
from logging_conf import julia_fiesta_logs
julia_fiesta_logs()

logger = logging.getLogger("router.api")
logger.debug("🟢 Logging system initialized correctly!")

# 🌐 Step 3: Import Dubin router AFTER logs are ready
from master_agent.router import router

try:
    test_julia = Julia()
    print("✅ Julia loaded manually on app start")
except Exception as e:
    print("❌ Julia failed to load:", e)

# 🚀 Step 4: Create FastAPI app
app = FastAPI(
    title="Dubin RAG Agent API",
    description="Routes questions to Julia and other agents to assist with Lumen system development and clinical logic.",
    version="1.0.0"
)

# 📡 Step 5: Register the master route
app.include_router(router, prefix="/agent/master")
