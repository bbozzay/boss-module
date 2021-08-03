const { management } = require("./permissions/app_metadata/write/management");
const { requireAuth } = require('./permissions/helpers/requireAuth');
const { requireBody } = require('./permissions/helpers/requireBody');
const { stripe } = require("./permissions/helpers/stripe")


// exports.handler = requireAuth(requireBody(event, context, ["email"], async function(event, context) {
exports.handler = requireAuth(async function(event, context) {
// requireBody(context, ["email"], 
  console.log("boss_customers_create", event)
  try {
    const { claims } = context.identityContext;
  // console.log("claims", claims)
    const body = JSON.parse(event.body);
		await requireBody(body, ["email"])
    const sub = claims.sub;
    const { email, metadata } = body;


    const customer = await stripe.customers.create({
      email: email,
      metadata: metadata
    })

    const customer_id = customer.id;
    // Associate customer with auth0 app_metadata
    const user = await management.updateAppMetadata({id: sub}, { stripe_customer_id: customer_id })
		console.log("user", user)

    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch(err) {
    console.log("appmeta err", err)
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
})