export interface SerializedMessage {
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: UserInterface
}

export interface UserInterface {
    id: number
    nickname: string
    email: string
    status: 'active' | 'dnd' | 'offline'
}