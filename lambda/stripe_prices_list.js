import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    // const body = JSON.parse(event.body);
    console.log('Params', params)
    // const product = body.hasOwnProperty("product") ? body.product : null;
    const args = {
      active: true,
      // product: product,
      limit: 100
    }
    if (params.product) { args.product = params.product }

    const r = await stripe.prices.list(args)
    console.log("Prices", r)
    return {
      statusCode: 200,
      body: JSON.stringify(r)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
}
