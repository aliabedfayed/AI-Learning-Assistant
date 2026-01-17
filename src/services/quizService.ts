import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { DocumentQuizzes } from '@/interfaces/quizzes/documentQuizzes';
import { QuizById } from '@/interfaces/quizzes/quizById';
import { SubmitQuiz } from '@/interfaces/quizzes/submitQuiz';
import { QuizResults } from '@/interfaces/quizzes/quizResult';
import { DeleteQuiz } from '@/interfaces/quizzes/deleteQuiz';

export const getQuizzesForDocument = async (documentId: string): Promise<DocumentQuizzes> => {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
    return response.data;
};

export const getQuizById = async (quizId: string): Promise<QuizById> => {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
    return response.data;
};

export const submitQuiz = async (quizId: string, answers: {
    questionIndex: number;
    selectedAnswer: string;
}[]): Promise<SubmitQuiz> => {
    const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), {
        answers
    });
    return response.data;
};

export const getQuizResults = async (quizId: string): Promise<QuizResults> => {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
    return response.data;
};

export const deleteQuiz = async (quizId: string): Promise<DeleteQuiz> => {
    const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
    return response.data;
};