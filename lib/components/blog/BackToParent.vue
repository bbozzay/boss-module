<template>
  <nuxt-link :to="parentLink" class="inline-block underline"> <svg class="h-8 w-8 inline-block"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /></svg><span class="capitalize">{{ parentName }}</span></nuxt-link>
</template>

<script>
import { parent_link } from '../mixins/parent_link'
export default {
  mixins: [parent_link]
}
</script>