"""
Dubin – Intelligent Master Agent Router for Lumen

Uses GPT-3.5 to classify each question as:
- "dev" → Julia (for dev/API/architecture topics)
- "clinical" → Kadian (for protocol/criteria/vascular topics)
Then routes it to the correct sub-agent.
"""

import logging
from agents.julia import Julia
from agents.kadian import Kadian
from langchain_openai import ChatOpenAI

logger = logging.getLogger("router.dubin")

class Dubin:
    """
    Dubin is the Lumen master routing agent.

    Responsibilities:
    - Classify incoming questions as "dev" or "clinical"
    - Delegate to Julia (dev) or Kadian (clinical)
    """

    def __init__(self):
        logger.info("Initializing Dubin master agent...")
        self.julia = Julia()
        self.kadian = Kadian()
        self.classifier = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
        logger.info("Dubin is ready to classify and route questions.")

    def route(self, question: str) -> str:
        """
        Classify the question using an LLM and route it accordingly.

        Args:
            question (str): User's input question

        Returns:
            str: The response from Julia or Kadian
        """
        logger.info(f"Received question for routing: {question.strip()}")

        system_prompt = (
            "You are the routing agent Dubin for the Lumen vascular ultrasound system.\n"
            "Classify each question into one of the following categories:\n\n"
            "1. dev\n"
            "   Use if the question is about:\n"
            "   - Django backend (models, serializers, views)\n"
            "   - API integration, routing, auth, permissions\n"
            "   - React frontend (components, form structure, validation)\n"
            "   - Project architecture, deployment, CI/CD, Redis, Celery\n"
            "   - Data flow, JSON templates, PDF/HL7 generation\n\n"
            "2. clinical\n"
            "   Use if the question is about:\n"
            "   - PSV/EDV thresholds\n"
            "   - ICA/CCA ratio interpretation\n"
            "   - Carotid, renal, IVC, mesenteric, ABI protocols\n"
            "   - Stenosis criteria, waveform, plaque, segments\n"
            "   - Clinical documentation, required measurements\n\n"
            "Respond ONLY with one word: 'dev' or 'clinical'."
        )

        # Classify using LLM
        try:
            completion = self.classifier.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question.strip()}
            ])
            route = completion.content.strip().lower()
            logger.info(f"Dubin classified question as → '{route}'")
        except Exception as e:
            logger.error(f"Error during classification: {e}")
            return "I'm having trouble classifying your question right now."

        # Route to appropriate agent
        if route == "clinical":
            return self.kadian.answer(question)
        elif route == "dev":
            return self.julia.answer(question)
        else:
            logger.warning(f"Unrecognized route '{route}'. Defaulting to Julia.")
            return self.julia.answer(question)
