# agents/runnables/runnable_julia.py

"""
RunnableJulia – LangGraph-compatible wrapper for Julia Agent

Julia is the developer-facing RAG agent for the Lumen platform.
This wrapper allows her to function as a modular LangGraph node
that operates on a shared DubinState.

Responsibilities:
- Receive a user question from DubinState
- Use LangChain RAG to retrieve answers from `brain/backend`
- Return the answer along with a list of source documents used
"""

from langchain_core.runnables import Runnable
from agents.julia import Julia
from master_agent.types import DubinState
import logging

logger = logging.getLogger("agent.julia")


class RunnableJulia(Runnable):
    """
    LangGraph node wrapper for the Julia agent.

    This allows Julia to be plugged directly into a LangGraph FSM
    and operate on shared DubinState. It returns an answer along
    with source document metadata used during the retrieval step.
    """

    def __init__(self):
        """
        Initialize the internal Julia RAG agent.
        Loads `brain/backend/` and prepares FAISS retriever.
        """
        self.agent = Julia()

    def invoke(self, input: DubinState, config=None, **kwargs) -> DubinState:
        """
        Answer a developer question using Julia's vector search and LLM.

        Args:
            input (DubinState): Current graph state containing the question under `input["input"]`
            config: Optional runtime config (required by LangGraph)

        Returns:
            DubinState: Updated state with the answer, agent name, and document sources
        """
        logger.info("RunnableJulia invoked")

        # Run query through LangChain QA chain
        result = self.agent.qa.invoke({"query": input["input"]})

        # Extract source file paths from metadata
        source_docs = result.get("source_documents", [])
        sources = [
            doc.metadata.get("source", "unknown")
            for doc in source_docs
        ]

        # Update state
        input["output"] = result.get("result", "")
        input["agent"] = "Julia"
        input["sources"] = sources

        logger.debug(f"Retrieved sources: {sources}")
        return input
