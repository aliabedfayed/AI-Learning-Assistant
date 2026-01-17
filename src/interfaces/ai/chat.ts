export interface Chat {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    question: string
    answer: string
    relevantChunks: number[]
    chatHistoryId: string
}
