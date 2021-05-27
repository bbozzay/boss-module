<template>
  <div class="navigationAuth">
    <nuxt-link to="/signup">Signup</nuxt-link>
    <nuxt-link :to="link" class="navigationLogin">
      <span class="inline-block py-2 px-4 no-underline text-gray-900">{{ menuText }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false
    }
  },
  computed: {
    menuText() {
      return this.$auth.loggedIn ? "Logout" : "Login";
    },
    link() {
      return this.$auth.loggedIn ? "/logout" : "/login"
    }
  },
  fetchOnServer: false
}
</script>

<style scoped>
  .navigationAuth {
    cursor: pointer;
  }
</style>
