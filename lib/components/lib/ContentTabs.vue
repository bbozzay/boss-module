<template>
  <div class="tabs">
    <div class="tab_list flex">
      <button @click="currentTab = tab" v-for="tab in tabs" :key="tab" :class="['tab-button', { active: currentTab === tab }]">{{ tab }}</button>
    </div>
    <hr class="mt-6 mb-6">
    <div class="tab_content" v-for="tab in tabs" :key="tab" v-show="currentTab == tab">
      <slot :name="tab"></slot>
    </div>
    <hr class="mt-6 mb-6">
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array
    }
  },
  data() {
    return {
      currentTab: this.tabs[0]
    }
  }
}
</script>

<style scoped>
  .active {
    color: #38a169;
    @apply underline;
  }
  button {
    @apply m-2 p-4 capitalize text-lg border border-black rounded-sm;
    min-width: 10rem;
  }

</style>