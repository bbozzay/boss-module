require('dotenv').config()
// require('dotenv').config({ path: '../../example/.env' })
const init = (scope) => {
  return {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_SECRET,
    audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
    scope
    // token: context.identityContext.token,
  }
}

module.exports = {
  init
}
