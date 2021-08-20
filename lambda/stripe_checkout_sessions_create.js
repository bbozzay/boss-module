// import { management } from './utils/auth0/management'
import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  console.log('stripe_customers_create', event)
  try {
    const body = JSON.parse(event.body)
    const { customer_id, success_url, cancel_url, line_items, mode } = body

    // let mode = "payment";
    // const items = [];
    // line_items.forEach(item => {
    // 	console.log("ITEM", item)
    // 	if (item.type == "recurring") {
    // 		mode = "subscription";
    // 	}
    // 	items.push({
    // 		price: item.id,
    // 		quantity: item.quantity || 1
    // 	})
    // })
    const session = await stripe.checkout.sessions.create({
      success_url,
      cancel_url,
      payment_method_types: ['card'],
      line_items,
      customer: customer_id,
      // line_items: [
      // 	{price: 'price_H5ggYwtDq4fbrJ', quantity: 2},
      // ],
      // mode: mode
      mode
    })

    return {
      statusCode: 200,
      body: JSON.stringify(session)
    }
  } catch (err) {
    console.log('appmeta err', err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})
