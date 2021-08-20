<template>
  <div>
    <div id="card-element" />
    <div @click="checkout">
      CHeckout
    </div>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      // Stripe card
      card: null
    }
  },
  mounted () {
    // If redirect url is passed as a prop, default to that value
    if (this.$stripe) {
      const elements = this.$stripe.elements()
      this.card = elements.create('card', {})
      // Add an instance of the card Element into the `card-element` <div>
      this.card.mount('#card-element')
    }
  },
  methods: {
    async checkout () {
      const cardToken = await this.$stripe.createToken(this.card)
      this.$boss.createSubscription('stripe', cardToken, {
        name: 'Tech Lockdown Package',
        description: 'Tech Lockdown Guide + DNS Filtering',
        items: [
          {
            price: 'price_1JCdHkGfnawpNTlrg8rRJPxT'
          }
        ],
        add_invoice_items: [{
          price: 'price_1JCdHkGfnawpNTlrvoD5rFO4'
        }],
        auth0: [
          {
            role_id: 'rol_M0Cw3TFRb5JWM18Y'
          },
          {
            role_id: 'rol_EbiRY15A381WvjLJ'
          }
        ]
      })
    }
  }
}
</script>
