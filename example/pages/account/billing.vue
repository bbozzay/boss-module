<template>
  <div>
    <h1>Account Billing</h1>
    <client-only>
      <div v-if="portal_url">
        <a :href="portal_url">Manage Account</a>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      portal_url: null
    }
  },
  fetchOnServer: false,
  async fetch () {
    try {
      const ss = await this.$boss.checkoutWith('stripe')
      const ff = await ss.createCustomerPortalSession()
      this.portal_url = ff.url
    } catch (err) {
      console.log('err', err)
    }
  }
}
</script>
