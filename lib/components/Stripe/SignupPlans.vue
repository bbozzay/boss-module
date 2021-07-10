<template>
    <div class="signupPlans">
        <div v-show="selectedPlanIndex === null">
            <div v-for="(plan, i) in plans" :key="plan.index">
                <div class="pwyw_input flex flex-col items-center text-center">
                    <div>
                        <h3 class="heading">Enter an amount</h3>
                        <p class="mb-2">(pay what you want - ${{ plan.amount_usd }} minimum)</p>
                    </div>
                    <div>
                        <span>$</span>
                        <input class="max-w-xs" type="number" v-model.number="plan.amount_usd" :min="plan.min_amount_usd" />
                    </div>
                </div>
                <div class="flex flex-col items-center text-center">
                    <signup-plan class="signupPlans__plan my-8" @checkout='beginCheckout(i, plan.amount_usd)' :plan_index='i' :name="plan.name" :description="plan.description" :price="plan.amount_usd >= plan.min_amount_usd ? plan.amount_usd : plan.min_amount_usd" button_text="Pay Now">
                    </signup-plan>
                </div>
            </div>
        </div>
        <div v-show="selectedPlanIndex !== null" class="signupPlans__checkout bg-white shadow-lg p-6">
            <h3 class="heading">Checkout</h3>
            <form id="payment-form" @submit.prevent="checkout" ref="payment">
                <div class="signupPlans__amount">Amount: ${{ selectedPlanAmount }}</div>
                <div id="card-element"></div>
                <img class="vendorStripe" src="/uploads/vendor/stripe-purple.svg">
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
        async beginCheckout(i, plan_amount_usd) {
            console.log("Begin Checkout", i, this.plans[i])
            this.loading = true;
            this.selectedPlanIndex = i;
            const amount = plan_amount_usd*100;
            // If no redirecturl was set by anything else, redirect to the plans home page
            if (!this.redirectUrl) {
                this.redirectUrl = this.plans[i].home;
            }
            try {
                this.paymentIntent = await this.$boss.createPaymentIntent({plan_index: i, amount: amount});
                this.selectedPlanAmount = this.paymentIntent.amount/100;
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
