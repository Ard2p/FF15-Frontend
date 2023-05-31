<template>
  <!-- :src="'/img/685.png?size=' + size" -->
  <!-- :src="'/storage/img/profileicon/' + pic + '.png?size=' + size" -->
  <!-- src="/img/685.png" -->
  <!-- class="ratings-avatar" -->
  <img
    :src="src"
    alt="ava"
    :width="size"
    :height="size"
    style="image-rendering: -webkit-optimize-contrast"
    :class="mode === 'abstract' ? 'abstract' : 'ratings-avatar'"
    :style="{
      'border-color': roleToColor[role],
      'border-width': mode === 'abstract' ? 0 : size > 36 ? '3px' : '2px',
    }"
  />
</template>

<script>
export default {
  props: {
    dbg: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: [String, Number],
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
    size: {
      type: Number,
      default: 44,
    },
    mode: {
      type: String,
      default: null,
    },
  },
  computed: {
    src() {
      if (this.dbg) {
        return "/img/685.png";
      }
      switch (this.mode) {
        case "abstract":
          return `/storage/img/champion/${this.pic}.png`;
        case "team":
          return `/storage/img/teamicon/${this.pic}.png`;
        default:
          return `/storage/img/profileicon/${this.pic}.png`;
      }
    },
    roleToColor() {
      return this.$store.state.main.roleToColor;
    },
  },
};
</script>

<style lang="scss" scoped>
.ratings-avatar {
  border-radius: 12px;
  border-style: solid;
}
/* .abstract {
  border-style: solid;
  border-width: 2px;
} */
</style>