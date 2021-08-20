<template>
  <div>
    <h1>Activation</h1>
    <client-only>
      <div v-if="!isActive">
        <p>Activating Your Account.</p>
        <p>Please Wait</p>
      </div>
      <div v-if="isActive">
        <p>Your Account is Active!</p>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isActive: false
    }
  },
  fetchOnServer: false,
  async fetch () {
    console.log(this.$route.query)
    const params = this.$route.query
        console.log('params', params)
    this.$store.commit('boss/loadingStatus', { status: true, message: 'Fetching Plans' })
    if (params) {
      try {
        // const ss = await this.$boss.checkoutWith('stripe')
        // const price = await ss.pricesRetrieve(params.plan)
        // console.log('Price', price)

        // Check each invoice for a matching price/product
        // Look up the product to get the auth0_roles meta_data value.
        // Send the invoice ID to the assign_roles_to_user lambda function
        // Lambda function should look up the invoice and validate that the customer_id matches the invoice customer_id
        /// / Then lookup the product and assign the associated role to the user
        // const payments = await ss.paymentIntentsList()
        // console.log('payments', payments)
        return
        const matchedProductID = await ss.checkInvoicesForProduct(invoices, params.price, params.product)
        console.log('MATCHED PRODUCT', matchedProductID)
        const productObject = await ss.productsRetrieve(matchedProductID)
        const activate = this.$boss.auth.updateEndpoint('auth0_assign_roles_to_user', { id: productObject.metadata.auth0_role })
        this.isActive = true
        this.$boss.cart.clear()
      } catch (err) {
        throw err
      } finally {
        this.$store.commit('boss/loadingStatus', false)
      }
    }
  }
}
</script>
