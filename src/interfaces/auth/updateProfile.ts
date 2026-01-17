export interface UpdateProfileData {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    id: string
    username: string
    email: string
    profileImage: any
}
