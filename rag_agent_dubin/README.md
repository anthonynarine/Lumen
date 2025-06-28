# 🤖 Dubin RAG Agent (FastAPI + LangChain)

    Starting server  uvicorn app:app --reload --port 8001

This microservice powers a modular, document-aware AI assistant for the Lumen vascular reporting system. It uses FastAPI + LangChain to answer clinical and developer questions by routing them to intelligent sub-agents.

---

🧠 Current Agent Architecture

    Agent Name	  Role
    Dubin	      Master router agent
    Angela	      Development/API expert (LangChain RAG on endpoints.md)


📂 Folder Structure

    rag_agent_dubin/
    ├── agents/              # Sub-agents (e.g. Angela)
    ├── dubin/               # Master router logic
    ├── documents/           # Source documents for LangChain
    ├── app.py               # FastAPI entrypoint
    ├── router.py            # /agent/master/ask endpoint
    ├── requirements.txt     # Dependencies
    ├── .env                 # OpenAI key (not tracked)
    ├── .gitignore
    └── README.md



🔧 Planned Expansion

    Agent Name	        Role
    Kadian	            Macro template generator (based on plaque/morph/PSV)
    Olin	            Carotid findings interpreter (e.g. % stenosis logic)
    Maribel 	        CPT/ICD billing codes explainer
    Judy	            Criteria interpreter (e.g. carotid.json)
    Julia	            Frontend + serializer + backend logic


🧪 Future Features

    Query classifier (LLM or keyword routing)

    Document auto-reloader

    Agent feedback (👍 / 👎)

    Role-based response filters (tech vs MD)

    Source document linking in response


🧑‍💻 Made with ❤️ by Anthony Narine.

    Inspired by the Mount Sinai + Navix vascular team 

---






