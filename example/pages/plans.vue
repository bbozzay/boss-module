<template>
  <div>
    <h1>Stripe API Plans</h1>
    <client-only>
      <div v-for="(plan) in stripe.plans" :key="plan.id">
        <h1>{{ plan.nickname }}</h1>
        <code>{{ plan }}</code>
        <button @click="buyPlan(plan)">
          Checkout
        </button>
      </div>
      <div v-if="!stripe.plans">
        <button @click="$boss.login($route.path)">Login</button>
        <button @click="$boss.signup($route.path)">Signup</button>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  // async asyncData () {
  //   return {
  //     plans
  //   }
  // },
  data () {
    return {
      stripe: {
        plans: null
      }
    }
  },
  fetchOnServer: false,
  async fetch () {
    if (!this.$auth.loggedIn) return;
    const plans = await this.$boss.fetchPlans('stripe')
    if (plans) {
      this.stripe.plans = plans.data
    }
  },
  methods: {
    async buyPlan (plan) {
      try {
        plan.type = 'recurring'
        const meta = {
          success_path: `/activate?plan=${plan.id}`,
          line_items: [plan]
        }
        const ss = await this.$boss.checkoutWith('stripe')
        const session = await ss.checkoutSessionsCreate(meta)
        window.location.replace(session.url)
        return Promise.resolve(ss)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
</script>
