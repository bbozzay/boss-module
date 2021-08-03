const { management } = require("./permissions/metadata/read/management");
const { requireAuth } = require('./permissions/helpers/requireAuth');
exports.handler = requireAuth(async function(event, context) {
  const { claims } = context.identityContext;
  // console.log("identity auth", claims)
  try {
    // Return all meta data for a user (read only)
    const user = await management.getUser({ id: claims.sub });
    // console.log("USER META", user.user_metadata)

    return {
      statusCode: 200,
      body: JSON.stringify({user_metadata: user.user_metadata, app_metadata: user.app_metadata})
    };

  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})