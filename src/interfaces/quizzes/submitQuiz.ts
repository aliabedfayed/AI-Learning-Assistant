export interface SubmitQuiz {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    quizId: string
    score: number
    correctCount: number
    totalQuestions: number
    percentage: number
    userAnswers: UserAnswer[]
}

export interface UserAnswer {
    questionIndex: number
    selectedAnswer: string
    isCorrect: boolean
    answeredAt: string
}
