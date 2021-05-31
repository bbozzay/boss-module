<template>
  <div class="signupPlan" @click="select_plan(plan_index)">
      <h3 class="heading">{{ name }} <span class="price">(${{ price }})</span></h3>
      <p class="my-2">{{ description }}</p>
      <button class="buttonClear">
          Select
      </button>
  </div>
</template>

<script>
export default {
  props: {
    plan_index: Number,
    name: String,
    description: String,
    price: [String, Number]
  },
  methods: {
    select_plan(i) {
      console.log("select plan")
      this.$emit('checkout', i)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "~/assets/scss/parts/button/clear";
  .signupPlan {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .heading {
    line-height: 1;
    position: relative;
    display: inline-block;
  }
  .price {
    position: absolute;
    top: 0;
    font-size: 70%;
    right: 0;
    transform: translate(50%, -75%) rotate(4deg);
    font-style: italic;
    display: block;
    color: purple;
  }
</style>