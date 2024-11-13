import { AuthStateInterface } from '../stores/useAuthStore'
import { ChannelsStateInterface} from '../stores/module-channels'

export interface StateInterface {
    auth: AuthStateInterface
    channels: ChannelsStateInterface
  }