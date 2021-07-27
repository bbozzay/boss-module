// Create a customer in Stripe
// Return the customer ID
import { lambdaGet, lambdaPost } from './lambda';

export default class Stripe {
    constructor(token, route, customer_id) {
        this.token = token;
        this.route = route
        this.customer_id = customer_id
    }
    async createCustomer({ email }) {
        const response = await lambdaPost(`${apiBaseUrl}stripe_customers_create`, this.token, {
                email: email,
                metadata: {
                    signup_url: this.route.path,
                    role_id: []
                }
            }
        )
        const customerID = await response.json();
        return resolve(customerID);
    }

    async findCustomerByEmail(email) {
        const response = await lambdaGet(`stripe_customers_list`, this.token, {
            email: email
        })
        return response
    }

    async createPaymentIntent(meta) {
        const response = await lambdaPost(`${apiBaseUrl}purchase`, this.token, {
                email: meta.email,
                name: meta.name,
                customer_id: meta.customer_id,
                plan_index: meta.plan_index,
                amount: meta.amount
        })
        const paymentIntent = await response.json();
        return resolve(paymentIntent)
    }

    async createSubscriptionIntent(meta) {
        const response = await lambdaPost(`${apiBaseUrl}stripe_subscriptions_create`, this.token, {
            customer_id: meta.customer_id,
            plan_index: meta.plan_index,
            amount: meta.amount
        })
        const paymentIntent = await response.json();
        return resolve(paymentIntent)
    }
    async subscriptionsList() {
        const response = await lambdaPost(`stripe_subscriptions_list`, this.token, {
                customer_id: this.customer_id,
                // status: meta.status
        })
        return response
    }
    async getSubscription(meta) {
        const response = await lambdaPost(`${apiBaseUrl}stripe_subscriptions_list`, this.token, {
                customer_id: this.customer_id,
                plan_index: meta.plan_index,
                status: meta.status
        })
        const subscriptions = await response.json();
        return resolve(subscriptions)
    }
    async createCustomerPortalSession(meta) {
        const response = await fetch(`${apiBaseUrl}stripe_billingportal_sessions_create`, this.token, {
                customer_id: meta.customer_id,
                return_url: "https://techlockdown.com"
        })
        const portal = await response.json();
        return resolve(portal.portal_url)
    }
}