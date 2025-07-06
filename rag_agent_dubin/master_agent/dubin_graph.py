# dubin_graph.py

"""
LangGraph-powered Dubin Master Router for Lumen

This module defines a LangGraph state machine that:
- Classifies user questions as 'dev', 'clinical', or 'auth'
- Routes them to the corresponding sub-agent (Julia, Kadian, or KeyMaker)
- Each sub-agent returns an LLM answer and list of source documents

Author: Anthony Narine
"""

import logging
from langgraph.graph import StateGraph
from langchain_core.runnables import RunnableLambda
from langchain_openai import ChatOpenAI


from .types import DubinState
from agents.runnables.runnable_julia import RunnableJulia
from agents.runnables.runnable_kadian import RunnableKadian
from agents.runnables.runnable_key_maker import RunnableKeyMaker

logger = logging.getLogger("router.dubin")


# Classifier prompt used to route questions
CLASSIFIER_PROMPT = (
    "You are Dubin, the intelligent routing agent for the Lumen vascular ultrasound platform.\n"
    "Classify the user's question into one of these categories:\n\n"
    "1. dev\n"
    "   - Django backend (models, serializers, views)\n"
    "   - React frontend (components, forms, validation)\n"
    "   - APIs, architecture, Redis, Celery\n"
    "   - JSON templates, PDF, HL7 generation\n\n"
    "2. clinical\n"
    "   - PSV/EDV values, ICA/CCA ratio, stenosis\n"
    "   - Carotid, renal, mesenteric, IVC protocols\n"
    "   - Waveform, plaque, report logic\n\n"
    "3. auth\n"
    "   - authApi.ts, useAuth, AuthProvider\n"
    "   - token refresh logic, JWT auth_integration\n"
    "   - permission utils, HasRole, access control\n\n"
    "Respond with one word: 'dev', 'clinical', or 'auth'. If unsure, pick 'dev'."
)

llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")


# Classifier node to determine which agent to route to
def classify_node(state: DubinState) -> DubinState:
    question = state["input"]
    logger.info(f"[Classifier] Input: {question}")
    try:
        completion = llm.invoke([
            {"role": "system", "content": CLASSIFIER_PROMPT},
            {"role": "user", "content": question}
        ])
        classification = completion.content.strip().lower()
        state["classification"] = classification
        logger.info(f"[Classifier] Result: {classification}")
    except Exception as e:
        logger.exception("Classifier failed — defaulting to 'dev'")
        state["classification"] = "dev"
    return state


# Build LangGraph state machine
graph = StateGraph(DubinState)

# Register nodes
graph.add_node("classify", RunnableLambda(classify_node))
graph.add_node("julia", RunnableJulia())
graph.add_node("kadian", RunnableKadian())
graph.add_node("key_maker", RunnableKeyMaker())

# Conditional routing based on classification output
graph.add_conditional_edges(
    "classify",
    lambda state: state["classification"],
    {
        "dev": "julia",
        "clinical": "kadian",
        "auth": "key_maker"
    }
)

# End points
graph.set_finish_point("julia")
graph.set_finish_point("kadian")
graph.set_finish_point("key_maker")

# Entry point
graph.set_entry_point("classify")  # ✅ This is what you're missing

# Compile final graph
dubin_graph = graph.compile()
