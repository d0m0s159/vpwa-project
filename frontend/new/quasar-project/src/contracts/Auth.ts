export interface ApiToken {
type: 'bearer'
token: string
expires_at?: string
expires_in?: number
}

export interface RegisterData {
email: string
password: string
passwordConfirmation: string
nickname: string
firstname: string
surname: string
}

export interface LoginCredentials {
email: string
password: string
}

export interface User {
id: number
email: string
}
