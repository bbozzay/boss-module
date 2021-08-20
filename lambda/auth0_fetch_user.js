import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'

exports.handler = requireAuth(async (event, context) => {
  try {
    const { claims } = context.identityContext
    const sub = claims.sub
    console.log('identity auth', claims)
    const user = await management.getUser({ id: sub })
    console.log('AUTH0 USER', user)

    return {
      statusCode: 200,
      body: JSON.stringify({
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      })
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
