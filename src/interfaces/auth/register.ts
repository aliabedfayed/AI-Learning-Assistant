export interface RegisterResponse {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    user: User
    token: string
}

export interface User {
    id: string
    username: string
    email: string
    profileImage: any
    createdAt: string
}
