import base64url from 'base64url';

const options = JSON.parse(`<%= JSON.stringify(options) %>`)
// extract the namespace from the options
const { devMode, namespace } = options

const encodeState = (path) => {
  let encodedUrl = base64url(path);
  return encodedUrl;
}
const decodeState = (route) => {
  if (!route.hash) return false;
  let splitUrl = route.hash.split("&"), 
      stateEntry = splitUrl.filter(part => part.indexOf("state") > -1);
  if (!stateEntry.length > 0) return false
  let stateValue = stateEntry[0].substring(stateEntry[0].indexOf("=")+1)
  if (!stateValue) return false
  let parsedUrl = base64url.decode(stateValue)
  return parsedUrl
}


export default class Auth {
  constructor({$auth, route, app, state}) {
    this.$auth = $auth;
    this.route = route;
    this.app = app;
    this.state = state;
  }
  async init() {
    return new Promise(async(resolve, reject) => {
      // This is an API call
      if (this.$auth.loggedIn) {
        await this.$auth.fetchUser()
        await this.redirectFromState()
      }
        return resolve()
    })
  }

  // Triggers the router redirect based on the redirectUrl decoded from the state
  redirectFromState = async() => {
    return new Promise((resolve, reject) => {
      try {
        const stateUrl = decodeState(this.route);
        if (!stateUrl) return resolve();
        if (devMode) {
          console.log("REDIRECT", stateUrl)
        }
        this.app.router.push(stateUrl);
        return resolve(stateUrl);
      } catch(err) {
        console.log("redirectFromState", err)
        return reject(JSON.stringify(err.message))
      }
    })
  }
  // $auth
  authenticate(params) {
    if (!this.$auth.loggedIn) {
      console.log("PARAMS", params)
      return this.$auth.loginWith("auth0", params)
    }
  }
  logout() {
    if (this.$auth.loggedIn) {
      this.$auth.logout()
    }
  }
  login(params) {
    const args = params ? { ...params, screen_hint: "login" } : { screen_hint: "login" }
    this.authenticate(args)
  }
  signup(params) {
    const args = params ? { ...params, screen_hint: "signup" } : { screen_hint: "signup" }
    this.authenticate(args)
    return
  }
  // Middleware
  authenticateThenRedirect(redirectUrl, params) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.$auth.fetchUser()
          console.log("+++ loginThenRedirect start")
          if (this.$auth.loggedIn) return;
          console.log("authThenRedirect auth login", this.$auth.loggedIn)
          // If not logged in, trigger the login process
          console.log("Auth Redirect", redirectUrl)
          const stateUrl = redirectUrl ? encodeState(redirectUrl) : encodeState(this.state[`${namespace}`].redirectUrl);
            const data = () => {
              return stateUrl ? {
                params: {
                  ...params,
                  state: stateUrl
                }
              } : { params: params };
            }
          this.authenticate(data())
          // If logged in, redirect to the referring url
          // await this.fetchMeta();
          // const redirectUrl = await this.redirectFromState()
          // return resolve(redirectUrl)
        } catch(err) {
          console.log("loginThenRedirect", err)
          return reject(err)
        }
      })
  }
}