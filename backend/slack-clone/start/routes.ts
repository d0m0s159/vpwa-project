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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  router.post('/auth/register', [AuthController, 'register']).as('auth.register')
  router.post('/auth/login', [AuthController, 'login']).as('auth.login')
  router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
  router.get('/auth/me', [AuthController, 'me']).as('auth.me')
}).prefix('auth')