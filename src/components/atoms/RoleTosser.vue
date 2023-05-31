<template>
  <div class="acc-roles" @dragover.prevent @dragenter.prevent :style="{
    'pointer-events': rolesForYou ? 'none' : 'auto'
  }">
    <div
      v-for="(role, idx) in roles" :key="idx"
      class="role"
      :draggable="!rolesForYou"
      :data-key="idx"
      @dragstart="dragstartHandler($event, idx)"
      @dragover="dragoverHandler($event, idx)"
      :style="`background-image: url('/img/icons/roles/${role}.png');`"
      :data-epa-city="role"
    />
  </div>
</template>

<script>
export default {
  props: ['rolesForYou'],
  data() {
    return {
      draggedIdx: -1
    }
  },
  methods: {
    dragstartHandler(ev, key) {
      this.draggedIdx = key
    },
    dragoverHandler(ev, dragoveredIdx) {
      ev.preventDefault()
      if ((this.draggedIdx > -1) && dragoveredIdx !== this.draggedIdx) {
        this.$store.dispatch('accounts/swapRoles', {dragged: this.draggedIdx, dragovered: dragoveredIdx})
        this.draggedIdx = dragoveredIdx
      }
    }
  },
  computed: {
    roles() {
      if (this.rolesForYou) {
        return this.rolesForYou
      } else {
        return this.$store.state.accounts.profile.roles
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.acc-roles {
  display: flex;
  justify-content: space-between;
}
.role {
  border-radius: 100%;
  border: 1px solid var(--primary-main);
  width: 28px; height: 28px;
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: grab;
  /* pointer-events:none; */
  &:before {
    content: attr(data-epa-city);
    position: relative;
    transform: scaleY(0);
    transition-duration: .15s;
    line-height: 16px;
    box-shadow: 0 0 1px 0 #333;
    background-color: #fff;
    color: #808191;
    padding: 5px;
    display: block;
    top: -30px;
    left: -20%;
    width: fit-content;
    transform-origin: bottom center;
    pointer-events: none;
  }
  &:hover {
    &:before {
      transform: scaleY(1);
    }
  }
  &:active {
    &:before {
      display: none;
    }
  }
}
</style>