import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'

exports.handler = requireAuth(async function (event, context) {
  const { claims } = context.identityContext
  try {
    const data = await management.getUserRoles({ id: claims.sub })
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
