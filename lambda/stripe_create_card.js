import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  console.log('purchase', event)
  try {
    const meta = JSON.parse(event.body)

    // AMOUNT SHOULD BE IN 1000. $10 = 1000.
    // Minimum amount must match the data file amount.
    // Supports pay what you want with a minimum value set.

    // https://stripe.com/docs/api/subscriptions/create
    const card = await stripe.customers.createSource(
      meta.customer_id,
      {
        source: meta.token
      }
    )
    console.log('PMT', card)
    return {
      statusCode: 200,
      body: JSON.stringify({
        // Legacy id - TODO deprecate this
        card
      })
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
})
