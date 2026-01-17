export interface DocumentQuizzes {
    success: boolean
    count: number
    data: Daum[]
}

export interface Daum {
    _id: string
    userId: string
    documentId: any
    title: string
    questions: Question[]
    userAnswers: UserAnswer[]
    score: number
    totalQuestions: number
    completedAt: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Question {
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
    difficulty: string
    _id: string
}

export interface UserAnswer {
    questionIndex: number
    selectedAnswer: string
    isCorrect: boolean
    answeredAt: string
    _id: string
}
