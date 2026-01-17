export interface DocumentById {
    success: boolean
    data: Data
}

export interface Data {
    _id: string
    userId: string
    title: string
    fileName: string
    filePath: string
    fileSize: number
    extractedText: string
    status: string
    chunks: Chunk[]
    uploadDate: string
    lastAccessed: string
    createdAt: string
    updatedAt: string
    __v: number
    flashcardCount: number
    quizCount: number
}

export interface Chunk {
    content: string
    pageNumber: number
    chunkIndex: number
    _id: string
}
