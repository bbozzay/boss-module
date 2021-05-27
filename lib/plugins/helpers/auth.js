import base64url from 'base64url';
export const encodeState = (path) => {
  let encodedUrl = base64url(path);
  return encodedUrl;
}
export const decodeState = (route) => {
  if (!route.hash) return false;
  let splitUrl = route.hash.split("&"), 
      stateEntry = splitUrl.filter(part => part.indexOf("state") > -1);
  if (!stateEntry.length > 0) return false
  let stateValue = stateEntry[0].substring(stateEntry[0].indexOf("=")+1)
  if (!stateValue) return false
  let parsedUrl = base64url.decode(stateValue)
  return parsedUrl
}

export const login = ({ $auth, namespace }, params) => {
  return new Promise(async(resolve, reject) => {
    try {
      await $auth.loginWith('auth0', params)
      // First time login
      // namespace.setUserMeta({})
      return resolve()
    } catch(err) {
      console.log("login", err)
      return reject(JSON.stringify(err.message))
    }
  })
}

export const logout = ({ $auth }) => {
  return new Promise(async(resolve, reject) => {
    try {
      if ($auth.loggedIn) {
        await $auth.logout()
      }
      return resolve(JSON.stringify("Logged Out"))
    } catch(err) {
      return reject(JSON.stringify(err.message))
    }
  })
}

export const loginThenRedirect = ({ state, $auth, namespace }, url) => {
  const stateUrl = url ? encodeState(url) : encodeState(state[`${namespace}`].redirectUrl);
  const params = () => {
    return stateUrl ? {
      params: {
        state: stateUrl
      }
    } : null;
  }
  login({ $auth }, params())
}

// Triggers the router redirect based on the redirectUrl decoded from the state
export const redirectFromState = async({route, app}) => {
  return new Promise((resolve, reject) => {
    try {
      const stateUrl = decodeState(route);
      app.router.push(stateUrl);
      return resolve(stateUrl);
    } catch(err) {
      console.log("redirectFromState", err)
      return JSON.stringify(err.message)
    }
  })
}
