<template>
  <div>
    Account Page
    <client-only>
      <div v-if="!$auth.loggedIn">
        <button @click="$boss.login($route.path)">
          Login to access this page
        </button>
      </div>
      <div v-if="$auth.loggedIn">
        <h2>Nuxt-Auth user meta</h2>
        <img :src="$auth.user.picture">
        <p>{{ $auth.user.email }}</p>
        <code>{{ $auth.user }}</code>
        <div v-if="meta">
          <h2>Auth0 MetaData</h2>
          <h3>User Meta Data</h3>
          <p>Read/Write</p>
          <code>{{ meta.user_metadata }}</code>
          <h3>App Meta Data</h3>
          <p>Read Only</p>
          <code>{{ meta.app_metadata }}</code>
        </div>
        <div v-if="auth0.roles">
          <h2>Roles</h2>
          <code>{{ auth0.roles }}</code>
        </div>
        <h2>Active Subscriptions</h2>
        <div v-for="(subscription, i) in stripe.subscriptions" :key="i">
          <h3>{{ subscription.nickname }}</h3>
          <code>{{ subscription }}</code>
        </div>
        <p v-if="!stripe.subscriptions">
          No Subscriptions Found
        </p>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  middleware: ['boss/requireLogin'],
  data () {
    return {
      meta: false,
      stripe: {
        subscriptions: null
      },
      auth0: {
        roles: null
      }
    }
  },
  // computed: {
  // 	basket() {
  // 		return this.$boss.storage.getFromStorage("cart_basket")
  // 	}
  // },
  fetchOnServer: false,
  async fetch () {
    if (!this.$auth.loggedIn) { return }
    this.meta = await this.$boss.getUserMeta()
    try {
      const subs = await this.$boss.getSubscriptions('stripe')
      console.log("fetch", subs)
      this.stripe.subscriptions = subs
      const roles = await this.$boss.getUserRoles()
      this.auth0.roles = roles
    } catch (err) {
      console.log(err)
    }
    // this.cart = await this.$boss.cart.basket
    // this.$auth.$storage.watchState("authUser", newValue => {
    // 	console.log("Auth changed", newValue)
    // 	this.meta = newValue
    // })
  }
}
</script>
