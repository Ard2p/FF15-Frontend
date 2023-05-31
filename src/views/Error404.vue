<template>
  <div class="e404">
    Эта страница 404. <span style="z-index: 2;">⛪</span><Loader style="height: 24px; margin: 0; width: 24px; margin-left: -25px;margin-top: -16px;"/>
  </div>
</template>


<script>
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'Error404',
  components: {
    Loader
  }
}
</script>
<style lang="scss" scoped>
.e404 {
  font-size: 20px;
  height: 65vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 900px;
  margin: 20px auto;
}
</style>