// TODO: check for valid token and required scopes
const { management } = require("../lib/functions/user_role/write/management");
const { getSelectedPlan } = require("../lib/functions/helpers/data");
const { requireAuth } = require("../lib/functions/helpers/requireAuth");

// get a token with the required scope
exports.handler = requireAuth(async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const selectedPlan = getSelectedPlan(body.plan_index);
    // const stripe_customer_id = body.stripe_customer_id;
    const role_id = selectedPlan.role_id;
    // const stripe_price = selectedPlan.price;

    const { claims } = context.identityContext;
    // const token = event.headers.authorization;
    const sub = claims.sub;
    // Update with the unique meta data
    // const checkoutSession = await fetch(`${process.env.BASEURL}/create-checkout-session`, {
    //   method: 'POST'
    // });
    let response = await management.assignRolestoUser({id: sub}, {
      roles: [role_id]
    })
    return {
      statusCode: 200,
      body: JSON.stringify("User added to role")
    };


  } catch(err) {
    console.log("add_user_to_role", err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})