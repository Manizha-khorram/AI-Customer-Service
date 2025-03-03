"use client";

import type { NextApiRequest, NextApiResponse } from 'next';
import { useChat } from 'ai/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 

const fetchKnowledgeBase = async (queryText: string) => {
  // Query Firestore for documents containing keywords
  const q = query(collection(firestore, 'knowledgeBase'), where('keywords', 'array-contains', queryText));
  const querySnapshot = await getDocs(q);

  // Combine text from all documents
  const documents = querySnapshot.docs.map(doc => doc.data().text).join(' ');

  return documents;
};

const generateResponse = async (queryText: string, context: string) => {
  // Construct prompt with context and query
  const prompt = `Based on the following knowledge base: ${context}\nAnswer the query: ${queryText}`;

  // Fetch response from OpenAI
  const response = await getOpenAIResponse(prompt);
  return response;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {
      const context = await fetchKnowledgeBase(query);

      const response = await generateResponse(query, context);

      return res.status(200).json({ response });
    } catch (error) {
      console.error('Error handling the request:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
