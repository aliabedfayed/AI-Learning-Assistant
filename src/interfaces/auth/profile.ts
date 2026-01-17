export interface ProfileData {
    success: boolean
    data: Data
}

export interface Data {
    id: string
    username: string
    email: string
    profileImage: any
    createdAt: string
    updatedAt: string
}
