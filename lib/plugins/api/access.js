// Helpers related to gatedContent
import fetch from 'node-fetch';

// Fetch a user's assigned roles
export const fetchUserRoles = async({ apiBaseUrl, $auth }) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    if (!token) return resolve();
    try {
      const data = await fetch(`${apiBaseUrl}user_roles`, {
        headers: {
          authorization: token
        }
      })
      const roles = await data.json();
      if (process.env.NODE_ENV !== "production") {
        console.log("api/access/fetchUserRoles", roles)
      }
      // Populate the store with the user_metadata from auth0
      return resolve(roles)
    } catch(err) {
      console.log("fetchUserMeta", err)
      return reject(JSON.stringify(err.message))
    }
  })
}
export const fetchVideoId = async({ $auth, apiBaseUrl }, role, video_id) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    if (!token) return resolve(null);
    try {
      const data = await fetch(`${apiBaseUrl}decode_video_id?` + new URLSearchParams({
        role: role,
        video_id: video_id
    }), {
        headers: {
          authorization: token
        }
      })
      const returnedVideoId = await data.json();
      return resolve(returnedVideoId)
    } catch(err) {
      console.log("fetchVideoId", err)
      return reject(JSON.stringify(err.message))
    }
  })
}
export const addUserToRole = async({ $auth, apiBaseUrl }, meta) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    const { plan_index } = meta;
    if (!token) return resolve(null);
    try {
      const postUserRole = await fetch(`${apiBaseUrl}add_user_to_role`, {
        method: 'post',
        headers: {
          authorization: token,
        },
        body: JSON.stringify({
          plan_index: plan_index
        })
      })
      const responseRole = await postUserRole.json();
      // Populate the store with the user_metadata from auth0
    //   store.commit(`${namespace}/access/roles`, data)
      return resolve(responseRole)
    } catch(err) {
      console.log("access::addUserToRole", err)
      return reject(JSON.stringify(err.message))
    }
  })
}