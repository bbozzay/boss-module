<template>
    <div class="stripeSubscribe">
        Stripe Subscribe
        <form id="payment-form" @submit.prevent="checkout()" ref="payment">
            <div class="signupPlans__amount">Amount:</div>
            <div id="card-element"></div>
            <img class="vendorStripe np" src="/uploads/vendor/stripe-purple.svg">
            <button type="submit" id="submit" class="buttonBlack" :disabled="loading"><span v-show="loading">Loading...</span><span v-show="!loading">Submit a Payment</span></button>
        </form>
        <div class="messages"></div>
    </div>
</template>

<script>
export default {
    props: {
        plan: {
            required: true
        }
    },
    data () {
        return {
            loading: false,
            stripe: {
                card: null
            }
        }
    },
    computed: {
        // subscription() {
        //     return plans.subscriptions[this.subscription_index]
        // }
    },
    methods: {
        async checkout() {
            let token = this.$auth.strategy.token.get()
            try {
                let result = await this.$stripe.createToken(this.stripe.card);
                // let js = await result.json()
                console.log("create token", result)
                const createCard = await fetch(`http://localhost:8888/.netlify/functions/stripe_create_card`, {
                    method: 'POST',
                    headers: {
                        authorization: token
                    },
                    body: JSON.stringify({
                        customer_id: 'cus_JnbU3p6Gc3RjpW',
                        token: result.token.id
                    })
                })
                console.log("create card", createCard)
                const response = await fetch(`http://localhost:8888/.netlify/functions/stripe_subscriptions_create`, {
                    method: 'POST',
                    headers: {
                        authorization: token
                    },
                    body: JSON.stringify({
                        customer_id: 'cus_JnbU3p6Gc3RjpW',
                        plan_index: 0,
                    })
                })
                console.log("checkout", response)
            } catch(err) {
                console.error(err)
            }
        }
    },
    mounted() {
        if (this.$stripe) {
            const elements = this.$stripe.elements();
            this.stripe.card = elements.create('card', {});
            // Add an instance of the card Element into the `card-element` <div>
            this.stripe.card.mount('#card-element');
        }
    },
    fetchOnServer: false,
    async fetch() {
    }
}
</script>

<style scoped lang="scss">

</style>
