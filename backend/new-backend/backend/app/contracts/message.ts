export interface SerializedMessage {
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: User
}

export interface User {
    id: number
    nickname: string
    email: string
}