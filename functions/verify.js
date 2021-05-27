const { requireAuth } = require('../lib/functions/helpers/requireAuth');

exports.handler = requireAuth(async (event, context) => {
  // The user information is available here.
  // console.log("VERIFY", context)
  try {
    const { claims } = context.identityContext;
  console.log("context", context)
  console.log("claims", claims)

    return {
      statusCode: 200,
      body: JSON.stringify({ claims })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    };
  }
});