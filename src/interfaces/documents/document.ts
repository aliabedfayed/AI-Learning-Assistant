export interface Documents {
    success: boolean
    count: number
    data: Document[]
}

export interface Document {
    _id: string
    userId: string
    title: string
    fileName: string
    filePath: string
    fileSize: number
    status: string
    uploadDate: string
    lastAccessed: string
    createdAt: string
    updatedAt: string
    __v: number
    flashcardCount: number
    quizCount: number
}
