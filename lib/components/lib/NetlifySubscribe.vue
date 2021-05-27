<template>
  <div class="signup_form">
    <form class="w-full" :form-name="name" :name="name" method="POST" v-on:submit.prevent="onSubmit" ref="form" data-netlify="true">
      <input type='hidden' name='form-name' :value='name' />
      <label><input type="email" placeholder="Enter Email" name="email" v-model="email" /></label>
      <input type='hidden' name='referred' :value='referred' />
      <button class="btn inline-block py-2 px-4 no-underline border border-black rounded-sm hover:bg-white hover:text-gray-900 text-white bg-black" type="submit" :disabled="!email">{{ buttonText }}</button>
    </form>
    <div v-if="submitted" class="success">
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      default: "newsletter"
    },
    redirectPath: {
      required: false
    },
    successMessage: {
      default: "You've been added to the list!"
    },
    buttonText: {
      default: "Get Free Early Access"
    }
  },
  data() {
    return {
      email: '',
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
  input {
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
  .success {
    span {
      background: yellow;
    }    
  }
</style>