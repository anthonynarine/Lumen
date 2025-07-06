# 🧠 Dubin – Modular LangGraph Agent System (Lumen)

Dubin is a FastAPI-based, LangGraph-powered smart routing microservice that handles natural language Q\&A for the Lumen vascular ultrasound reporting system. It uses OpenAI + LangChain + FAISS to:

* Classify questions using a dedicated LLM prompt
* Route them to modular LangGraph `Runnable` agents:

  * 🧠 **Julia** → Developer knowledge (Django, architecture, backend code)
  * 🩺 **Kadian** → Clinical knowledge (PSV/EDV, stenosis criteria, CPT/ICD codes)
  * 🔐 **KeyMaker** → Auth and frontend logic (Auth API, JWT, roles)

---

## 🔁 Request Lifecycle

```mermaid
flowchart TD
    A[Frontend Request\n/agent/master/ask] --> B[Dubin Graph Entry\n(classify node)]
    B -->|"dev"| C[RunnableJulia.invoke()]
    B -->|"clinical"| D[RunnableKadian.invoke()]
    B -->|"auth"| E[RunnableKeyMaker.invoke()]

    C --> F[Julia Agent.qa.invoke(query)]
    D --> G[Kadian Agent.answer(query)]
    E --> H[KeyMaker Agent.qa.invoke(query)]

    F --> I[Answer + Sources → State]
    G --> I
    H --> I

    I --> J[JSON Response Returned]
```

---

## ⚙️ Execution Flow (LangGraph + FastAPI)

| Step | Component         | Description                                                         |
| ---- | ----------------- | ------------------------------------------------------------------- |
| 1️⃣  | FastAPI Route     | Accepts POST `/agent/master/ask` with `{ question: "..." }`         |
| 2️⃣  | Dubin Graph       | FSM starts at `classify` node                                       |
| 3️⃣  | Classifier Node   | GPT-3.5 returns `"dev"`, `"clinical"`, or `"auth"`                  |
| 4️⃣  | LangGraph Routing | Directs to `RunnableJulia`, `RunnableKadian`, or `RunnableKeyMaker` |
| 5️⃣  | Runnable.invoke() | Wrapper injects metadata and calls real agent logic                 |
| 6️⃣  | Agent Logic       | Calls LangChain QA chain or `.answer()` method                      |
| 7️⃣  | Sources Extracted | Retrieved doc paths are injected into `state["sources"]`            |
| 8️⃣  | State Returned    | Final state contains `output`, `agent`, and optional `sources`      |

---

## 🧠 Agent: Julia (Developer Agent)

**Focus:** Lumen backend architecture (Django, serializers, calculators)

**Source:** `brain/backend/` — all `.py`, `.json`, `.md`

**Can answer:**

* "Where is the ICA calculator defined?"
* "What serializer is used for CarotidExam?"
* "What does the PDF export service do?"

---

## 🩺 Agent: Kadian (Clinical Agent)

**Focus:** Ultrasound diagnostic criteria and documentation rules

**Source:** `brain/clinical/` — carotid, renal, ABI, mesenteric PDFs

**Can answer:**

* "What PSV indicates 70% ICA stenosis?"
* "What is RAR and how is it used?"
* "What CPT code applies to unilateral renal duplex?"

---

## 🔐 Agent: KeyMaker (Auth Agent)

**Focus:** Auth API logic, frontend integration, token handling

**Source:** `brain/auth_fe/` — all `.ts`, `.tsx`, `.md` frontend auth files

**Can answer:**

* "How does the token refresh work in useAuth?"
* "What claims are embedded in JWTs?"
* "What role is required for editing reports?"

---

## 🧠 Classifier Prompt

```text
You are Dubin, the intelligent routing agent for the Lumen vascular ultrasound platform.
Classify the user's question into one of these categories:

1. dev
   - Django backend (models, serializers, views)
   - React frontend (components, forms, validation)
   - APIs, architecture, Redis, Celery
   - JSON templates, PDF, HL7 generation

2. clinical
   - PSV/EDV values, ICA/CCA ratio, stenosis
   - Carotid, renal, mesenteric, IVC protocols
   - Waveform, plaque, report logic

3. auth
   - authApi.ts, useAuth, AuthProvider
   - token refresh logic, JWT auth_integration
   - permission utils, HasRole, access control

Respond with one word: 'dev', 'clinical', or 'auth'. If unsure, pick 'dev'.
```
