"""
Julia – Developer-Focused RAG Agent for Lumen

Loads the entire Django backend source code and technical documentation
from `brain/backend/`, and answers questions about architecture, models,
serializers, routing, template logic, PDF/HL7 generation, etc.
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
    def __init__(self):
        logger.info("🚀 Initializing Julia agent with full backend knowledge base...")
        print("🌟 JULIA INIT STARTED")  # DEBUGGING
        logger.info("🌟 Julia init logger triggered")


        def get_backend_files(root: str) -> list[str]:
            valid_exts = {".py", ".md", ".json"}
            files = [
                str(f) for f in Path(root).rglob("*")
                if f.suffix in valid_exts and "__pycache__" not in str(f)
            ]
            logger.debug(f"📁 Collected {len(files)} backend files from {root}")
            return files

        # Load all dev documents
        dev_docs = []
        for path in get_backend_files("brain/backend"):
            try:
                loader = TextLoader(path, encoding="utf-8", autodetect_encoding=True)
                loaded = loader.load()
                dev_docs.extend(loaded)
                logger.debug(f"✅ Loaded {len(loaded)} docs from: {path}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to load {path}: {e}")

        logger.info(f"📦 Total loaded documents: {len(dev_docs)}")

        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=100)
        chunks = splitter.split_documents(dev_docs)
        logger.info(f"🔍 Split into {len(chunks)} chunks for vector indexing")

        # Ensure indexing isn't empty
        if not chunks:
            raise RuntimeError("🚨 Julia: No chunks created. Check `brain/backend/` contents.")

        # Log preview of chunks
        for i, chunk in enumerate(chunks[:3]):
            logger.debug(f"🧠 Sample chunk {i+1}:\n{chunk.page_content[:300]}")

        # Build vector store
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(chunks, embeddings)
        logger.info("🧠 FAISS vectorstore created successfully")

        # Set up QA chain
        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
        self.qa = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=True
        )

        logger.info("✅ Julia is fully initialized and ready to answer.")

    def answer(self, question: str) -> str:
        logger.info(f"📨 Julia received question: {question}")

        result = self.qa.invoke({"query": question})
        sources = result.get("source_documents", [])

        # Log relevant documents
        for i, doc in enumerate(sources[:3]):
            logger.debug(f"📄 Source doc {i+1}:\n{doc.page_content[:300]}")

        if not sources:
            logger.warning("⚠️ No relevant documents found for this question.")
            return "Hmm... I couldn't find anything in the codebase that matches that. Try rephrasing?"

        if "julia programming" in result["result"].lower():
            return (
                "I'm Julia — the dev agent for the Lumen project, not the Julia language 😅.\n"
                "Try asking me about your backend code, models, API, or architecture!"
            )

        logger.info("✅ Julia completed response generation.")
        return result["result"]
