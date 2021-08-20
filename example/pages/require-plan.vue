<template>
  <div>Any Role Required</div>
</template>

<script>
export default {
  middleware: ['boss/requireLogin', 'boss/requireAnyRole']
}
</script>
