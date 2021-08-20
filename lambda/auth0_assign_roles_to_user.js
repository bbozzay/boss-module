// TODO: check for valid token and required scopes
import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'
// get a token with the required scope
exports.handler = requireAuth(async function (event, context) {
  try {
    const body = JSON.parse(event.body)
    const { claims } = context.identityContext
    const sub = claims.sub
    const role_id = body.id
    const addedRoles = await management.assignRolestoUser({ id: sub }, {
      roles: [role_id]
    })
    return {
      statusCode: 200,
      body: JSON.stringify(addedRoles)
    }
  } catch (err) {
    console.log('add_user_to_role', err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
