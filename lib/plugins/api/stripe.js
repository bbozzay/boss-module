// Create a customer in Stripe
// Return the customer ID
export const createCustomer = ({ apiBaseUrl, $auth, route }, email) => {
    return new Promise(async(resolve, reject) => {
        try {
            let token = $auth.strategy.token.get()
            if (!token) return reject("No Token Provided");
            const response = await fetch(`${apiBaseUrl}stripe_customers_create`, {
                method: 'POST',
                headers: {
                    authorization: token
                },
                body: JSON.stringify({
                    email: email,
                    metadata: {
                        signup_url: route.path,
                        role_id: []
                    },
                })
            })
            const customerID = await response.json();
            return resolve(customerID);
        } catch(err) {
            return reject(err)
        }
    })
}

export const createPaymentIntent = ({apiBaseUrl, $auth}, meta) => {
    return new Promise(async(resolve, reject) => {
        let token = $auth.strategy.token.get()
        if (!token) return reject("No Token Provided");
        const response = await fetch(`${apiBaseUrl}purchase`, {
            method: 'POST',
            headers: {
                authorization: token
            },
            body: JSON.stringify({
                email: meta.email,
                name: meta.name,
                customer_id: meta.customer_id,
                plan_index: meta.plan_index,
                amount: meta.amount
            })
        })
        const paymentIntent = await response.json();
        return resolve(paymentIntent)
    })
}

export const createSubscriptionIntent = ({apiBaseUrl, $auth}, meta) => {
    return new Promise(async(resolve, reject) => {
        let token = $auth.strategy.token.get()
        if (!token) return reject("No Token Provided");
        const response = await fetch(`${apiBaseUrl}stripe_subscriptions_create`, {
            method: 'POST',
            headers: {
                authorization: token
            },
            body: JSON.stringify({
                customer_id: meta.customer_id,
                plan_index: meta.plan_index,
                amount: meta.amount
            })
        })
        const paymentIntent = await response.json();
        return resolve(paymentIntent)
    })
}
export const getSubscription = ({apiBaseUrl, $auth}, meta) => {
    return new Promise(async(resolve, reject) => {
        let token = $auth.strategy.token.get()
        if (!token) return reject("No Token Provided");
        const response = await fetch(`${apiBaseUrl}stripe_subscriptions_list`, {
            method: 'POST',
            headers: {
                authorization: token
            },
            body: JSON.stringify({
                customer_id: meta.customer_id,
                plan_index: meta.plan_index,
                status: meta.status,
            })
        })
        const subscriptions = await response.json();
        return resolve(subscriptions)
    })
}
export const createCustomerPortalSession = ({apiBaseUrl, $auth}, meta) => {
    return new Promise(async(resolve, reject) => {
        let token = $auth.strategy.token.get()
        if (!token) return reject("No Token Provided");
        const response = await fetch(`${apiBaseUrl}stripe_billingportal_sessions_create`, {
            method: 'POST',
            headers: {
                authorization: token
            },
            body: JSON.stringify({
                customer_id: meta.customer_id,
                return_url: "https://techlockdown.com"
            })
        })
        const portal = await response.json();
        return resolve(portal.portal_url)
    })
}