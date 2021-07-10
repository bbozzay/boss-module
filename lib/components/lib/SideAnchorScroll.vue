<template>
  <div id="sideAnchorScroll" class="fixed visible inset-0 h-full z-90 w-full border-b -mb-16 lg:-mb-0 lg:sticky lg:h-auto lg:overflow-y-visible lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5 hidden pt-16">
    <div id="navWrapper">
      <nav>
        <ul class="article_anchors">
          <li v-for="link in anchors" :key="link.id" class="anchor_item">
            <nuxt-link :to="link.path" class="anchor_link">{{ link.title }}</nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    anchors: {
      type: Array,
      default: () => {
        return [{
          title: "placeholder",
          path: "#test"
        }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #sideAnchorScroll {
    overflow-y: scroll;
    @apply pr-4;
    .nuxt-link-active {
      @apply text-green-600;
      &:not(.anchor_link) {
        @apply font-bold;
      }
    }
    .active {
      opacity: 0.5;
    }
    .article {
      &_item {
        @apply mb-2;
      }
      &_link {
        @apply text-sm;

      }
      &_anchors {
        @apply pl-3;
      }
    }
    .anchor {
      &_link {
        @apply text-xs;
        @apply block;

        &.h3 {
          @apply pl-3;
        }
      }
      &_item {
        @apply mb-3;
        // Line height
        @apply leading-4;
      }
    }
  }
  @media (min-width: 1024px) {
    #sideAnchorScroll {
      height: calc(100vh - 4.5rem);
      top: 75px;
    }
    #navWrapper {
      @apply pt-8;
    }
  }
</style>