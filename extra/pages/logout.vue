<template>
  <div class="login container w-6/12 mx-auto flex flex-wrap items-center justify-center text-center mt-0 py-32">
    {{ loginText }}
    <div @click="$auth.logout()" class="buttonBlack">LOGOUT</div>
    <nuxt-link to="/login" class="buttonBlack">LOGIN</nuxt-link>
  </div>
</template>

<script>
export default {
  ssr: false,
  data() {
    return {
      loggedIn: false,
      loginText: "Already Logged Out"
    }
  },
  async fetch() {
    await this.$boss.logout()
    this.loginText = "Logged Out"
  },
  fetchOnServer: false
}
</script>

<style lang="scss">
  @import "~/assets/scss/parts/button/black";
  @import "~/assets/scss/parts/button/clear";
</style>