export const cart = {
  data () {
    return {
      cart: null,
      newCartItem: null,
      i: 1
    }
  },
  methods: {
    addToCart (item) {
      this.cart = this.$boss.cart.add(item, (m) => {
        this.newCartItem = m
      })
    },
    clearCart () {
      this.$boss.cart.clear((m) => {
        this.cart = null
      })
    }
  },
  mounted () {
    this.cart = this.$boss.cart.basket
  }
}
