<template>
    <div class="stripeSubscribe">
        Stripe Subscribe
    </div>
</template>

<script>
export default {
    props: {

    },
    data () {
        return {
            loading: false,
        }
    },
    computed: {
        // subscription() {
        //     return plans.subscriptions[this.subscription_index]
        // }
    },
    methods: {

    },
    mounted() {
        // If redirect url is passed as a prop, default to that value
    },
    fetchOnServer: false,
    async fetch() {
    }
}
</script>

<style scoped lang="scss">

</style>
