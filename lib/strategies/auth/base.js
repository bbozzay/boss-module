import * as utils from '../../utils'
export class BaseAuth {
  constructor ({ apiUrl, token, prefix }) {
    this.apiUrl = apiUrl
    this.token = token
    this.prefix = prefix || 'auth'
  }

  fetchEndpoint (route) {
    return utils.Lambda.lambdaGet(this.apiUrl + route, this.token)
  }

  updateEndpoint (route, data) {
    return utils.Lambda.lambdaPost(this.apiUrl + route, this.token, data)
  }

  fetchUser () {
    return this.fetchEndpoint(`${this.prefix}_fetch_user`)
  }

  updateUser (data) {
    return this.updateEndpoint(`${this.prefix}_update_user`, data)
  }

  updateAppMeta (data) {
    return this.updateEndpoint(`${this.prefix}_update_app_metadata`, data)
  }

  fetchUserRoles () {
    throw 'Base Fetch User method not configured'
  }
}
