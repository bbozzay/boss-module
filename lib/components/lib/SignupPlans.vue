<template>
    <div class="signupPlans">
        <div v-show="selectedPlanIndex === null">
            <div v-for="(plan, i) in plans" :key="plan.index">
                <signup-plan class="signupPlans__plan my-8" @checkout='beginCheckout(i, amount)' :plan_index='i' :name="plan.name" :description="plan.description" :price="plan.amount_usd >= plan.min_amount_usd ? plan.amount_usd : plan.min_amount_usd">
                </signup-plan>
                <div class="pwyw_input">
                    <span>$</span>
                    <input class="max-w-xs" type="number" v-model.number="plan.amount_usd" :min="plan.min_amount_usd" />
                </div>
                {{ pwyw_amount }}
            </div>
        </div>
        <div v-show="selectedPlanIndex !== null" class="signupPlans__checkout">
            <form id="payment-form" @submit.prevent="checkout" ref="payment">
                <div class="signupPlans__amount">${{ selectedPlanAmount }}</div>
                <div id="card-element"></div>
                <img class="vendorStripe" src="/uploads/vendor/stripe-purple.svg">
                <button type="submit" id="submit" class="buttonBlack">Submit a Payment</button>
            </form>
        </div>
        <div class="messages">{{ message }}</div>
        <div class="loader" v-if="loading">LOADING</div>
    </div>
</template>

<script>
export default {
    props: {
        redirectPath: {
            type: String,
            default: null
        },
        plans: {
            type: Array,
            required: true
        },
        pwyw: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            loading: false,
            card: null,
            selectedPlanIndex: null,
            selectedPlanAmount: null,
            paymentIntent: null,
            message: null,
            redirectUrl: null,
            amount: null,
            pwyw_amount: null,
        }
    },
    methods: {
        async beginCheckout(i) {
            console.log("Begin Checkout", i)
            this.loading = true;
            this.selectedPlanIndex = i;
            // If no redirecturl was set by anything else, redirect to the plans home page
            if (!this.redirectUrl) {
                this.redirectUrl = this.plans[i].home;
            }
            try {
                this.paymentIntent = await this.$boss.createPaymentIntent({plan_index: i, amount: this.amount});
                this.selectedPlanAmount = this.plans[this.selectedPlanIndex].amount_usd;
                this.loading = false;
            } catch(err) {
                this.message = JSON.stringify(err)
                this.loading = false;
            }
        },
        async checkout() {
            this.loading = true;
            try {
                const plan = await this.$boss.confirmCardPayment(this.card, {
                    client_secret: this.paymentIntent.client_secret,
                    plan_index: this.paymentIntent.plan_index
                });
                this.message = plan;
                this.loading = false;
                this.completeSignup();
            } catch(err) {
                this.message = JSON.stringify(err);
                this.loading = false;
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
</style>
