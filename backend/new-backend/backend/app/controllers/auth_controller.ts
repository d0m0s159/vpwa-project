import User from '#models/user';
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  
  //table data needs modification
  async register({ request }: HttpContext) {
    const data : any = await request.validateUsing(registerValidator)
    data.status = 'active'
    
    
    const user = await User.create(data);
    await user.related('channels').attach([1, 2])

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
    return {message: 'sucess'}
  }
  
  async me({ auth }: HttpContext) {
    await auth.authenticate()
    return {
      user: auth.user
    }
  }
  
}