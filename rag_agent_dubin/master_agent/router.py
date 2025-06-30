from fastapi import APIRouter
from pydantic import BaseModel
from master_agent.dubin import Dubin
from decouple import config
import os

import logging
logger = logging.getLogger("router.api")

# Ensure OpenAI key is set BEFORE Dubin is initialized
os.environ["OPENAI_API_KEY"] = config("OPENAI_API_KEY")

router = APIRouter()

# Lazy singleton instance
_dubin_instance = None

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
    Route a question to Dubin and return the response under the agent's name as the key.

    Example:
    {
        "agent": "Julia",
        "answer": "Here’s your answer..."
    }
    """
    global _dubin_instance

    if _dubin_instance is None:
        _dubin_instance = Dubin()

    answer, agent = _dubin_instance.route(input.question)
    logger.info(f"✅ Responded with {agent.capitalize()} for question: {input.question}")
    return {
        "agent": agent.capitalize(),
        "answer": answer
    }
