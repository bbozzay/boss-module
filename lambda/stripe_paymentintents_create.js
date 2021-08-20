const { stripe } = require('./utils/stripe/permissions')

exports.handler = async function (event, context) {
  console.log('stripe_paymentintents_create', event)
  try {
    const meta = JSON.parse(event.body)
    // AMOUNT SHOULD BE IN 1000. $10 = 1000.
    // Minimum amount must match the data file amount.
    // Supports pay what you want with a minimum value set.
    const amount = meta.amount && meta.amount >= plan.amount ? meta.amount : plan.amount

    // For free plans
    const paymentIntent = await stripe.paymentIntents.create({
      customer: meta.customer_id,
      amount,
      description: plan.description,
      receipt_email: meta.email,
      currency: 'usd',
      payment_method_types: ['card'],
      // metadata: {
      //   product_name: plan.name
      // }
    })
    console.log('PMT', paymentIntent)
    return {
      statusCode: 200,
      body: JSON.stringify({
        client_secret: paymentIntent.client_secret,
        plan_index: meta.plan_index,
        amount: paymentIntent.amount
      })
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
}
