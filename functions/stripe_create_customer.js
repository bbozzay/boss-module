const { management } = require("./permissions/app_metadata/write/management");
const { requireAuth } = require('./permissions/helpers/requireAuth');
const { stripe } = require("./permissions/helpers/stripe")

exports.handler = requireAuth(async function(event, context) {
  try {
    const { claims } = context.identityContext;
    const body = JSON.parse(event.body);
    const sub = claims.sub;
    const { email, metadata } = body;

    console.log("Create customer....", email, metadata)

    const customer = await stripe.customers.create({
      email: email,
      metadata: metadata
    })

    const customer_id = customer.id;
    // Associate customer with auth0 app_metadata
    const user = await management.updateAppMetadata({id: sub}, { stripe_customer_id: customer_id })

    return {
      statusCode: 200,
      body: JSON.stringify(customer_id)
    };
  } catch(err) {
    console.log("appmeta err", err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})