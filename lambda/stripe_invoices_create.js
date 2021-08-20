import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')

exports.handler = requireAuth(async function (event, context) {
  try {
    const data = JSON.parse(event.body)
    // const plan = getSelectedSubscription(meta.plan_index);
    // const price = process.env.STRIPE_SUBSCRIPTION_TEST ? process.env.STRIPE_SUBSCRIPTION_TEST : plan.price
    // For free plans
    // const body = JSON.parse(event.body);
    console.log('data', data)
    // const product = body.hasOwnProperty("product") ? body.product : null;
    if (!data.customer_id) { throw 'No valid customer_id' }
    const args = {
      customer: data.customer_id,
    }

    const invoiceItem = await stripe.invoiceItems.create({
      customer: data.customer_id,
      price: data.price
    });
    const r = await stripe.invoices.create(args)
    const invoice = await stripe.invoices.finalizeInvoice(
      r.id
    );
    console.log('PMT', invoice)
    return {
      statusCode: 200,
      body: JSON.stringify(invoice)
    }
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
})
