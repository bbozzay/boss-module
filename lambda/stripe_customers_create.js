const { requireAuth } = require('./permissions/helpers/requireAuth');
const { stripe } = require("./permissions/helpers/stripe")

exports.handler = requireAuth(async function(event, context) {
  console.log("stripe_customers_create", event)
  try {
    const body = JSON.parse(event.body);
    const { email, metadata } = body;

    const customer = await stripe.customers.create({
      email: email,
      metadata: metadata
    })

    const customer_id = customer.id;
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