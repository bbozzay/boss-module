const { management } = require("./permissions/app_metadata/write/management");
const { requireAuth } = require("./permissions/helpers/requireAuth")

exports.handler = requireAuth(async function(event, context) {
  try {
    const { claims } = context.identityContext;
    const body = JSON.parse(event.body);
    const sub = claims.sub;
    const meta = body;
    // console.log("app_metadata", meta)

    const user = await management.updateAppMetadata({id: sub}, meta)
    return {
      statusCode: 200,
      body: JSON.stringify("Added App Meta")
    };


  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})