export interface QuizResults {
    success: boolean
    data: Data
}

export interface Data {
    quiz: Quiz
    results: Result[]
}

export interface Quiz {
    id: string
    title: string
    document: Document
    score: number
    totalQuestions: number
    completedAt: string
}

export interface Document {
    _id: string
    title: string
}

export interface Result {
    questionIndex: number
    question: string
    options: string[]
    correctAnswer: string
    selectedAnswer: string
    isCorrect: boolean
    explanation: string
}
