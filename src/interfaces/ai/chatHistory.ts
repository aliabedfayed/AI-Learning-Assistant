export interface ChatHistory {
    success: boolean
    data: ChatMessage[]
    message: string
}

export interface ChatMessage {
    role: string
    content: string
    timestamp: Date
    relevantChunks: number[]
    _id: string
}
