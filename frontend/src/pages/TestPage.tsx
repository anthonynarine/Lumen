import React from "react";
import { useEffect, useState } from "react";
import { AuthTester } from "../auth/utils/TestAuth";
import PageContainer from "../layout/MainContent/PageContainer";
import { AuthProvider } from "../auth/context/AuthProvider";
import { askAgent } from "../api/ragApi";
import { logger } from "../utils/logger";

const TestPage = () => {
  const [ragResponse, setRagResponse] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      askAgent({ question: "How does the auth system work" })
        .then((res) => {
          logger.info("✅ RAG Agent response:", res);
          setRagResponse(`Agent ${res.agent} says: ${res.answer}`);
        })
        .catch((err) => {
          logger.error("❌ Failed to reach RAG Agent:", err);
          setRagResponse("RAG Agent unavailable.");
        });
    }
  }, []);

  return (
    <AuthProvider>
      <PageContainer >
        <header>
          <h1 className="text-3xl font-bold mb-2">
            Testing API Login, Register, Logout, and Rag
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Vascular Reporting Platform — Under Construction 🚧
          </p>
        </header>

        <section className="auth-dev mb-6">
          <AuthTester />
        </section>

        {import.meta.env.DEV && ragResponse && (
          <section className="rag-dev mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>{ragResponse}</p>
          </section>
        )}

        <footer className="mt-10 text-xs text-gray-400">
          Auth system live — routing & UI coming next.
        </footer>
      </PageContainer>
    </AuthProvider>
  );
};

export default TestPage;
