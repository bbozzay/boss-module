import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  try {
    const params = event.queryStringParameters
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    if (!params.customer_id) { throw 'Customer not found' }
    const subscriptions = await stripe.subscriptions.list({
      customer: params.customer_id
      // price: price,
      // status: status
      // amount: amount,
    })
    console.log("Subs", subscriptions)
    let subs = [];
    if (subscriptions.data) {
      subscriptions.data.forEach(sub => {
        sub.items.data.forEach(item => {
          console.log("item", item)
          subs.push({
            id: sub.id,
            price: item.price.id,
            nickname: sub.plan ? sub.plan.nickname : null,
            metadata: item.plan ? item.plan.metadata : null,
            start_date: sub.start_date,
            current_period_start: sub.current_period_start,
            current_period_end: sub.current_period_end
          })
        })
      })

    }
    console.log('Subs flattened', subs)
    return {
      statusCode: 200,
      body: JSON.stringify(subs)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
}
