<template>
  <div class="login">
    login
    <button @click="$boss.login($route.query.redirect_url)">
      Login
    </button>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$route)
  }
}
</script>
