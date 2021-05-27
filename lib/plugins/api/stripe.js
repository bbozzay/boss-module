// Create a customer in Stripe
// Return the customer ID
export const createCustomer = ({ apiBaseUrl, $auth, route }, email) => {
    return new Promise(async(resolve, reject) => {
        try {
            let token = $auth.strategy.token.get()
            if (!token) return reject("No Token Provided");
            const response = await fetch(`${apiBaseUrl}stripe_create_customer`, {
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
                plan_index: meta.plan_index
            })
        })
        const paymentIntent = await response.json();
        return resolve(paymentIntent)
    })
}

// export const addPlanToUser = ({ apiBaseUrl, $auth }, planMeta) => {
//     return new Promise(async(resolve, reject) => {
//         let token = $auth.strategy.token.get()
//         if (!token) return reject("No Token Provided");
//         const response = await fetch(`${apiBaseUrl}add_plan_to_user`, {
//             method: 'POST',
//             headers: {
//                 authorization: token
//             },
//             body: JSON.stringify({
//                 stripe_customer_id: planMeta.stripe_customer_id,
//                 plan_index: planMeta.plan_index,
//             })
//         })
//         const data = await response.json();
//         return resolve(data)
//     })
// }