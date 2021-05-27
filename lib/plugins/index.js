// plugins/index.js
import * as auth from './helpers/auth';
import * as user from './helpers/user';
import * as access from './helpers/access';
import * as api from './api';
// import * as helpers from './helpers/index.js'
// get the options out using lodash templates
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace from the options
const { namespace, apiBaseUrl, elasticMail } = options
// create the plugin
export default (context, inject) => {
  // get a reference to the vuex store's state
  const { store, route, app } = context;
  const { state } = store
  // const { baseUrl } = context.env
  // inject an object of functions into the app
  inject(namespace, {
    log() {
      console.log("ctx", context)
      return 
    },
    logout() {
      const { $auth } = context;
      return auth.logout({ $auth })
    },
    // Adds an encoded param to the login URL containing the state
    // When the login is successful, the callback url (probably /login) will reload with the encoded redirectUrl
    // Middleware can then decode and redirect the user
    // If no URL arg is supplied, defaults to store.redirectUrl, which is the page the user was on before login
    loginThenRedirect(url) {
      return new Promise(async (resolve, reject) => {
        try {
          const { $auth } = context;
          await $auth.fetchUser();
          // If not logged in, trigger the login process
          if (!$auth.loggedIn) return auth.loginThenRedirect({state, $auth, namespace}, url)
          // If logged in, redirect to the referring url
          await this.fetchMeta();
          const redirectUrl = await this.redirectFromState()
          return resolve(redirectUrl)
        } catch(err) {
          console.log("loginThenRedirect", err)
          return reject(err)
        }
      })
    },
    redirectFromState() {
      return new Promise(async (resolve, reject) => {
        try {
          const redirectUrl = await auth.redirectFromState({ route, app })
          // Check if user previously signup
          if (!this.getUserMeta()) {
            this.setSignupMeta({
              signup_url: redirectUrl
            });
          }
          return resolve(redirectUrl)
        } catch(err) {
          return reject(err)
        }
      })
    },
    // Fetch user_metadata and app_metadata
    fetchMeta() {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          const metaData = await api.fetchMeta({ apiBaseUrl, $auth, store, namespace });
          const appMeta = metaData.app_metadata ? metaData.app_metadata : null;
          const userMeta = metaData.user_metadata ? metaData.user_metadata : null;
          store.commit(`${namespace}/user/appMetaData`, appMeta)
          store.commit(`${namespace}/user/userMetaData`, userMeta)
          return resolve(metaData)
        } catch(err) {
          console.log("fetchMeta", err.message)
          return reject(err)
        }
      })
    },
    // Fetch from API and populate the store
    fetchUserMeta() {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          const userMetaData = await api.fetchUserMeta({ apiBaseUrl, $auth })
          store.commit(`${namespace}/user/userMetaData`, userMetaData)
          return resolve(userMetaData)
        } catch(err) {
          console.log("fetchUserMeta", err.message)
          return reject(err)
        }
      })
    },
    setUserMeta(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const { $auth } = context;
          const meta = await api.setUserMeta({ apiBaseUrl, $auth }, payload);
          const storeMeta = user.setUserMeta({ namespace, store }, meta)
          return resolve(storeMeta)
        } catch(err) {
          return reject(err)
        }
      })
    },
    fetchAppMeta() {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          // Get the data from auth0
          const appMeta = await api.fetchAppMeta({ apiBaseUrl, $auth });
          // Populate the store
          store.commit(`${namespace}/user/appMetaData`, appMeta)
          return resolve(appMeta);
        } catch(err) {
          console.log("fetchAppMeta", err.message)
          return reject(err)
        }
      })
    },
    getAppMeta() {
      return user.getAppMeta({state, namespace})
    },
    getUserMeta() {
      return user.getUserMeta({state, namespace})
    },
    fetchUserRoles() {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          const roles = await api.fetchUserRoles({ apiBaseUrl, $auth })
          store.commit(`${namespace}/access/roles`, roles)
          return resolve(roles)
        } catch(err) {
          console.log("fetchUserRoles", err.message)
          return reject(err)
        }
      })
    },
    addUserToRole(meta) {
      return new Promise(async(resolve, reject) => {
        if (!meta) {
          reject("meta required")
        }
        try {
          const { $auth } = context;
          const role = await api.addUserToRole({ $auth, apiBaseUrl }, meta)
          await this.fetchMeta();
          return resolve(role)
        } catch(err) {
          console.log("addUserToRole", err.message)
          return reject(err)
        }
      })
    },
    fetchVideoId(role, videoId) {
      return new Promise((resolve, reject) => {
        try {
          const { $auth } = context;
          return resolve(api.fetchVideoId({ $auth, apiBaseUrl }, role, videoId))
        } catch(err) {
          console.log("fetchUserRoles", err.message)
          return reject(err)
        }
      })
    },
    setSignupMeta(meta) {
      return new Promise(async (resolve, reject) => {
        try {
          const userMeta = await this.setUserMeta(meta);
          return resolve(userMeta)
        } catch(err) {
          return reject(err)
        }
      })
    },
    createCustomer() {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          const { user } = $auth;
          const customerID = await api.createCustomer({apiBaseUrl, $auth, route}, user.email)
          // Refresh meta state
          // Could maybe save an API call by updating the store state directly
          await this.fetchMeta();
          return resolve(customerID)
        } catch(err) {
          console.log("err", err)
          return reject(err)
        }
      })
    },
    // Retrieve the stripe ID if meta exists
    getCustomerId() {
      return this.getAppMeta() ? this.getAppMeta().stripe_customer_id : null
    },
    createThenCheckout(card, meta) {
      return new Promise(async(resolve, reject) => {
        try {
          const { plan_index } = meta;
          const { $stripe } = context;
          const paymentIntent = await this.createPaymentIntent({plan_index});
          const { client_secret } = paymentIntent;
          try {
            const payment = await $stripe.confirmCardPayment(client_secret, {
              payment_method: {
                card: card,
              }
            })
            if (payment.paymentIntent.status === 'succeeded') {
              const plan = await this.addUserToRole({
                plan_index: plan_index
              })
              return resolve(plan)
            }
          } catch(err) {
            console.log("payment err", err)
            return reject(err)
          }
        } catch(err) {
          console.log("checkout", err)
          return reject(err)
        }
      })
    },
    // Submit the card payment and add the role if it succeeds
    confirmCardPayment(card, paymentIntent) {
      return new Promise(async(resolve, reject) => {
        try {
          const { client_secret, plan_index } = paymentIntent;
          const { $stripe } = context;
          const payment = await $stripe.confirmCardPayment(client_secret, {
            payment_method: {
              card: card,
            }
          })
          // This should probably lookup the payment ID before continuing
          if (payment.paymentIntent.status === 'succeeded') {
            const plan = await this.addUserToRole({
              plan_index: plan_index
            })
            return resolve(plan)
          }
        } catch(err) {
          console.log("payment err", err)
          return reject(err)
        }
      })
    },
    // Payment intent from stripe
    createPaymentIntent({plan_index}) {
      return new Promise(async(resolve, reject) => {
        try {
          const { $auth } = context;
          const customer_id = this.getCustomerId() ? this.getCustomerId() : await this.createCustomer();
          const paymentIntent = await api.createPaymentIntent({apiBaseUrl, $auth}, {
            customer_id: customer_id,
            email: $auth.user.email,
            plan_index: plan_index
          });
          return resolve(paymentIntent)
        } catch(err) {
          console.log("createPaymentIntent", err)
          return reject(err)
        }
      })
    },
    // Newsletter
    elasticMail(options) {
      if (!elasticMail) {
        throw "ElasticMail not configured"
        return
      }
      let { apiBaseUrl, publicAccountID } = elasticMail;
      let newsletter = new api.ElasticMail({ apiBaseUrl, publicAccountID })
      return newsletter.init()
    }
  })
}