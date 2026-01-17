export interface AllFlashcards {
    success: boolean
    count: number
    data: FlashcardSet[]
}

export interface FlashcardSet {
    _id: string
    userId: string
    documentId?: DocumentId
    cards: Card[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface DocumentId {
    _id: string
    title: string
}

export interface Card {
    question: string
    answer: string
    difficulty: string
    lastReviewed?: string
    reviewCount: number
    isStarred: boolean
    _id: string
}
