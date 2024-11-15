import User from '#models/user';
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    console.log(data)
    const user = await User.create(data);

    return User.accessTokens.create(user)
  }
  
  async login({ request }: HttpContext) {
    const {email, password} = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    return User.accessTokens.create(user)
  }
  
  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return 1
  }
  
  async me({ auth }: HttpContext) {
    await auth.check()

    return {
      user: auth.user
    }
  }
  
}