"""
Kadian – Clinical Criteria Agent for Lumen

Loads vascular ultrasound protocol PDFs (carotid, renal, IVC, etc.)
to answer questions about PSV/EDV thresholds, stenosis severity,
documentation rules, and waveform interpretation.
"""

import os
import logging
from pathlib import Path
from decouple import config
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter

logger = logging.getLogger("agent.kadian")

class Kadian:
    """
    Kadian is Lumen’s clinical knowledge agent.

    He specializes in:
    - PSV/EDV interpretation
    - ICA/CCA ratio thresholds
    - Ultrasound protocol logic
    - Clinical documentation fields
    """

    def __init__(self):
        """
        Load and embed all PDF protocol documents from brain/clinical/
        for clinical question answering via LangChain.
        """
        logger.info("Initializing Kadian agent...")

        openai_key = config("OPENAI_API_KEY")
        clinical_path = "brain/clinical"

        # Load all .pdf files from clinical knowledge base
        pdf_docs = []
        for fname in os.listdir(clinical_path):
            if fname.endswith(".pdf"):
                try:
                    path = os.path.join(clinical_path, fname)
                    loader = PyMuPDFLoader(path)
                    loaded = loader.load()
                    pdf_docs.extend(loaded)
                    logger.debug(f"Loaded {len(loaded)} pages from: {fname}")
                except Exception as e:
                    logger.warning(f"Failed to load {fname}: {e}")

        # Chunk for retrieval
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(pdf_docs)
        logger.info(f"Split {len(pdf_docs)} PDF pages into {len(chunks)} chunks.")

        # Embed documents
        embeddings = OpenAIEmbeddings(openai_api_key=openai_key)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        logger.info("Created FAISS vectorstore for Kadian.")

        # Setup retrieval QA
        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo", openai_api_key=openai_key)
        self.qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())

        logger.info("Kadian is ready for clinical questions.")

    def answer(self, question: str) -> str:
        """
        Use LangChain's RetrievalQA to answer a clinical question.

        Args:
            question (str): Clinical, criteria, or protocol question.

        Returns:
            str: Answer based on embedded protocol PDFs.
        """
        logger.info(f"Kadian received question: {question}")
        result = self.qa.run(question)
        logger.info("Kadian completed response generation.")
        return result
