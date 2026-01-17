export interface Flashcards {
    success: boolean
    data: FlashcardSet[]
    message: string
}

export interface FlashcardSet {
    userId: string
    documentId: string
    cards: Card[]
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Card {
    question: string
    answer: string
    difficulty: string
    lastReviewed: any
    reviewCount: number
    isStarred: boolean
    _id: string
}

export interface GenerateFlashcardsOptions {
    count?: number
    numQuestions?: number
    title?: string
}

