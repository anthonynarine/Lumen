// src/test/ragTest.ts

import { askAgent } from '@/api/ragApi';
import { logger } from '@/utils/logger';

/**
 * One-time dev test to verify connection with the Dubin RAG system.
 */
export const testRagAgent = async () => {
  try {
    logger.info('🔌 Testing RAG agent connectivity...');
    const result = await askAgent({ question: 'What is ICA/CCA ratio?' });
    logger.info('✅ RAG agent response received:', result);
  } catch (error) {
    logger.error('❌ RAG agent request failed:', error);
  }
};
