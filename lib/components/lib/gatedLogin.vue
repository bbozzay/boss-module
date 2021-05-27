<template lang="html">
    <div class="gatedLogin">
        <client-only>
            <button v-if="!$auth.loggedIn" class="buttonBlack" @click="startLogin()">{{ buttonText }}</button>
            <nuxt-link v-if="$auth.loggedIn" class="buttonBlack" :to="redirectPath">{{ buttonText }}</nuxt-link>
        </client-only>
    </div>
</template>

<script>
export default {
    props: {
        redirectPath: {
            type: String
        },
        buttonText: {
            type: String,
            default: "Start the Free Course"
        }
    },
    methods: {
        startLogin() {
            // Pass a specific redirectPath based on the component target. This overrides the middleware that redirects to the referring page after login
            this.$router.push({
                name: "login",
                params: {
                    redirectUrl: this.redirectPath
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/parts/button/black";
</style>