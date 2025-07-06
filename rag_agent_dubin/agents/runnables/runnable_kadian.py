# agents/runnables/runnable_kadian.py

"""
RunnableKadian – LangGraph-compatible wrapper for Kadian Agent

Kadian is the clinical criteria agent for the Lumen platform.
He specializes in vascular protocols, stenosis interpretation,
and PSV/EDV thresholds using documents in `brain/clinical/`.

This wrapper enables him to function as a LangGraph node.
"""

from langchain_core.runnables import Runnable
from agents.kadian import Kadian
from master_agent.types import DubinState
import logging

logger = logging.getLogger("agent.kadian")


class RunnableKadian(Runnable):
    """
    LangGraph node wrapper for the Kadian agent.

    Supports answering clinical protocol and interpretation questions
    using embedded PDF documents from `brain/clinical/`.
    """

    def __init__(self):
        """
        Initialize the Kadian agent and load clinical protocol PDFs.
        """
        self.agent = Kadian()

    def invoke(self, input: DubinState, config=None, **kwargs) -> DubinState:
        """
        Answer a clinical question using Kadian’s RetrievalQA pipeline.

        Args:
            input (DubinState): LangGraph state containing the user question.
            config (optional): LangGraph runtime configuration.

        Returns:
            DubinState: Updated state with Kadian's answer, agent name, and source document paths.
        """
        logger.info("RunnableKadian invoked")

        result = self.agent.qa.invoke({"query": input["input"]})
        source_docs = result.get("source_documents", [])

        sources = [
            doc.metadata.get("source", "unknown")
            for doc in source_docs
        ]

        input["output"] = result.get("result", "")
        input["agent"] = "Kadian"
        input["sources"] = sources

        logger.debug(f"Retrieved sources: {sources}")
        return input
