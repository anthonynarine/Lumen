frontend/
├── public/                       # Static assets
├── src/
│   ├── api/                      # Axios instances (auth, lumen, rag)
│   ├── auth/                     # Login page, auth service, token utils
│   ├── context/                  # AuthContext, ExamContext, etc.
│   ├── components/               # Reusable UI (RAGDrawer, Button, Sidebar)
│   ├── features/
│   │   ├── carotid/              # Carotid exam forms, views, utils
│   │   ├── renal/                # Renal exam modules (later)
│   │   └── shared/               # MeasurementTable, calculators, helpers
│   ├── hooks/                    # Custom hooks (e.g., useAuthFetch)
│   ├── layout/                   # AppShell, Navbar, Sidebar
│   ├── pages/                    # Route-level views (Login, Dashboard, ReportView)
│   ├── router/                   # React Router + protected route logic
│   ├── styles/                   # Tailwind config, globals
│   ├── utils/                    # Token helpers, validators
│   ├── App.tsx
│   └── main.tsx
├── .env
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
