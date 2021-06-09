<template>
  <form :class="className" :form-name="name" :name="name" method="POST" v-on:submit.prevent="onSubmit" ref="form" data-netlify="true">
    <input type='hidden' name='form-name' :value='name' />
    <input type='hidden' name='referred' :value='referred' />
    <slot></slot>
    <div v-if="submitted" class="success">
      <span>{{ successMessage }}</span>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    name: {
      default: "newsletter",
      required: true
    },
    redirectPath: {
      required: false
    },
    successMessage: {
      default: "You've been added to the list!"
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      referred: '',
      submitted: ''
    }
  },
  methods: {
    onSubmit() {
        let formData = new FormData(this.$refs.form)
        fetch('/', {
          method: 'POST',
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        }).then(() => {
          this.submitted = true;
          this.redirectPath ? this.$router.push(this.redirectPath) : false;
        }).catch((error) =>
          alert(error))
    }
  },
  mounted() {
    this.referred = document.referrer;
  }
}
</script>

<style scoped lang="scss">
  form {
    @apply max-w-md;
  }
  button {
    @apply text-lg;
  }
  input, textarea {
    @apply w-full;
    @apply h-12;
    @apply border-solid;
    @apply border-gray-400;
    @apply border;
    @apply p-1;
    @apply rounded-sm;
    @apply mb-4;
    @apply text-base;
  }
  textarea {
    min-height: 125px;
  }
</style>