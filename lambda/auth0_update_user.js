import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'
// get a token with the required scope
exports.handler = requireAuth(async function (event, context) {
  try {
    const sub = context.identityContext.claims.sub
    const meta_data = JSON.parse(event.body)

    // Update with the unique meta data
    const user = await management.updateUserMetadata({ id: sub }, meta_data)
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
