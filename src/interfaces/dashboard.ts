export interface Dashboard {
    success: boolean
    data: Data
}

export interface Data {
    overview: Overview
    recentActivity: RecentActivity
}

export interface Overview {
    totalDocuments: number
    totalFlashcardSets: number
    totalFlashcards: number
    reviewedFlashcards: number
    starredFlashcards: number
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    studyStreak: number
}

export interface RecentActivity {
    documents: Document[]
    quizzes: Quiz[]
}

export interface Document {
    _id: string
    title: string
    fileName: string
    status: string
    lastAccessed: string
}

export interface Quiz {
    _id: string
    documentId: DocumentId
    title: string
    score: number
    totalQuestions: number
    completedAt: any
}

export interface DocumentId {
    _id: string
    title: string
}
