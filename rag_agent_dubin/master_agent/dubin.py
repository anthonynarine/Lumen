"""
Dubin – Intelligent Master Agent Router for Lumen

Uses GPT-3.5 to classify each question as:
- "dev" → Julia (for dev/API/architecture topics)
- "clinical" → Kadian (for protocol/criteria/vascular topics)
Then routes it to the correct sub-agent.
"""

import logging
import os
from agents.julia import Julia
from agents.kadian import Kadian
from agents.key_maker import KeyMaker

from langchain_openai import ChatOpenAI
from decouple import config

logger = logging.getLogger("router.dubin")


class Dubin:
    """
    Dubin is the Lumen master routing agent.

    Responsibilities:
    - Classify incoming questions as "dev" or "clinical"
    - Delegate to Julia (dev) or Kadian (clinical)
    """

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

    def __init__(self):
        logger.info("🔁 Initializing Dubin master router...")

        openai_key = config("OPENAI_API_KEY")
        os.environ["OPENAI_API_KEY"] = openai_key

        logger.info("💻 Creating Julia agent...")
        self.julia = Julia()

        logger.info("🩺 Creating Kadian agent...")
        self.kadian = Kadian()

        logger.info("🛡️ Creating Agent Smith...")
        self.key_maker = KeyMaker()

        self.classifier = ChatOpenAI(
            temperature=0,
            model="gpt-3.5-turbo",
            openai_api_key=openai_key
        )

        logger.info("✅ Dubin is ready to classify and route questions")

    def route(self, question: str) -> str:
        clean_question = question.strip()
        logger.info(f"📨 Dubin received question: {clean_question}")

        try:
            completion = self.classifier.invoke([
                {"role": "system", "content": self.CLASSIFIER_PROMPT},
                {"role": "user", "content": clean_question}
            ])
            route = completion.content.strip().lower()
            logger.info(f"🧭 Dubin classified question as: '{route}'")

        except Exception as e:
            logger.error(f"❌ Classification failed: {e}")
            return "Sorry, I'm having trouble classifying your question right now."

        try:
            if route == "clinical":
                logger.info("🩺 Routing to Kadian (clinical)")
                return self.kadian.answer(clean_question), "Kadian"
            elif route == "auth":
                logger.info("🛡️ Routing to Key Maker (auth)")
                return self.key_maker.answer(clean_question), "KeyMaker"
            elif route == "dev":
                logger.info("💻 Routing to Julia (dev)")
                return self.julia.answer(clean_question), "Julia"
            else:
                logger.warning(f"⚠️ Unexpected classification '{route}', defaulting to Julia")
                return self.julia.answer(clean_question), "Julia"

        except Exception as e:
            logger.exception(f"🔥 Sub-agent failed to answer: {e}")
            return "Something went wrong when processing your question."

