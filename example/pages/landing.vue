<template>
  <div class="landing">
    Landing Page
    <client-only>
      <div v-if="!$auth.loggedIn">
        <button @click="$boss.signup($route.path)">
          Signup
        </button>
      </div>
      <div v-if="$auth.loggedIn">
        <button v-show="!$auth.loggedIn" @click="$boss.signup('/payment')">
          Signup
        </button>
        <button v-show="$auth.loggedIn" @click="$router.push('/payment')">
          Payment
        </button>
        <div v-if="bundle">
          <code>{{ bundle }}</code>
        </div>
        <button @click="checkout(bundle)">
          Checkout
        </button>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bundle: null
    }
  },
  fetchOnServer: false,
  async fetch () {
    try {
      // const prod = await this.$boss.fetchProduct('stripe', 'prod_K1SHCnI2nGCkn2')
      // const products = await this.$boss.fetchProducts('stripe', { ids: ['prod_K3eaTt99HTKj6i', 'prod_K1SHCnI2nGCkn2']})

      if (!this.$auth.loggedIn) return;
      const plans = await this.$boss.fetchPlans('stripe')
      if (plans && plans.data) {
        this.bundle = plans.data.filter(plan => {
          return plan.metadata.hasOwnProperty("auth0_role") && plan.metadata.auth0_role ? true : false;
        })
      }
      // const dd = await this.$boss.useStrategy('stripe')
      // const priceObject = await dd.pricesList({ active: true, type: "recurring", lookup_keys: ['auth0_role'] })
      // console.log("price", priceObject)
      // this.bundle = priceObject.data
      // this.bundle = products
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async checkout (bundle) {
      // console.log('Product', this.product)
      const ss = await this.$boss.checkoutWith('stripe')
      const session = await ss.checkoutSessionsCreate({ line_items: bundle, success_path: `/account` })
      // const invoice = await ss.invoicesCreate({ price: this.product.line_items[0].id })
			// console.log("invoice", invoice)
      window.location.replace(session.url)
    }
  }
}
</script>
