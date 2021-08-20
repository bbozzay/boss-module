// import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  try {
    const params = event.queryStringParameters
    const customer = await stripe.customers.retrieve(params.id)

    console.log('stripe_customers_retrieve', customer)
    return {
      statusCode: 200,
      body: JSON.stringify(customer)
    }
  } catch (err) {
    console.log('appmeta err', err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
