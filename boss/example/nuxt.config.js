const { resolve } = require('path')

module.exports = {
  target: "static",
  components: true,
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    "@nuxtjs/axios",
    "../node_modules/@nuxtjs/auth-next",
    { handler: require('../') },
  ],
  boss: {
    debug: true
  },
  auth: {
    cookie: {
      maxAge: 36000
    },
    redirect: {
      login: '/login',
      logout: '/logout',
      callback: '/login',
      // home: '/'
      home: false
    },
    strategies: {
      local: false,
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_ID,
        audience: process.env.AUTH0_AUDIENCE,
        scope: ['openid', 'profile', 'email'],
        redirectUri: process.env.BASE_URL + "/login",
        logoutRedirectUri: process.env.BASE_URL + "/logout"
      }
    }
  },
}
