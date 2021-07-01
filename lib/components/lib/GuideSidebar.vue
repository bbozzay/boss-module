<template>
  <div id="sidebar" class="fixed visible inset-0 h-full z-90 w-full border-b -mb-16 lg:-mb-0 lg:sticky lg:h-auto lg:overflow-y-visible lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5 hidden pt-16">
    <div id="navWrapper">
    <nav id="nav">
      <ul v-for="module of tableOfContents.modules" :key="module.index" class="block module">
        <li class="module_item">
          <span class="module_title">
            {{ module.title }}
          </span>
        </li>
        <div v-for="article of module.articles" :key="article.index" class="article">
          <li class="article_item">
            <nuxt-link :to="article.path" :id="article.slug" class="article_link">
              <span>{{ article.title }}</span>
            </nuxt-link>
          </li>
          <ul v-if="showAnchors(article.path)" class="article_anchors">
            <li v-for="anchor of article.anchors" :key="anchor.index" class="anchor_item">
              <nuxt-link :to="anchor.path" :class="`anchor_link ${anchor.slug} ${anchor.tag}`">
                <span>{{ anchor.title }}</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </ul>
    </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableOfContents: {
      type: Object,
      required: true
    }
  },
  methods: {
    showAnchors(articlePath) {
      return this.$router.currentRoute.path == articlePath
    }
  },
  mounted() {
    const sidebar = document.querySelector(".article_anchors");
    const content = document.querySelector(".nuxt-content");
    if (!content) return;
    // Temp
    return;
    let targetSelectors = content.querySelectorAll("h2");
    const activeClass = "nuxt-link-active"
    let anchors = sidebar.querySelectorAll(".anchor_link");
    let lastActiveAnchor = sidebar.getElementsByClassName(activeClass)[0];
    const toggleActive = (selector) => {
      console.log(selector.id)
      lastActiveAnchor ? lastActiveAnchor.classList.remove(activeClass) : false;
      let sidebarAnchor = sidebar.querySelector(`.${selector.id}`);
      sidebarAnchor.classList.add(activeClass)
      lastActiveAnchor = sidebarAnchor;
    }
    const setActiveAnchor = (e) => {
      let bottomOfPage = window.scrollY + window.innerHeight > (document.body.offsetHeight - (window.innerHeight)*0.8);
      for (let i = 0; i < targetSelectors.length; i++) {
        let selector = targetSelectors[i];
        let selectorOffset = selector.getBoundingClientRect().top;
        if (selectorOffset < window.innerHeight*0.2) {
          toggleActive(selector)
        } else if (bottomOfPage) {
          // Fallback if the last selector is too short to trigger the active link at the bottom of the page
          toggleActive(targetSelectors[targetSelectors.length-1])
        }

      }
    }
    window.addEventListener("scroll", setActiveAnchor)
  }
}
</script>

<style lang="scss">
  #sidebar {
    order: 1;
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
    .module {
      @apply mb-8;
      &_item {
        @apply mb-2;
      }
      &_title {
        @apply font-bold;
        @apply uppercase;
        @apply text-lg;
      }
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
    #sidebar {
      height: calc(100vh - 4.5rem);
      top: 75px;
    }
    #navWrapper {
      @apply pt-8;
    }
  }
</style>