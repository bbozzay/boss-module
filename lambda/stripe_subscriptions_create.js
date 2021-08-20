import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  console.log('purchase', event)
  try {
    const subscription = JSON.parse(event.body)
    const meta = subscription

    console.log('Subscription item passed', subscription)

    // AMOUNT SHOULD BE IN 1000. $10 = 1000.
    // Minimum amount must match the data file amount.
    // Supports pay what you want with a minimum value set.
    // const amount = meta.amount && meta.amount >= plan.amount ? meta.amount : plan.amount;
    // console.log("ENVIRONMENT", process.env.NODE_ENV)
    // const price = process.env.NODE_ENV !== "production" ? "price_1J1hTMGfnawpNTlry2olr4lA" : plan.price
    // { price: "adfa1k23j_dfas" }
    const items = subscription.items
    console.log('items', items)
    const coupon = meta.hasOwnProperty('coupon') ? meta.coupon : null
    const add_invoice_items = subscription.hasOwnProperty('add_invoice_items') ? subscription.add_invoice_items : null

    const metadata = subscription.hasOwnProperty('metadata') ? subscription.metadata : { product_name: subscription.name }
    const trial_period_days = subscription.hasOwnProperty('trial_period_days') ? subscription.trial_period_days : 0

    // https://stripe.com/docs/api/subscriptions/create
    const paymentIntent = await stripe.subscriptions.create({
      customer: meta.customer_id,
      // amount: amount,
      items,
      trial_period_days,
      metadata,
      coupon,
      // Add one-time payments
      add_invoice_items
    })
    console.log('PMT', paymentIntent)
    return {
      statusCode: 200,
      body: JSON.stringify(paymentIntent)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
})
