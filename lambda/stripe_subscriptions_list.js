const { stripe } = require("./permissions/helpers/stripe");
const { getSelectedSubscription } = require("./permissions/helpers/data");
const { requireAuth } = require("./permissions/helpers/requireAuth")

exports.handler = requireAuth(async function(event, context) {
  console.log("purchase", event)
  try {
    const meta = JSON.parse(event.body);
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    const subscriptions = await stripe.subscriptions.list({
      customer: meta.customer_id,
      // price: price,
      // status: status
      // amount: amount,
    });
    console.log("PMT", subscriptions)
    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptions: subscriptions,
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