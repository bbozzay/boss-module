<template>
  <div>
    Works!
  </div>
</template>

<script>
export default {
  methods: {
    r () {
      console.log('this', this.$router.push('/login'))
    }
  }
}
</script>
