<template>
  <div class="toggle" ref="toggle" :style="toggleStyle" @click="change" @mouseenter="mMove" @mouseleave="mOut" @mousedown="mDown" @mouseup="mUp" @>
    <span class="toggle__label" :class="{'toggle__label--on': value}" :style="labelStyle">{{value ? 'ON' : 'OFF'}}</span>
    <span class="toggle__thumb" :class="{'toggle__thumb--on': value}" :style="thumbStyle"></span>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    value: {type: Boolean, default: false},
    col: {type: String, default: 'white'},
  },
  data: function() {
    return {
      thumbX: 0,
      thumbScale: 1,
      labelScaleY: 1,
      labelX: 0
    }
  },
  computed: {
    toggleStyle() {
      return `
        color: ${this.col};
      `
    },
    thumbStyle() {
      return `
        background-color: ${this.col};
        transform: translateX(${this.thumbX}px) scale(${this.thumbScale});
      `
    },
    labelStyle() {
      return `
        transform: translateX(${this.labelX}px) scaleY(${this.labelScaleY});
      `
    }
  },
  methods: {
    change(){
      this.$emit('update:value', !this.value)
    },
    mMove(){
      this.labelScaleY = 1.2
    },
    mOut(){
      this.labelScaleY = 1
      this.thumbScale = 1
    },
    mDown(){
      this.thumbScale = 1.2
    },
    mUp(){
      this.thumbScale = 1
    }
  },
  watch: {
    value: function(newV){
      this.thumbX = newV ? 27 : 0
      this.labelX = newV ? -14 : 0
    }
  },
  mounted () {
    this.thumbX = this.value ? 27 : 0
    this.labelX = this.value ? -14 : 0
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.toggle {
	--height: 18px;
	--thumb-rad: calc(var(--height) - 8px);
	width: 46px;
	height: var(--height);
	line-height: var(--height);
	border-radius: 12px;
	font-size: 11px;
	position: relative;
	cursor: pointer;
	transition-duration: 0.4s;
}

.toggle:hover {
	filter: brightness(1.2);
}

.toggle:hover>.toggle__label {
	animation-name: foo;
}

.toggle__label {
	display: block;
	position: absolute;
	user-select: none;
	left: calc(50% - 5px);
	top: calc(50% - 9px);
	transition-duration: 0.5s;
	animation-duration: 0.6s;
	animation-iteration-count: infinite;
	animation-direction: alternate;
}

.toggle__thumb {
	display: block;
	width: var(--thumb-rad);
	height: var(--thumb-rad);
	border-radius: 100%;
	position: absolute;
	top: calc(50% - (var(--thumb-rad) / 2));
	left: 3px;
	transition-duration: 0.15s;
}
@keyframes foo {
  to {
    opacity: 0.6;
  }
}
</style>