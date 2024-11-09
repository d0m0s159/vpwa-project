import type { Message } from './message'
import type { User } from './user'

export interface Channel {
    messageList: Message[];
    name: string;
    userlist: User[];
    admin: string;
    public: boolean;
}
