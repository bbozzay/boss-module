// import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  console.log('stripe_customers_create', event)
  try {
    const body = JSON.parse(event.body)
    const { email, metadata } = body

    const customer = await stripe.customers.create({
      email,
      metadata
    })

    const customer_id = customer.id
    return {
      statusCode: 200,
      body: JSON.stringify(customer_id)
    }
  } catch (err) {
    console.log('appmeta err', err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
