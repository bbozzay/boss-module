// Get app_metadata
const { management } = require("../permissions/app_metadata/read/management");
const { requireAuth } = require("../permissions/helpers/requireAuth");

exports.handler = requireAuth(async function(event, context) {
  try {
    const { claims } = context.identityContext;
    const user = await management.getUser({ id: claims.sub });
    // console.log("app_metadata", user.app_metadata)
    return {
      statusCode: 200,
      body: JSON.stringify(user.app_metadata)
    };
  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})