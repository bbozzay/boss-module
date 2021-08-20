import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  console.log('stripe_billingportal_sessions_create', event)
  try {
    const meta = JSON.parse(event.body)
    // For free plans
    const portal = await stripe.billingPortal.sessions.create({
      customer: meta.customer_id,
      return_url: meta.return_url
      // amount: amount,
    })
    return {
      statusCode: 200,
      body: JSON.stringify(portal)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
})
