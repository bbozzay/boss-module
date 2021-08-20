<template>
  <div>
    <h1>Checkout</h1>
    <client-only>
      <form id="payment-form" ref="payment">
        <boss-stripe-checkout :amount="200" />
      </form>
    </client-only>
  </div>
</template>

<script>
export default {

}
</script>
