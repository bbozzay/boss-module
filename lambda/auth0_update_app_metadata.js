import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'

exports.handler = requireAuth(async function (event, context) {
  try {
    const { claims } = context.identityContext
    const body = JSON.parse(event.body)
    const sub = claims.sub
    const meta = body
    // console.log("app_metadata", meta)

    const user = await management.updateAppMetadata({ id: sub }, meta)
    console.log('user', user)
    // fetch('/.netlify/functions/auth0_update_app_metadata', {

    // })
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
