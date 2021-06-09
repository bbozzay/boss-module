<template>
  <div class="gatedVideo__player">
    <iframe class="gatedVideo__player_iframe" width="" height="" :src="video_url"  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  props: {
    video_id: {
      type: String
    },
    url_src: {
      type: String
    }
  },
  computed: {
    video_url() {
      return this.url_src? this.url_src : `https://www.youtube.com/embed/${this.video_id}`
    }
  }
}
</script>

<style scoped lang="scss">
  .gatedVideo__player {
      position: relative;
      overflow: hidden;
      width: 100%;
      padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
      background: #efefef;

      &_iframe {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
      }
  }
</style>