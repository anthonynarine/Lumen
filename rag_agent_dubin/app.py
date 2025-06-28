"""
Dubin RAG Agent Microservice

This FastAPI application serves as the entrypoint for the Dubin Agent system,
a modular RAG (Retrieval-Augmented Generation) architecture that routes developer
or clinical questions to specialized sub-agents (e.g., Julia for backend logic).

Sub-agents are powered by LangChain + OpenAI and retrieve answers from curated
markdown files stored under the `brain/` directory.
"""

import logging
from logging_conf import julia_fiesta_logs
from fastapi import FastAPI
from master_agent.router import router

julia_fiesta_logs()

app = FastAPI(
    title="Dubin RAG Agent API",
    description="Routes questions to Julia and other agents to assist with Lumen system development and clinical logic.",
    version="1.0.0"
)

# Include the master routing endpoint: /agent/master/ask
app.include_router(router, prefix="/agent/master")
