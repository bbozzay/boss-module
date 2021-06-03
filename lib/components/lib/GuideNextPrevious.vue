<template>
  <ul class="next_previous pb-6">
    <li v-if="links.previous && links.previous.path" class="previous">
      <nuxt-link :to="links.previous.path">
        {{ links.previous.title }}
      </nuxt-link>
    </li>
    <li v-if="links.next && links.next.path" class="next">
      <nuxt-link :to="links.next.path">
        {{ links.next.title }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    links: {
      type: Object
    }
  }
}
</script>

<style scoped lang="scss">
.next_previous {
  display: flex;
  align-items: center;
}
.previous, .next {
  &:after, &:before {
    display: inline-block;
    position: absolute;
  }
}
.previous {
  @apply mr-auto;
  @apply ml-0;
  a {
    &:before {
      content: "\2039";
    }
  }
}
.next {
  @apply ml-auto;
  @apply mr-0;
  a {
    &:after {
      content: "\203A";
    }
  }
}
</style>