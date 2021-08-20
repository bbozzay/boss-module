import { requireAuth } from './utils/requireAuth'
const { stripe } = require('./utils/stripe/permissions')
import { management } from './utils/auth0/management'

exports.handler = requireAuth(async function (event, context) {
  try {
		// use the checkout strategy
		// use the auth strategy
		// Check if customer_id is associated with subscription
		// if it is, activate the associated role_id for the desired auth strategy.
    const body = JSON.parse(event.body)
    const { claims } = context.identityContext
    const sub = claims.sub

    console.log('body', body)

		const price = await stripe.prices.retrieve(
			body.price
		)
		if (price) {
			let role_id = price.metadata.auth0_role;
			const r = await management.assignRolestoUser({ id: sub }, {
				roles: [role_id]
			})
			const roles = await management.getUserRoles({ id: sub })
			console.log('roles created', roles)
			return {
				statusCode: 200,
				body: JSON.stringify(roles)
			}
		} else {
			return {
				statusCode: 401,
				body: JSON.stringify("No roles found")
			}	
		}
  } catch (err) {
    console.log('err', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message })
    }
  }
})

