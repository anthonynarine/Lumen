"""
Julia – Developer-Focused RAG Agent for Lumen

This agent loads all Django backend source code and technical documentation
from `brain/backend/`, builds a FAISS vector index, and uses it to answer
developer questions about:
- Django models, views, serializers
- API architecture and HL7/PDF generation
- Report templates and business logic
"""

import logging
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.chat_models import ChatOpenAI

logger = logging.getLogger("agent.julia")


class Julia:
    """
    Julia is the dev-oriented RAG agent for Lumen. It loads the entire
    `brain/backend/` directory and indexes it into a FAISS vectorstore
    to support retrieval-augmented question answering.
    """

    def __init__(self):
        logger.info("🌟 Initializing Julia agent...")

        def get_backend_files(root: str) -> list[str]:
            """Collect all backend files with relevant extensions for embedding."""
            valid_exts = {".py", ".md", ".json"}
            return [
                str(f) for f in Path(root).rglob("*")
                if f.suffix in valid_exts and "__pycache__" not in str(f)
            ]

        # Load documents from backend
        backend_files = get_backend_files("brain/backend")
        dev_docs = []
        for path in backend_files:
            try:
                loader = TextLoader(path, encoding="utf-8", autodetect_encoding=True)
                dev_docs.extend(loader.load())
            except Exception as e:
                logger.warning(f"⚠️ Skipped {path}: {e}")

        logger.info(f"📁 Total documents loaded: {len(dev_docs)}")

        # Split content into vector-searchable chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=100)
        chunks = splitter.split_documents(dev_docs)

        if not chunks:
            raise RuntimeError("🚨 Julia: No content chunks generated. Check backend source directory.")

        logger.info(f"🔍 Generated {len(chunks)} vector chunks")

        # Build FAISS vector index
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(chunks, embeddings)

        # QA chain with retriever
        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
        self.qa = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=True,
        )

        logger.info("✅ Julia is fully initialized and ready.")

    def answer(self, question: str) -> str:
        """
        Run a dev-related question through the RAG pipeline and return the answer.
        Logs context sources and catches irrelevant Julia-language confusion.
        """
        logger.info(f"📨 Julia received: {question}")
        result = self.qa.invoke({"query": question})
        sources = result.get("source_documents", [])

        if not sources:
            logger.warning("⚠️ Julia: No relevant documents found for this question.")
            return (
                "Hmm... I couldn't find anything in the codebase that matches that. "
                "Try rephrasing or being more specific?"
            )

        if "julia programming" in result["result"].lower():
            return (
                "I'm Julia — your dev agent for the Lumen project, not the Julia programming language 😅.\n"
                "Ask me about Django models, APIs, PDF/HL7 logic, or template structure!"
            )

        logger.info("✅ Julia completed response generation.")
        return result["result"]
