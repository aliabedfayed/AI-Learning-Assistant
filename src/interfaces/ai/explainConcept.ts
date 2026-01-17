export interface Concept {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    concept: string
    explanation: string
    relevantChunks: number[]
}
