<template>
  <div class="login container w-6/12 mx-auto flex flex-col items-center justify-center text-center mt-0 py-32">
    <div>
      <h1>Login</h1>
    </div>
    <div>
      <client-only>
        <div v-if="$auth.loggedIn">
          <p class="mb-5" v-if="userName">Welcome, {{ userName }}</p>
          <nuxt-link to="/logout" class="buttonClear">LOGOUT</nuxt-link>
        </div>
        <div v-if="!$auth.loggedIn">
          <p class="mb-5">Get started by logging in.</p>
          <button class="buttonBlack" @click="$boss.auth.login()">LOGIN</button>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>

// import { decodeState, 
export default {
  ssr: false,
  data() {
    return {
      loggedIn: false,
      profilePicture: false,
      userName: false
    }
  },
  fetchOnServer: false,
  async fetch() {
    let redirectUrl = this.$route.query.redirectUrl;
    redirectUrl ? redirectUrl : null;
    await this.$boss.loginThenRedirect(redirectUrl);
    this.userName = this.$auth && this.$auth.hasOwnProperty("user") ? this.$auth.user.nickname : false;
  }
}
</script>

<style lang="scss">
  @import "~/assets/scss/parts/button/black";
  @import "~/assets/scss/parts/button/clear";
</style>