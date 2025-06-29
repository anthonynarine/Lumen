            ┌────────────────────┐
            │  External Request  │
            │  (e.g. frontend)   │
            └────────┬───────────┘
                     │
            POST /agent/master/ask
                     │
             via FastAPI router
                     ▼
        ┌──────────────────────────┐
        │  Dubin Master Agent      │
        │  (master_agent/dubin.py) │
        └──────────────────────────┘
                     │
           Step 1: Classify question
                     │
            Uses LLM classifier (LangChain)
                     ▼
    ┌──────────────┐           ┌───────────────----┐
    │ Label: "dev" │           │ Label: "clinical" │
    └────┬─────────┘           └─────────┬───────--┘
         │                               │
         ▼                               ▼
┌───────────────────┐        ┌────────────────────┐
│ Julia Agent (dev) │        │ Kadian Agent       │
│ agents/julia.py   │        │ agents/kadian.py   │
└───────────────────┘        └────────────────────┘
         │                               │
         ▼                               ▼
  Step 2: Use RAG (Embedding + QA Chain)
         │                               │
         ▼                               ▼
Returns relevant answer         Returns clinical answer
         │                               │
         └──────────────┬───────────────-┘
                        ▼
              Returns JSON response


🧠 Dubin – Modular RAG Agent System (Lumen)

    Dubin is a FastAPI-based smart routing microservice that powers natural language Q&A for the Lumen vascular reporting system. It uses LangChain + OpenAI to:

    Classify questions as "dev" or "clinical"

    Route them to specialized sub-agents:

    🧠 Julia → Development knowledge of Django backend

    🩺 Kadian → Clinical protocols and diagnostic criteria


flowchart TD

    A[Frontend Request<br>/agent/master/ask] --> B[Dubin Router<br>(Classification)]
    B -->|dev| C[Julia Agent]
    B -->|clinical| D[Kadian Agent]
    C --> E[Backend Codebase<br>brain/backend/]
    D --> F[Clinical Markdown<br>brain/clinical/]
    C --> G[FAISS + LangChain QA]
    D --> H[FAISS + LangChain QA]
    G --> I[Answer Returned]
    H --> I


    
⚙️ How It All Works — Step by Step

    Step	       Component	                  Description

    1️⃣	            FastAPI App (app.py)	     Starts server, loads routes and logging
    2️⃣	            POST /agent/master/ask	     Accepts { "question": "..." } from frontend
    3️⃣	            Dubin Router (dubin.py)	     Uses LangChain classification prompt to route
    4️⃣	            Classifier Output	         "dev" → Julia, "clinical" → Kadian
    5️⃣	            Julia / Kadian Called	     Relevant agent handles the question using RAG
    6️⃣	            FAISS Vector Search	         Retrieves relevant documents using OpenAI embeddings
    7️⃣	            LangChain QA Chain	         Constructs a final answer using retrieved context
    8️⃣	            JSON Response Returned	     { "agent": "julia", "answer": "..." }


🧠 Agent: Julia (Developer Agent)
    Focus: Lumen backend structure, models, architecture

    Powered by: LangChain + OpenAI + FAISS

    Embeds: All .py, .md, .json files in:
    rag_agent_dubin/brain/backend/


Can answer:

    “Where is the Exam model defined?”

    “How does the ICA/CCA ratio calculator work?”

    “What are the endpoints for report PDFs?”


🩺 Agent: Kadian (Clinical Agent)

    Focus: Clinical criteria, velocity thresholds, protocols

    Powered by: LangChain + OpenAI + FAISS

    Embeds: All .md protocol files in:
    rag_agent_dubin/brain/clinical/


Can answer:

    “What PSV defines 70% stenosis of ICA?”

    “What is the CPT code for renal duplex?”

    “How is RAR calculated?”



Classifier Prompt (Dubin)

    Example system prompt:

    You are a classifier. Label the user’s question as:
    - "dev" if it relates to software, backend, or Lumen architecture
    - "clinical" if it relates to ultrasound protocols or diagnostic criteria

    Respond with only one word: "dev" or "clinical".