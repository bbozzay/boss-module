// Needs to be able to read user roles
const { management } = require("../lib/functions/user_role/read/management")
const { decodeVideoId } = require("../lib/functions/helpers/gatedContent");
const { userHasRequiredRole } = require("../lib/functions/helpers/verify");
const { requireAuth } = require("../lib/functions/helpers/requireAuth");

exports.handler = requireAuth(async function(event, context) {
  const { claims } = context.identityContext;
  const { role, video_id } = event.queryStringParameters
  try {
    const data = await management.getUserRoles({ id: claims.sub });
    const videoID = userHasRequiredRole(data, role) ? decodeVideoId(video_id) : null;
    let responseCode = videoID ? 200 : 500;
    return {
      statusCode: responseCode,
      body: JSON.stringify(videoID)
    };


  } catch(err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})