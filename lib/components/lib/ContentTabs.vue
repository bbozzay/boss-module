<template>
  <div class="tabs">
    <div class="tab_list flex">
      <button @click="currentTab = tab" v-for="tab in tabs" :key="tab" :class="['tab-button', { active: currentTab === tab }]">{{ tab }}</button>
    </div>
    <div class="tab_content" v-for="tab in tabs" :key="tab" v-show="currentTab == tab">
      <slot :name="tab"></slot>
    </div>
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
  button {
    position: relative;
  }
  button.active {
    color: #38a169;
    background: #fafafa;
    @apply underline shadow;
  }
  /* button.active::after {
    position: absolute;
    content: "";
    display: block;
    bottom: 1px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1a202c;
    background-color: rgba(26, 32, 44, 1);
    width: 4px;
    height: 4px;
    border-radius: 200%;
  } */
  button.active::after {
    content: "";
    display: block;
    position: absolute;
    transform: translate(-50%, 105%);
    left: 50%;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #efefef;
  }
  button {
    @apply p-4 capitalize text-lg;
    min-width: 10rem;
  }
  .tab_list {
    background: #efefef;
  }

</style>