import { SerializedMessage } from 'src/contracts'
import type { User } from '../contracts/'

export interface Channel {
    messageList: SerializedMessage[];
    name: string;
    userlist: User[];
    admin: string;
    public: boolean;
}
