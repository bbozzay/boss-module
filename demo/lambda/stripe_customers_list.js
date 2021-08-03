const { management } = require("./permissions/app_metadata/write/management");
const { requireAuth } = require('./permissions/helpers/requireAuth');
const { stripe } = require("./permissions/helpers/stripe")

exports.handler = requireAuth(async function(event, context) {
  try {
    const params = event.queryStringParameters;
    console.log("stripe_customers_list", params)
    const response = await stripe.customers.list({
      limit: 1,
      email: params.email
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch(err) {
    console.log("appmeta err", err)
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    }
  }
})