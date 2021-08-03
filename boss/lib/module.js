const { resolve, join } = require('path')
// import { buildComponents } from "./components.js";

module.exports = async function (moduleOptions) {
  const options = {
    ...this.options.boss,
    ...moduleOptions,
    debug: process.env.DEBUG ? true : false,
  }
  // console.log("ops", this.options.boss)
  const namespace = "boss";
  if (!options.apiBaseUrl) options.apiBaseUrl = "/.netlify/functions/";


  // Auto load the nuxt-auth module since it's required for nuxt-boss
    // this.addPlugin({
    //   src: resolve(__dirname, './plugin.js'),
    //   fileName: "plugin.js",
    //   options
    // })
  const {dst} = this.addTemplate({
    src: resolve(__dirname, './plugin.js'),
    fileName: "plugin.js",
    options
  })
  // await this.requireModule([resolve(__dirname, "../node_modules/@nuxtjs/auth-next")])

  this.options.plugins.push(resolve(__dirname, './store.js'));
   this.options.plugins.push(resolve(this.options.buildDir, dst));
    // this.addPlugin({
    //   src: resolve(__dirname, './store.js'),
    //   fileName: "store.js",
    //   options
    // })
}

module.exports.meta = require('../package.json')
