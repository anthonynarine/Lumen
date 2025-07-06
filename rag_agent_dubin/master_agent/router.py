from fastapi import APIRouter
from pydantic import BaseModel
from master_agent.types import DubinState
from master_agent.dubin_graph import dubin_graph

import logging
logger = logging.getLogger("router.api")

router = APIRouter()

class QuestionInput(BaseModel):
    """
    Schema for user input to the /ask endpoint.

    Attributes:
        question (str): The user-submitted question for the RAG agent to answer.
    """
    question: str

@router.post("/ask")
async def ask_agent(input: QuestionInput):
    """
    Routes a question through the Dubin LangGraph state machine
    and returns the final result with agent name and sources.

    Returns:
        JSON:
        {
            "agent": "Julia",
            "answer": "...",
            "sources": ["brain/backend/models/report.py", ...]
        }
    """
    logger.info(f"📥 Received question: {input.question}")

    # Construct input state for graph
    state: DubinState = {
        "input": input.question
    }

    # Invoke LangGraph FSM
    result: DubinState = dubin_graph.invoke(state)

    logger.info(f"✅ Routed to {result['agent']} — classification: {result['classification']}")
    return {
        "agent": result["agent"],
        "answer": result["output"],
        "sources": result.get("sources", [])
    }
