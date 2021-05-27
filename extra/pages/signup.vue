<template>
  <div class="login container w-6/12 mx-auto flex flex-col items-center justify-center text-center mt-0 py-32">
    <div>
      <h1>Select a Plan</h1>
    </div>
    <signup-plans :plans="plans"></signup-plans>
  </div>
</template>

<script>
import data from "~/data/plans";
export default {
  ssr: false,
  fetchOnServer: false,
  middleware: ["boss/requireLogin"],
  // data() {
  //   return {
  // },
  async asyncData() {
    return {
      // plans: dataFile.plans
      plans: data.plans
    }
  },
  async fetch() {
    // let redirectUrl = this.$route.params.redirectUrl;
    // redirectUrl ? redirectUrl : null;
    // await this.$boss.loginThenRedirect(redirectUrl);
  }
}
</script>