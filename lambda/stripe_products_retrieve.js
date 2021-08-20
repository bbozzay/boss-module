import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters
    // const meta = JSON.parse(event.body);
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    const products = await stripe.products.retrieve(params.id)
    console.log('PMT', products)
    return {
      statusCode: 200,
      body: JSON.stringify(products)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
}
