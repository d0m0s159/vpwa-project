import User from '#models/user';
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  
  //table data needs modification
  async register({ request }: HttpContext) {
    const data : any = await request.validateUsing(registerValidator)
    data.status = 'active'
    
    
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
    return {message: 'sucess'}
  }
  
  async me({ auth }: HttpContext) {
    console.log('here')
    await auth.authenticate()
    console.log(auth.user)
    return {
      user: auth.user
    }
  }
  
}