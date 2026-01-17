export interface LoginData {
    success: boolean
    user: UserData
    token: string
    message: string
}

export interface UserData {
    id: string
    username: string
    email: string
    profileImage: any
}
