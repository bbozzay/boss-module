import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    // console.log(event)
    let args = {
      active: true,
      limit: 50,
    };
    // Override defaults
    if (body) {
      args = {
        ...args,
        ...body
      }
    }
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    const products = await stripe.products.list(args)
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
