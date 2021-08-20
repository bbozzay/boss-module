<template>
  <div>Role Required</div>
</template>

<script>
export default {
  middleware: ['boss/requireLogin', 'boss/requireRole'],
  // meta: {
  //   role: "vv"
  // }
}
</script>
