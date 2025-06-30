import axios from 'axios';

const RAG_API_URL = import.meta.env.VITE_RAG_API_URL;

export interface RagQueryPayload {
  question: string;
  userId?: string;
}

export interface RagResponse {
  agent: string;
  answer: string;
  sources?: string[];
}

export const askAgent = async (payload: RagQueryPayload): Promise<RagResponse> => {
  const response = await axios.post<RagResponse>(`${RAG_API_URL}`, payload);
  return response.data;
};
