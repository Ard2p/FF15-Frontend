<template>
  <label
    class="switch switch_theme js-switch-theme"
    :class="{ 'moon-theme': theme === 'moon' }"
  >
    <input
      class="switch__input"
      type="checkbox"
      @input="$store.dispatch('main/switchTheme')"
      :checked="theme === 'sun'"
    />
    <span class="switch__in">
      <span class="switch__box"/>
      <span class="switch__icon">
        <svg v-if="theme === 'moon'" class="icon icon-moon">
          <use xlink:href="/img/icons.svg#icon-moon"/>
        </svg>
        <svg v-else-if="theme === 'sun'" class="icon icon-sun">
          <use xlink:href="/img/icons.svg#icon-sun"/>
        </svg>
      </span>
    </span>
  </label>
</template>

<script>

export default {
  computed: {
    theme() {
      return this.$store.state.main.theme
    }
  }
}
</script>
<style lang="scss" scoped>
.switch {
  display: inline-block;
  position: relative;
  user-select: none;
  cursor: pointer;
  font-size: 0;
  transition: opacity .25s;
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
.switch_theme .switch__in {
  padding-left: 56px;
}
.switch__in {
  display: inline-block;
}
.switch__box {
  position: relative;
  display: block;
  width: 64px;
  height: 24px;
  background: var(--primary-opactiy2);
  border-radius: 16px;
  transition: all .25s;
  &:before {
    box-sizing: border-box;
    content: "";
    position: absolute;
    top: 50%;
    left: 2px;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 4px solid #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
    background: var(--secondary-main);
    transition: all .25s;
  }
}
.switch.moon-theme .switch__box:before {
  width: 4px;
  height: 16px;
  border-width: 2px;
  border-radius: 2px;
  transform: translate(48px, -50%);
  border-color: var(--secondary-main);
}
.switch.moon-theme:hover .switch__box:before {
  border-color: #5FACFF;
}
.switch__icon {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 0;
}
.switch__icon .icon {
  font-size: 24px;
  fill: #3F8CFF;
}
.js-switch-theme:hover .switch__box:before{
  background: #5FACFF;
}
.js-switch-theme:hover .switch__icon .icon {
  fill: #5FACFF;
}


@media only screen and (max-width: 1023px) {
  .switch__box {
    display: none;
  }
}
</style>