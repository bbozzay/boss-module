const { management } = require("../lib/functions/metadata/read/management");
const { requireAuth } = require('../lib/functions/helpers/requireAuth');
exports.handler = requireAuth(async function(event, context) {
  const { claims } = context.identityContext;
  // console.log("identity auth", claims)
  try {
    const user = await management.getUser({ id: claims.sub });
    // console.log("USER META", user.user_metadata)

    return {
      statusCode: 200,
      body: JSON.stringify(user.user_metadata)
    };

  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})