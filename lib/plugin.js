// plugins/index.js
import Stripe from './api/stripe';
import * as user from './helpers/user';
import Auth from './helpers/auth';
import Authenticated from './helpers/authenticated';
import { lambdaGet, lambdaPost } from './api/lambda';
import * as helpers from './helpers/index.js'
// get the options out using lodash templates
// const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace from the options
// const { namespace, apiBaseUrl, elasticMail, devMode } = options

  class Boss {
    constructor(context, options) {
      this.context = context;
    }
    get $auth() {
      return this.context.$auth;
    }
    init() {
      console.log("Init Boss with Auth", this.$auth)
    }
  }
// create the plugin
export default (context, inject) => {
  // get a reference to the vuex store's state
  const { store, route, app, $auth } = context;
  const { state } = store;
  // const { baseUrl } = context.env
  // inject an object of functions into the app
  console.log("boss")
  const $boss = new Boss(context);
  inject('boss', $boss)
  context.$boss = $boss;
  console.log("boss init")
  return $boss.init();
}