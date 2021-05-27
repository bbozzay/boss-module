<template>
  <div class="lightbox" v-if="render"></div>
</template>

<script>
import { Luminous } from 'luminous-lightbox';
export default {
  // Could extend this to offer a pre-rendered state using props to toggle that on or off
  data() {
    return {
      render: false
    }
  },
  mounted() {
    let header = document.getElementById("header");
    let luminousOptions = {
      onOpen: function() {
        document.body.classList.add("lightbox--open")
      },
      onClose: function() {
        document.body.classList.remove("lightbox--open")
      }
    }
    let contentDiv = document.getElementsByClassName("article_content")[0];
    let images = Array.from(contentDiv.getElementsByTagName("img"));
    let contentImages = images.filter(image => !image.classList.contains("standard_image"));

    for (let i = 0; i < contentImages.length; i++) {
      let image = contentImages[i];
      let linkNode = document.createElement("a");
      linkNode.className = "lightbox";
      linkNode.href = image.src;
      linkNode.innerHTML = image.outerHTML;
      image.parentNode.replaceChild(linkNode, image)
      new Luminous(linkNode, luminousOptions)
    }
  }
}
</script>

<style>
  .lum-open {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .lightbox {
    cursor: zoom-in;
  }
  .lum-img {
    cursor: zoom-out;
  }
  .lum-lightbox-inner img {
    margin: 0 auto;
  }

  .lightbox--open #header {
    transform: translate(0, -100%);
    transition: .2s transform;
  }
</style>