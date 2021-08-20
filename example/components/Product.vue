<template>
  <div>
    <ul>
      <img :src="img">
      <li>{{ title }}</li>
      <slot />
    </ul>
    <br>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true
    }
  }
}
</script>
