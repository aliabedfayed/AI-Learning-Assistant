export interface Summary {
    success: boolean
    data: SummaryData
    message: string
}

export interface SummaryData {
    documentId: string
    title: string
    summary: string
}
