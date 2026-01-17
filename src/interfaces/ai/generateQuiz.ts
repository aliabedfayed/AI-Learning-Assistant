export interface GenerateQuiz {
    success: boolean
    data: Quiz
    message: string
}

export interface Quiz {
    userId: string
    documentId: string
    title: string
    questions: Question[]
    userAnswers: any[]
    score: number
    totalQuestions: number
    completedAt: any
    _id: string
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
