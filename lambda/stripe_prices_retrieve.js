import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    // const body = JSON.parse(event.body);
    console.log('Price ID', params.id)
    // const product = body.hasOwnProperty("product") ? body.product : null;

    const price = await stripe.prices.retrieve(params.id)
    console.log('Price', price)
    return {
      statusCode: 200,
      body: JSON.stringify(price)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
}
