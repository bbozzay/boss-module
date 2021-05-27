import fetch from 'node-fetch';
export const fetchMeta = async({ apiBaseUrl, $auth }) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    try {
      const userMeta = await fetch(`${apiBaseUrl}metadata`, {
        method: 'GET',
        headers: {
          authorization: token
        }
      })
      const metaData = await userMeta.json();
      // Populate the store with the user_metadata from auth0
      return resolve(metaData)
    } catch(err) {
      console.log("fetchUserMeta", err)
      return reject(JSON.stringify(err.message))
    }
  })
}
export const fetchUserMeta = async({ apiBaseUrl, $auth }) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    try {
      const userMeta = await fetch(`${apiBaseUrl}user_metadata`, {
        headers: {
          authorization: token
        }
      })
      const metaData = await userMeta.json();
      // Populate the store with the user_metadata from auth0
      return resolve(metaData)
    } catch(err) {
      console.log("fetchUserMeta", err)
      return reject(JSON.stringify(err.message))
    }
  })
}

export const setUserMeta = ({ apiBaseUrl, $auth }, meta) => {
  return new Promise(async(resolve, reject) => {
    const token = $auth.strategy.token.get();
    try {
      const postedData = await fetch(`${apiBaseUrl}update_user_metadata`, {
        method: "POST",
        headers: {
          authorization: token
        },
        body: JSON.stringify(meta)
      })
      const data = await postedData.json();
      return resolve(data)
    } catch(err) {
      return reject(err.message)
    }
  })
}

export const fetchAppMeta = async({ apiBaseUrl, $auth }) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    try {
      const appMeta = await fetch(`${apiBaseUrl}app_metadata`, {
        headers: {
          authorization: token
        }
      })
      const appData = await appMeta.json();
      // Populate the store with the user_metadata from auth0
      return resolve(appData)
    } catch(err) {
      console.log("fetchAppMeta", err)
      return reject(JSON.stringify(err.message))
    }
  })
}