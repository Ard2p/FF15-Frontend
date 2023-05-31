<template>
  <button
    class="close-btn"
    @click="$emit('click')"
    type="button"
  >
    &times;
  </button>
</template>

<script>
export default {
  name: "BaseButtonClose",
}
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  font-size: 24px;
  font-weight: 600;
  line-height: 48px;
  color:var(--primary-text);
  border-radius: 100%;

  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}
</style>