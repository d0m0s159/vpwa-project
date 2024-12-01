/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import ChannelsController from '#controllers/channels_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('auth/register', [AuthController, 'register']).as('auth.register')
router.post('auth/login', [AuthController, 'login']).as('auth.login')
router.post('auth/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
router.get('auth/me', [AuthController, 'me']).as('auth.me')
router.post('/load/channels/', [ChannelsController, 'loadChannels'])
router.post('channels/ensure', [ChannelsController, 'joinChannel'])
