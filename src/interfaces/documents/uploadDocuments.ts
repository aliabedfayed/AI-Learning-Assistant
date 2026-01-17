export interface UploadDocument {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    userId: string
    title: string
    fileName: string
    filePath: string
    fileSize: number
    extractedText: string
    status: string
    _id: string
    chunks: any[]
    uploadDate: string
    lastAccessed: string
    createdAt: string
    updatedAt: string
    __v: number
}
