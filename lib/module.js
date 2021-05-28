// module.js
const { resolve, join } = require('path')
const { readdirSync } = require('fs')

export default function(moduleOptions) {
  // const { nuxt } = this;
    // nuxt.hook('ready', async nuxt => {
    //   console.log("all plugins ready", nuxt)
    // })

  const options = {
    ...moduleOptions,
    debug: true,
    paths: {
      login: "/login",
      signup: "/signup"
    }
  }
  console.log("Load Module")

  // Default namespace if user doesn't override it in the options arg in nuxt.config.modules
  if (!options.namespace) options.namespace = "boss";
  const { namespace } = options;
  // if (!options.netlify) options.netlify = false;

  // role name to use if none is set in page.meta.requireRole
  if (!options.requireRole) options.requireRole = {
    default: "premium",
  }

  // apiBaseUrl to use for lambda functions helpers
  if (!options.apiBaseUrl) options.apiBaseUrl = "/.netlify/functions/";

  // set default values for elastic
  if (options.elasticMail) {
    options.elasticMail.apiBaseUrl = options.elasticMail.apiBaseUrl ? options.elasticMail.apiBaseUrl : "https://api.elasticemail.com/v2/"
  }

    // add all of the initial plugins
  const pluginsToSync = [
    'components/index.js',
    'store/index.js',
    'plugins/index.js',
    'debug.js',
    'middleware/index.js'
  ]
  for (const pathString of pluginsToSync) {
    // ** NOTE: we now use namespace here: **
    // Example: $boss/debug.js
    // https://nuxtjs.org/docs/2.x/internals-glossary/internals-module-container#addplugin-template
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join(namespace, pathString),
      options
    })
  }
    // sync all of the files and folders to revelant places in the nuxt build dir (.nuxt/)
  const foldersToSync = ['plugins/helpers', 'plugins/api', 'store/modules', 'components/lib', 'utilities', 'middleware/access']
  for (const pathString of foldersToSync) {
    const path = resolve(__dirname, pathString)
    for (const file of readdirSync(path)) {
      // https://nuxtjs.org/docs/2.x/internals-glossary/internals-module-container#addtemplate-template
      this.addTemplate({
        src: resolve(path, file),
        fileName: join(namespace, pathString, file),
        options
      })
    }
  }
  return options
}
module.exports.meta = require('./package.json')