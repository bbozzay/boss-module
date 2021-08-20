const { resolve, basename, normalize } = require('path')
const { readdirSync } = require('fs')
// import { buildComponents } from "./components.js";

module.exports = async function (moduleOptions) {
  const options = {
    baseUrl: process.env.BASEURL,
    strategies: {
      stripe: {
        publishableKey: null
      }
    },
    // Redirect to the login page instead of calling login directly
    middleware: {
      requireLogin: {
        redirect: false
      }
    },
    roles: {
      default: "premium"
    },
    authStrategy: null,
    checkoutStrategy: 'stripe',
    ...this.options.boss,
    ...moduleOptions,
    plugins: null,
    debug: !!process.env.DEBUG,
    target: 'static'
  }
  const namespace = 'boss'
  // if (!options.apiUrl) options.apiUrl = "/.netlify/functions/";

  options.apiUrl = options.apiBaseUrl + '/.netlify/functions/'

  // Auto add the stripe module if it's specified as a strategy
  if (options.strategies.stripe) {
    if (!options.strategies.stripe.publishableKey) {
      throw 'boss.strategies.stripe.publishableKey must be defined'
    }
    this.requireModule([resolve(__dirname, '../node_modules/nuxt-stripe-module'), {
      publishableKey: options.strategies.stripe.publishableKey
    }])
    options.authStrategy = 'auth0'
  }

  if (options.strategies.elasticMail) {
    options.strategies.elasticMail.apiBaseUrl = options.strategies.elasticMail.apiBaseUrl ? options.strategies.elasticMail.apiBaseUrl : "https://api.elasticemail.com/v2/"
  }

  const addPlugin = (path, pushPlugin) => {
    const { dst } = this.addTemplate({
      src: resolve(__dirname, path),
      fileName: 'boss/' + path,
      options
    })
    if (pushPlugin) {
      this.options.plugins.push(resolve(this.options.buildDir, dst))
    }
  }
  const syncDir = (folder, level) => {
    let pathsToSync = readdirSync(resolve(__dirname, folder))
    pathsToSync = pathsToSync.filter(p => p !== 'module.js')
    for (const path of pathsToSync) {
      // if it's a file
      if (path.includes('js') || path.includes('vue')) {
        addPlugin(folder + '/' + path, !!(path == 'components.js' || path == 'plugin.js' || path == 'store.js' || path == 'middleware.js'))
      } else {
        syncDir(folder + '/' + path, level++)
      }
    }
  }
  syncDir('./', 0)

  // Append any plugins that should hook $auth and $boss
  if(this.options.boss.plugins) {
    this.options.boss.plugins.forEach(plugin => {
        let path = normalize(plugin.src);
        const { dst } = this.addTemplate({
          src: path,
          fileName: basename(plugin.src),
          options
        })
        this.options.plugins.push(resolve(this.options.buildDir, dst))
    })
  }
  // Automatically Update options with the assigned global middleware
  this.options.router.middleware.push('boss')
}

module.exports.meta = require('../package.json')
