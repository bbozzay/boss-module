<template>
    <div class="gatedVideo__player">
        <client-only>
            <iframe class="gatedVideo__player_iframe" width="" height="" :src="video_url" v-if="video_url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </client-only>
        <div class="video_loading" v-if="!video_url">
            <div class="video_play"></div>
            <div>{{ message }}</div>
            <nuxt-link :to="`/signup?redirectUrl=${$route.path}`" v-if="signup_required">Signup</nuxt-link>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        video_id: {
            type: String,
        }
    },
    data() {
        return {
            video_url: null,
            message: "Loading Video....",
            signup_required: false
        }
    },
    // Cant use async fetch in component
    async fetch() {
        // Input from prop
        try {
            const videoId = await this.$boss.fetchVideoId("pagespeed", this.video_id);
            this.video_url = videoId ? `https://www.youtube.com/embed/${videoId}` : null
            if (!videoId) {
                this.message = "Signup for the Pagespeed plan to watch videos in this course"
                this.signup_required = true;
            }
        } catch(err) {
            console.log("videoId", err)
        }
        // Output from API
    },
    fetchOnServer: false
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
    .video_loading {
        font-size: 20px;
        color: red;
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        justify-content: center;
        flex-direction: column;
    }
    .video_play {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border-color: #000000;
        background: #000000;
        display: block;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            top: 50%;
            left: 50%;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 8px solid #fff;
            transform: translate(-50%, -50%);
        }
    }
</style>