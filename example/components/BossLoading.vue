<template>
  <client-only>
    <div v-show="loading.status" :class="'bossLoading ' + (loading.status == true ? 'bossLoading__true' : '')">
      <div class="bossLoading__title">
        Loading
      </div>
      <div class="bossLoading__message">
        {{ loading.message }}
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  ssr: false,
  computed: {
    loading () {
      return this.$store.getters['boss/loadingStatus']
    }
  }
}
</script>

<style scoped>
	.bossLoading {
		position: fixed;
		background: #ffffff;
		padding: 5px;
		left: 50%;
		top: 10px;
	}
</style>
