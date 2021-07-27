// plugins/index.js
import Stripe from './api/stripe';
import * as user from './helpers/user';
import Auth from './helpers/auth';
import Authenticated from './helpers/authenticated';
import { lambdaGet, lambdaPost } from './api/lambda';
// import * as helpers from './helpers/index.js'
// get the options out using lodash templates
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace from the options
const { namespace, apiBaseUrl, elasticMail, devMode } = options

// create the plugin
export default (context, inject) => {
  // get a reference to the vuex store's state
  const { store, route, app } = context;
  const { state } = store;
  // const { baseUrl } = context.env
  // inject an object of functions into the app

  inject(namespace, {
    log(message) {
      if (devMode) {
        console.log(message)
      }
      return 
    },
    async mounted() {
      return new Promise(async(resolve, reject) => {
      // This catches refresh and redirect
      // On mounted fetch the user
      if (devMode) {
        console.log("--- MOUNTED ---")
        console.log("--- Start fetchUser ---")
      }
      await this.auth.init();
      if (devMode) {
        console.log("--- End fetchUser ---")
        console.log("--- Start fetchMeta ---")
      }
      // await this.auth.redirectFromState();
      if ($auth.loggedIn) {
        const meta = await this.fetchMeta();
      }
      if (devMode) {
        console.log("---- Event: Fetched Meta ----", meta)
      }
      return resolve()
      // $auth.$storage.watchState('loggedIn', async isLoggedIn => {

        // Check if user previously signup
        // if (!this.getUserMeta()) {
        //   this.setSignupMeta({
        //     signup_url: redirectUrl
        //   });
        // }
        // return resolve(redirectUrl)
      // })

      })
    },
    get auth() {
      const { $auth } = context;
      let newAuth = new Auth({$auth, route, app, state})
      return newAuth
    },

    loginThenRedirect(redirectUrl) {
      let params = { screen_hint: "login"}
      return this.auth.authenticateThenRedirect(redirectUrl, params);
    },
    signupThenRedirect(redirectUrl) {
      let params = { screen_hint: "signup"}
      if (!redirectUrl) {
        redirectUrl = route.path;
      }
      return this.auth.authenticateThenRedirect(redirectUrl, params);
    },
    // Middleware
    requireAuth(type, url) {
      if (type === "signup") {
        return this.signupThenRedirect(url)
      }
      return this.loginThenRedirect(url);
    },
    set redirectUrl(url) {
      store.commit(`${namespace}/redirectUrl`, url)
    },
    async logout() {
      const { $auth } = context;
      return $auth.logout()
    },
    get token() {
      const { $auth } = context;
      const token = $auth.strategy.token.get();
      if (!token) return false;
      return token
    },

    fetchMeta() {
      return new Promise(async(resolve, reject) => {
        try {
          if (!this.token) return resolve()
          const userMeta = await lambdaGet("auth0_get_user_metadata", this.token);
          this.meta = userMeta;
          // const appMeta = metaData.app_metadata ? metaData.app_metadata : null;
          // const userMeta = metaData.user_metadata ? metaData.user_metadata : null;
          // store.commit(`${namespace}/user/appMetaData`, appMeta)
          // store.commit(`${namespace}/user/userMetaData`, userMeta)
          return resolve(userMeta)
        } catch(err) {
          console.log("fetchMeta", err.message)
          return reject(err)
        }
      })
    },
    set meta(metaData) {
      store.commit(`${namespace}/user/appMetaData`, metaData.app_metadata)
      store.commit(`${namespace}/user/userMetaData`, metaData.user_metadata)
    },
    get appMeta() {
      return user.getAppMeta({state, namespace})
    },
    get userMeta() {
      return user.getUserMeta({state, namespace})
    },
    get authenticated () {
      const { $auth } = context;
      // These methods cannot be called until the user logs in
      this.requireLogin();
      const user = $auth.user;

      return new Authenticated({ namespace, token: this.token, user: user})
    },
    // get stripeCustomerId() {
    //   return this.appMeta.stripe_customer_id;
    // },

    // MUST BE LOGGED IN TO DO THESE THINGS
    get stripe() {
      // What happens if the user is signed in but this is undefined?
      // const customer_id = this.appMeta.stripe_customer_id || null
      const stripeHelper = new Stripe(this.token, route, null);
      return stripeHelper
    }
  })
}