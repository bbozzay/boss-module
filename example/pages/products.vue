<template>
  <div>
    <h1>Stripe API products</h1>
    <client-only>
      <div v-for="(stripe_prod) in stripe_products" :key="stripe_prod.id">
        <img v-if="stripe_prod.images && stripe_prod.images.length > 0" :src="stripe_prod.images[0]">
        <h2>{{ stripe_prod.name }}</h2>
        <button @click="$boss.cart.addMultiple(stripe_prod.line_items)">
          Add To Cart
        </button>
        <button @click="checkoutPrice(stripe_prod.line_items)">
          Checkout with this Product
        </button>
        <h3>Prices in the product:</h3>
        <ul>
          <li v-for="price in stripe_prod.line_items" :key="price.id">
            {{ price.nickname }} - ${{ (price.unit_amount/100) }}
          </li>
        </ul>
        <code>{{ stripe_prod }}</code>
        <hr>
      </div>
      <code v-if="stripe_products_error">{{ stripe_products_error }}</code>
    </client-only>
    <h1>Stripe API PRICES</h1>
    <client-only>
      <div v-for="(stripe_price) in stripe_prices" :key="stripe_price.id">
        <h3>Checkout via stripe sessio</h3>
        <div>
          <p>{{ stripe_price.nickname }}</p>
          <p>${{ (stripe_price.unit_amount/100) }}</p>
          <code>{{ stripe_price }}</code>
          <input v-model="stripe_price.quantity">
          <button @click="checkoutPrice([stripe_price])">
            Checkout with this Product
          </button>
          <button @click="$boss.cart.add(stripe_price)">
            Add to Cart
          </button>
          <button @click="checkoutPrice($boss.cart.basket)">
            Checkout with items from Cart
          </button>
        </div>
      </div>
      <code v-if="stripe_prices_error">{{ stripe_prices_error }}</code>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stripe_products: null,
      stripe_prices: null,
      stripe_prices_error: null,
      stripe_products_error: null
    }
  },
  // async asyncData() {
  // 	return {
  // 		products
  // 	}
  // },
  fetchOnServer: false,
  async fetch () {
    try {
      const prods = await this.$boss.fetchProducts('stripe')
      if (prods) {
        this.stripe_products = prods.data
        prods.data.forEach(async (prod) => {
          const dd = await this.$boss.useStrategy('stripe')
          const priceObject = await dd.pricesList({ product: prod.id })
          prod.line_items = priceObject.data
        })
      }
    } catch (err) {
      this.stripe_products_error = err
    }
    try {
      const ss = await this.$boss.useStrategy('stripe')
      const prices = await ss.pricesList()
      if (prices) {
        this.stripe_prices = prices.data
      }
    } catch (err) {
      this.stripe_prices_error = err
    }
  },
  methods: {
    checkout (product) {
      this.$boss.checkoutWith('stripe').checkoutSessionsCreate()
    },
    async checkoutPrice (prices) {
      let activationPrice = null
      let activationProduct = null
      // let params = null;
      prices.forEach((price) => {
        if (price.type == 'one_time') {
          activationPrice = price.id
          activationProduct = price.product
        }
      })
      // use the price to associate the product
      // lookup the price, then lookup the product and return the meta
      // then activate auth0 from the product.meta_data.auth0_roles
      const meta = {
        success_path: '/activate' + `?price=${activationPrice}&product=${activationProduct}`,
        line_items: prices
      }
      try {
        const stripeInit = await this.$boss.checkoutWith('stripe')
        // const stripeInit = await this.$boss.checkoutWith('stripe')
        const newSession = await stripeInit.checkoutSessionsCreate(meta)
        window.location.replace(newSession.url)
      } catch (err) {
        this.stripe_prices_error = err
        // console.log("err", err)
      }
    }
  }
}
</script>
