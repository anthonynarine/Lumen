from fastapi import APIRouter
from pydantic import BaseModel
from master_agent.dubin import Dubin

router = APIRouter()
dubin = Dubin()

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
    Route a question to Dubin, the master agent, and return a generated answer.

    Args:
        input (QuestionInput): Pydantic model containing the user's question.

    Returns:
        dict: A JSON object with the generated answer under the 'answer' key.
    """
    answer = dubin.route(input.question)
    return {"answer": answer}
