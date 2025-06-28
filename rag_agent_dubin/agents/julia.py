"""
Julia – Developer-Focused RAG Agent for Lumen

Loads only backend/frontend source files and technical documentation to
assist with architectural, API, template, and workflow questions.
"""

import logging
from pathlib import Path
from decouple import config
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter

logger = logging.getLogger("agent.julia")

class Julia:
    """
    Julia is Lumen’s development-focused RAG agent.

    She specializes in questions related to:
    - Django backend models, serializers, and views
    - React frontend components and form logic
    - JSON template structure and validation
    - System architecture, CI/CD, deployment, and integrations
    """

    def __init__(self):
        """
        Initializes Julia by loading and embedding all developer-relevant files
        from the brain/backend/ directory.

        Only includes files with .py, .json, or .md extensions.
        Ignores __pycache__ folders and any clinical content.
        """
        logger.info("Initializing Julia agent...")

        openai_key = config("OPENAI_API_KEY")

        def get_backend_files(root: str) -> list[str]:
            """Collect all valid file paths from brain/backend/ for embedding."""
            valid_exts = {".py", ".json", ".md"}
            files = [
                str(f) for f in Path(root).rglob("*")
                if f.suffix in valid_exts and "__pycache__" not in str(f)
            ]
            logger.debug(f"Collected {len(files)} backend files for embedding.")
            return files

        # Load all text documents from backend knowledge base
        dev_docs = []
        for path in get_backend_files("brain/backend"):
            try:
                loader = TextLoader(path, encoding="utf-8", autodetect_encoding=True)
                loaded = loader.load()
                dev_docs.extend(loaded)
                logger.debug(f"Loaded {len(loaded)} docs from: {path}")
            except Exception as e:
                logger.warning(f"Failed to load {path}: {e}")

        # Split documents into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(dev_docs)
        logger.info(f"Split {len(dev_docs)} documents into {len(chunks)} chunks.")

        # Embed documents using FAISS
        embeddings = OpenAIEmbeddings(openai_api_key=openai_key)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        logger.info("Created FAISS vectorstore for Julia.")

        # Create the LangChain RetrievalQA chain
        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo", openai_api_key=openai_key)
        self.qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())

        logger.info("Julia is ready to answer dev-related questions.")

    def answer(self, question: str) -> str:
        """
        Uses LangChain's RetrievalQA to answer a development-related question.

        Args:
            question (str): A question about Lumen's code, templates, or dev architecture.

        Returns:
            str: Answer generated using embedded code and documentation.
        """
        logger.info(f"Julia received question: {question}")
        result = self.qa.run(question)
        logger.info("Julia completed response generation.")
        return result
