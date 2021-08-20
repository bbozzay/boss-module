<template>
  <div>
    <h2>Default Cart</h2>
    <button @click="addToCart(i++)">
      Add To Cart
    </button>
    <button @click="clearCart()">
      Empty Cart
    </button>
    <h3>Basket</h3>
    <div v-if="cart">
      <code>{{ cart }}</code>
    </div>
    <div v-if="newCartItem">
      <h3>Newly Added Item</h3>
      {{ newCartItem }}
    </div>
  </div>
</template>

<script>
import { cart } from '../mixins/cart'
export default {
  mixins: [cart],
  computed: {
    slots () {
      return !!(this.$slots && this.$slots.hasOwnProperty('default') && this.$slots.default.length > 0)
    }
  }
}
</script>
