// Actions that can only occur if the user is authenticated
import { lambdaGet, lambdaPost } from '../api/lambda';

export default class Authenticated {
	constructor({namespace, token, user}) {
		this.namespace = $`${namespace}`
		this.token = token
		this.email = user.email
	}

	async createCustomer() {
			// const customerID = await stripe.createCustomer(user.email)
			const userMeta = await lambdaPost("boss_create_customer", this.token, { email: this.email });
			// Refresh meta state
			// Could maybe save an API call by updating the store state directly
			console.log("namespace", $boss.meta)
			[this.namespace].meta = userMeta;
			return userMeta
	}
}
