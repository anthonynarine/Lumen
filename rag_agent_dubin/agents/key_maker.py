# agents/agent_smith.py

import logging
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.chat_models import ChatOpenAI

logger = logging.getLogger("agent.smith")


class KeyMaker:
    """
    Agent Smith is the auth-focused RAG agent for Lumen.
    Indexes the full `brain/auth_fe/` directory.
    """

    def __init__(self):
        logger.info("🕶️ Initializing Agent Smith (auth_fe brain)...")

        def get_auth_files(root: str) -> list[str]:
            valid_exts = {".ts", ".tsx", ".js", ".jsx", ".md"}
            return [
                str(f) for f in Path(root).rglob("*")
                if f.suffix in valid_exts and "__pycache__" not in str(f)
            ]

        root_dir = "brain/auth_fe"
        auth_files = get_auth_files(root_dir)
        auth_docs = []
        for path in auth_files:
            try:
                loader = TextLoader(path, encoding="utf-8", autodetect_encoding=True)
                auth_docs.extend(loader.load())
            except Exception as e:
                logger.warning(f"⚠️ Skipped {path}: {e}")

        logger.info(f"🔐 Loaded {len(auth_docs)} auth documents")

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_documents(auth_docs)

        if not chunks:
            raise RuntimeError("🚨 KeyMaker: No content chunks generated from auth_fe.")

        logger.info(f"🧩 Created {len(chunks)} vector chunks")

        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(chunks, embeddings)

        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
        self.qa = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=True,
        )

        logger.info("✅ KeyMaker is fully trained and ready.")

    def answer(self, question: str) -> str:
        logger.info(f"🔐 KeyMaker received: {question}")
        result = self.qa.invoke({"query": question})
        sources = result.get("source_documents", [])

        if not sources:
            logger.warning("⚠️ KeyMaker: No relevant matches found.")
            return "I couldn't find anything related in the auth_fe directory. Try asking differently?"

        return result["result"]
