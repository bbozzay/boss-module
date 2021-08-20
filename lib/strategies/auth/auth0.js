import { BaseAuth } from './base'
import * as utils from '../../utils'
export class Auth0 extends BaseAuth {
  async fetchUserRoles () {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}auth0_get_user_roles`, this.token)
    return response
  }
}
