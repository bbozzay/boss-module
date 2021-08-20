<template>
  <div>
    <h1>Page for logged-in users</h1>
    <ul>
      <li>Use boss/requireLogin middleware to prompt login when visiting this page from <strong>another route</strong> (client-side navigation)</li>
      <li>If this page is loaded directly, not navigated to from the client (via direct link or refresh), check the logged-in state before showing the content</li>
    </ul>
    <client-only>
      <div v-show="!$auth.loggedIn">
        <h2>User isn't logged in</h2>
        <button @click="$boss.login(true)">
          Login to Get Started
        </button>
      </div>
      <div v-show="$auth.loggedIn">
        <h2>Content for logged in users</h2>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  middleware: ['boss/requireLogin'],
  meta: {
    role: 'true'
  }
}
</script>
