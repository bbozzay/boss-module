const { stripe } = require("./permissions/helpers/stripe");
const { getSelectedSubscription } = require("./permissions/helpers/data");
const { requireAuth } = require("./permissions/helpers/requireAuth")

exports.handler = requireAuth(async function(event, context) {
  console.log("purchase", event)
  try {
    const meta = JSON.parse(event.body);
    const plan = getSelectedSubscription(meta.plan_index);

    // AMOUNT SHOULD BE IN 1000. $10 = 1000.
    // Minimum amount must match the data file amount.
    // Supports pay what you want with a minimum value set.
    // const amount = meta.amount && meta.amount >= plan.amount ? meta.amount : plan.amount;
    console.log("ENVIRONMENT", process.env.NODE_ENV)
    const price = process.env.NODE_ENV !== "production" ? "price_1J1hTMGfnawpNTlry2olr4lA" : plan.price
    // { price: "adfa1k23j_dfas" }
    const items = plan.items; 
    const coupon = meta.hasOwnProperty("coupon") ? meta.coupon : null;
    const metadata = plan.hasOwnProperty("metadata") ? plan.metadata : { product_name: plan.name }
    const trial_period_days = plan.hasOwnProperty("trial_period_days") ? plan.trial_period_days : 0;

    // https://stripe.com/docs/api/subscriptions/create
    const paymentIntent = await stripe.subscriptions.create({
      customer: meta.customer_id,
      // amount: amount,
      items: items,
      trial_period_days: trial_period_days,
      metadata: metadata,
      coupon: coupon
    });
    console.log("PMT", paymentIntent)
    return {
      statusCode: 200,
      body: JSON.stringify({
        // Legacy id - TODO deprecate this
        subscription_id: paymentIntent.id,
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        // The plan that was subscribed to
        plan_index: meta.plan_index,
        customer: paymentIntent.customer,
        items: paymentIntent.items
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