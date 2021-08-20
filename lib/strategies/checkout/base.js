export class Checkout {
  constructor (context, config) {
    this.token = config.token
    this.route = context.route
    this.apiUrl = config.apiUrl
    this.baseUrl = config.baseUrl
    this.path = config.path

    this.email = config.email
  }
}
