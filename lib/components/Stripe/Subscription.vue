<template>
    <div class="signupPlans">
        <div class="signupPlans__checkout shadow-lg bg-white p-6">
            <h3 class="heading">Subscription 
                <span class="is_active" v-show="is_active">(ACTIVE)</span>
                <span class="is_inactive" v-show="!is_active">(INACTIVE)</span>
            </h3>
            Free trial for {{ subscription.trial_period_days }} days, then pay ${{ subscription.amount_usd }}/month.
            <div>
                <button @click="beginCheckout(subscription_index)" 
                    v-show="!is_active"
                    class="inline-block py-2 px-4 no-underline btn py-2 px-4 no-underline border border-green-600 rounded-sm text-white bg-green-600 inline-flex items-center"
                >Start Trial
                </button>
                <a v-show="billing_url" :href="billing_url" class="text-blue-600 underline" target="_blank">Manage Subscription</a>
            </div>
            <form id="payment-form" @submit.prevent="checkout(subscription_index)" ref="payment" v-show="selectedPlanIndex !== null && !is_active">
                <div class="signupPlans__amount">Amount: ${{ subscription.amount_usd }}</div>
                <div id="card-element"></div>
                <img class="vendorStripe np" src="/uploads/vendor/stripe-purple.svg">
                <button type="submit" id="submit" class="buttonBlack" :disabled="loading"><span v-show="loading">Loading...</span><span v-show="!loading">Submit a Payment</span></button>
            </form>
        </div>
        <div class="messages">{{ message }}</div>
    </div>
</template>

<script>
export default {
    props: {
        redirectPath: {
            type: String,
            default: null
        },
        subscription_index: {
            required: true
        }
    },
    data () {
        return {
            is_active: false,
            loading: false,
            card: null,
            selectedPlanIndex: null,
            paymentIntent: null,
            message: null,
            redirectUrl: null,
            amount: null,
            pwyw_amount: null,
            billing_url: null
        }
    },
    computed: {
        subscription() {
            return plans.subscriptions[this.subscription_index]
        }
    },
    methods: {
        async getSubscription(i) {
            try {
                const response = await this.$boss.getSubscription({plan_index: i, status: "active"})
                console.log("SUBSCRIPTIONS", response.subscriptions)
                if (response.subscriptions.data.length > 0) {
                    this.is_active = true
                    this.manageSubscriptions()
                    return
                }
                this.is_active = false
            } catch(err) {
                console.log(err)
            }
        },
        beginCheckout(i) {
            this.selectedPlanIndex = i
        },
        async checkout(i) {
            console.log("Begin Checkout", this.subscription)
            this.loading = true;
            // this.selectedPlanIndex = i;
            const amount = this.subscription.amount;
            // If no redirecturl was set by anything else, redirect to the plans home page
            if (!this.redirectUrl) {
                this.redirectUrl = this.subscription.home;
            }
            try {
                this.paymentIntent = await this.$boss.createSubscriptionIntent({plan_index: i, amount: amount});
                this.selectedPlanAmount = this.subscription.amount_usd
                await this.getSubscription(i);
                this.loading = false;
            } catch(err) {
                this.message = JSON.stringify(err)
                this.loading = false;
            }
        },
        async manageSubscriptions() {
            try {
                const portal_url = await this.$boss.createCustomerPortalSession();
                if (portal_url) {
                    this.billing_url = portal_url
                }
            } catch(err) {
                console.log(err)
            }
        },
        completeSignup() {
            this.$router.push(this.redirectUrl)
        }
    },
    mounted() {
        // If redirect url is passed as a prop, default to that value
        this.redirectUrl = this.redirectPath;
        if (this.$route.query.redirectUrl) {
            this.redirectUrl = this.$route.query.redirectUrl
        }
        if (this.$stripe) {
            const elements = this.$stripe.elements();
            this.card = elements.create('card', {});
            // Add an instance of the card Element into the `card-element` <div>
            this.card.mount('#card-element');
        }
    },
    fetchOnServer: false,
    async fetch() {
        console.log("Fetching...", this.subscription_index)
        await this.getSubscription(this.subscription_index)
    }
}
</script>

<style scoped lang="scss">
    @import "~/assets/scss/parts/button/black";
    .signupPlans {
        &__plan {
            grid-template-columns: 1fr 1fr;
            display: grid;
        }
        &__checkout {
            min-width: 320px;
        }
    }
    #card-element {
        border: 1px solid #000;
        padding: 1rem;
    }
    .vendorStripe {
        max-width: 125px;
        @apply mb-5;
        @apply mt-3;
    }
    input {
        @apply h-12;
        width: 4rem;
        @apply border-solid;
        @apply border-gray-400;
        @apply border;
        @apply p-1;
        @apply rounded-sm;
        @apply mb-4;
        @apply text-base;
    }
    .is_active {
        color: green;
    }
    .is_inactive {
        color: red;
    }
</style>
