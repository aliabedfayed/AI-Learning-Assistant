import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { GenerateQuiz } from '@/interfaces/ai/generateQuiz';
import { Flashcards, GenerateFlashcardsOptions } from '@/interfaces/flashcards/flashcards';
import { Summary } from '@/interfaces/ai/summary';
import { Chat } from '@/interfaces/ai/chat';
import { ChatHistory } from '@/interfaces/ai/chatHistory';
import { Concept } from '@/interfaces/ai/explainConcept';

export const generateFlashcards = async (documentId: string, options?: GenerateFlashcardsOptions): Promise<Flashcards> => {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
        documentId,
        ...options
    });
    return response.data;
};

export const generateQuiz = async (documentId: string, options?: GenerateFlashcardsOptions): Promise<GenerateQuiz> => {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
        documentId,
        ...options
    });
    return response.data;
};

export const generateSummary = async (documentId: string): Promise<Summary> => {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
        documentId
    });
    return response.data;
};

export const chat = async (documentId: string, question: string): Promise<Chat> => {
    const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
        documentId,
        question
    });
    return response.data;
};

export const explainConcept = async (documentId: string, concept: string): Promise<Concept> => {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
        documentId,
        concept
    });
    return response.data;
};

export const getChatHistory = async (documentId: string): Promise<ChatHistory> => {
    const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(
        documentId
    ));
    return response.data;
};