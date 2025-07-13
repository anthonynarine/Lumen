// File: src/api/ragApi.ts

import axios from 'axios';

/**
 * Base URL for the RAG assistant API.
 * Loaded from environment variable: VITE_RAG_API_URL
 * Example: https://lumen-rag-agent.onrender.com/ask
 */
const RAG_API_URL = import.meta.env.VITE_RAG_API_URL;

/**
 * Payload structure for submitting a query to the assistant.
 */
export interface RagQueryPayload {
  question: string;     // User's question (required)
  userId?: string;      // Optional: user identifier for context/memory
}

/**
 * Expected response format from the RAG backend.
 */
export interface RagResponse {
  agent: string;         // Which sub-agent handled the query (e.g. Julia, Kadian)
  answer: string;        // Final answer returned to the user
  sources?: string[];    // Optional source documents or links (for UI display)
}

/**
 * askAgent
 *
 * Sends a question to the RAG assistant backend and returns its response.
 *
 * @param payload - Object containing the user's question and optional userId
 * @returns Promise<RagResponse> - The assistant's structured answer
 *
 * @example
 * const res = await askAgent({ question: "What is ICA/CCA ratio?" });
 * console.log(res.answer); // → "ICA/CCA ratio is calculated by..."
 */
export const askAgent = async (payload: RagQueryPayload): Promise<RagResponse> => {
  const response = await axios.post<RagResponse>(RAG_API_URL, payload);
  return response.data;
};
