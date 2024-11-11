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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  router.post('/register', [AuthController, 'register']).as('auth.register')
  router.post('/login', [AuthController, 'login']).as('auth.login')
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
  router.get('/me', [AuthController, 'me']).as('auth.me')
}).prefix('auth')