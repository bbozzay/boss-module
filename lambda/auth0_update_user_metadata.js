const { requireAuth } = require('./permissions/helpers/requireAuth');
const { management } = require("./permissions/user_metadata/write/management");
// get a token with the required scope
exports.handler = requireAuth(async function(event, context) {
  try {
    const sub = context.identityContext.claims.sub;
    const meta_data = JSON.parse(event.body);

    // Update with the unique meta data
    const user = await management.updateUserMetadata({id: sub}, meta_data)
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