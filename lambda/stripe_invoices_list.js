import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  try {
    const params = event.queryStringParameters
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    // const body = JSON.parse(event.body);
    console.log('Params', params)
    // const product = body.hasOwnProperty("product") ? body.product : null;
    if (!params.customer_id) { throw 'No valid customer_id' }
    const args = {
      customer: params.customer_id,
      limit: 100
    }

    const r = await stripe.invoices.list(args)
    console.log('PMT', r)
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
})
