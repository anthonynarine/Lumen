# agents/runnables/runnable_keymaker.py

"""
RunnableKeyMaker – LangGraph-compatible wrapper for KeyMaker (Agent Smith)

KeyMaker is Lumen’s authentication-focused RAG agent.
He answers questions about the frontend/backend auth architecture using files in `brain/auth_fe/`.

Topics include:
- JWT authentication flow
- AuthProvider, useAuth
- Token refresh logic
- Permissions and access control

This wrapper allows KeyMaker to function as a modular LangGraph node.
"""

from langchain_core.runnables import Runnable
from agents.key_maker import KeyMaker
from master_agent.types import DubinState
import logging

logger = logging.getLogger("agent.smith")


class RunnableKeyMaker(Runnable):
    """
    LangGraph node wrapper for the KeyMaker agent.

    Transforms KeyMaker into a LangGraph-compatible component that:
    - Accepts DubinState as input
    - Runs an RAG-based query over `brain/auth_fe/`
    - Returns structured output and retrieved source metadata
    """

    def __init__(self):
        """
        Initializes the KeyMaker agent and loads all files from `brain/auth_fe/`.
        """
        self.agent = KeyMaker()

    def invoke(self, input: DubinState, config=None, **kwargs) -> DubinState:
        """
        Answers an authentication-related question.

        Args:
            input (DubinState): LangGraph input state containing the user's question.

        Returns:
            DubinState: Updated state with:
                - output (LLM-generated answer)
                - agent (KeyMaker)
                - sources (retrieved file paths)
        """
        logger.info("RunnableKeyMaker invoked")

        result = self.agent.qa.invoke({"query": input["input"]})
        source_docs = result.get("source_documents", [])

        sources = [
            doc.metadata.get("source", "unknown")
            for doc in source_docs
        ]

        input["output"] = result.get("result", "")
        input["agent"] = "KeyMaker"
        input["sources"] = sources

        logger.debug(f"Retrieved sources: {sources}")
        return input
