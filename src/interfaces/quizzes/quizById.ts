export interface QuizById {
    success: boolean
    data: Data
}

export interface Data {
    _id: string
    userId: string
    documentId: string
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
