<template>
  <div>
    <boss-loading></boss-loading>
    <header id="mainHeader">
      <client-only>
        <div style="color: green" v-if="$auth.loggedIn">
          Logged in as {{ $auth.user.email }}
        </div>
        <button v-show="!$auth.loggedIn" @click="$boss.login($route.path)">Login</button>
        <button v-show="!$auth.loggedIn" @click="$boss.signup($route.path)">Signup</button>
        <button v-show="$auth.loggedIn" @click="$boss.logout()">Logout</button>
      </client-only>
    </header>
    <nav>
      <ul>
        <li v-for="route in routes" :key="route.id">
          <nuxt-link :to="route.path">{{ route.name }}</nuxt-link>
        </li>
      </ul>
    </nav>
    <main>
      <Nuxt />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Landing",
          path: "/landing"
        },
        {
          name: "Account",
          path: "/account"
        }
      ]
    }
  }
}
</script>