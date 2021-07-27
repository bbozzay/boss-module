// Helpers related to gatedContent
import fetch from 'node-fetch';

// Fetch a user's assigned roles
export const addUserToRole = async({ $auth, apiBaseUrl }, meta) => {
  return new Promise(async(resolve, reject) => {
    let token = $auth.strategy.token.get()
    const { plan_index } = meta;
    if (!token) return resolve(null);
    try {
      const postUserRole = await fetch(`${apiBaseUrl}auth0_assign_roles_to_user`, {
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