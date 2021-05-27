const { management } = require("./permissions/metadata/read/management");
const { requireAuth } = require("./permissions/helpers/requireAuth")

exports.handler = requireAuth(async(event, context) => {
  try {
  const { claims } = context.identityContext;
  const sub = claims.sub;
  // console.log("identity auth", claims)
    const user = await management.getUser({ id: sub });
    // console.log("USER META", user.user_metadata)

    return {
      statusCode: 200,
      body: JSON.stringify({
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      })
    };


  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})