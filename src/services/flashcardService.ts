import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { AllFlashcards } from '@/interfaces/flashcards/allFlashcards';
import { Flashcards } from '@/interfaces/flashcards/flashcards';
import { Review } from '@/interfaces/flashcards/review';
import { Star } from '@/interfaces/flashcards/star';
import { Delete } from '@/interfaces/flashcards/delete';

export const getAllFlashcardSets = async (): Promise<AllFlashcards> => {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
    return response.data;
};

export const getFlashcardsForDocument = async (documentId: string): Promise<Flashcards> => {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
    return response.data;
};

export const reviewFlashcard = async (cardId: string, cardIndex?: number): Promise<Review> => {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
    return response.data;
};

export const toggleStar = async (cardId: string): Promise<Star> => {
    const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
    return response.data;
};

export const deleteFlashcardSet = async (id: string): Promise<Delete> => {
    const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
    return response.data;
};