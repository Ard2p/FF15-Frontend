<template>
  <button
    class="soc-btn"
    type="button"
    @click="$emit('click')"
    :disabled="inLoading"
  >
<!--    <Loader v-if="inLoading" style="position: absolute; height: 50px; right: -50px; top: calc(50% - 22px);" />-->
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton"
}
</script>

<style lang="scss" scoped>
.soc-btn {
  position: relative;
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 56px;

  &:hover {
     filter: brightness(1.2);
   }
}
</style>