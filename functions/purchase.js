const { stripe } = require("../lib/functions/helpers/stripe");
const { getSelectedPlan } = require("../lib/functions/helpers/data");
const { requireAuth } = require("../lib/functions/helpers/requireAuth")

exports.handler = requireAuth(async function(event, context) {
  console.log("purchase", event)
  try {
    const meta = JSON.parse(event.body);
    const plan = getSelectedPlan(meta.plan_index);

    if (!plan.amount) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          client_secret: null,
          plan_index: meta.plan_index
        })
      }
    }
    const paymentIntent = await stripe.paymentIntents.create({
      customer: meta.customer_id,
      amount: plan.amount,
      description: plan.description,
      receipt_email: meta.email,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        product_name: plan.name,
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        client_secret: paymentIntent.client_secret,
        plan_index: meta.plan_index
      })
    };
  } catch (err) {
    console.log("err", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    };
  }
})