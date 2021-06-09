<template>
  <div :class="`floatingForm bg-black text-white shadow ${open ? 'active' : '' }`">
    <button class="floatingForm__button bg-gray-100 shadow-md absolute" @click="open = !open">
      <span v-show="!open" class="flex">
        <slot name="openbutton">
          <span class="text-purple-600 display block sm:hidden">?</span>
          <span class="text-purple-600 display hidden sm:block">Ask a Question</span>
        </slot>
      </span>
      <span v-show="open">Close</span>
    </button>
    <form-base :name="name" successMessage="Message sent!" className="p-4">
      <slot></slot>
      <button class="inline-flex items-center border border-white p-2" type="submit">Send Message <slot name="submitbutton"></slot></button>
    </form-base>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: this.active
    }
  }
}
</script>
<style scoped lang="scss">
  .floatingForm {
    position: fixed;
    right: 0;
    bottom: 25%;
    transform: translate(100%, 100%);

    &.active {
      transform: translate(0%, 0%);
      bottom: 0%;

      .floatingForm__button {
        @apply bg-black text-white;
        transform: translate(0%, -100%);
        right: 0;
      }
    }

    @media (min-width: 640px) {
      bottom: 0%;
      transform: translate(0%, 100%);
      &:before {
        display: none;
      }
      &.active {
        transform: translate(0, 0%);
      }
      .floatingForm__button {
        transform: translate(0%, -150%);
      }
    }

  }
  .floatingForm__button {
    transform: translate(-100%, 0%);
    @apply inline-block py-2 px-4 no-underline py-2 px-4 no-underline rounded-sm text-black inline-flex items-center;
    @media (min-width: 640px) {
      right: 5%;
      transform: translate(0%, -100%);
    }
  }
</style>