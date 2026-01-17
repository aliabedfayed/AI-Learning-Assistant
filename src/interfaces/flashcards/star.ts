export interface Star {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    _id: string
    userId: string
    documentId: string
    cards: Card[]
    createdAt: string
    updatedAt: string
    __v: number
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
