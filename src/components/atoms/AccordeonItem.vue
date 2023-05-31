<template>
    <div class="acc-item">
        <div class="accordion-header" data-index="0">
            <div class="accordion-title-wrapper">
                <!-- <img
                    class="acc-icon"
                    alt="настоящий дух соревнований icon"
                    src="https://images.contentstack.io/v3/assets/blt370612131b6e0756/bltd49a1f62dd145698/5f597a732917074cd81a1e6d/ic-competition.png"
                    :class="{ active }"
                > -->
                <svg class="acc-icon" :class="{ active }">
                    <use :xlink:href="`/img/icons.svg#icon-faq`"/>
                </svg>
                <h4
                    class="acc-title"
                    :class="{ active }"
                >
                    <slot name="head">
                        HEAD
                    </slot>
                </h4>
            </div>
            <span class="acc-indicator" :class="{ active }" />
        </div>
        <div class="acc-descr" :style="{height: active ? height + 'px' : 0}">
            <div class="acc-desc-sub">
                <div class="richTextContent-2_e96 ">
                    <slot name="body">
                        BODY
                    </slot>
                </div>
                <span class="acc-dash-detail" :class="{ active }" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'active', 'height' ]
}
</script>


<style lang="scss" scoped>
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.acc-item:not(:last-of-type) {
  margin-bottom: 1.2rem;
}
.acc-item {
  overflow: hidden;
  color: var(--primary-text);
  cursor: pointer;
}

.accordion-title-wrapper {
  display: flex;
  align-items: center;
  height: 54px;
}
.acc-icon {
  transform: scale(.8);
  margin-right: 1rem;
  transform-origin: center;
  height: 30px;
  width: 30px;
  min-width: 30px;
  backface-visibility: hidden;
  transition: transform 0.2s ease-in-out;
  fill: var(--primary-text);

  &.active {
    transform: scale(1);
  }
}
.acc-title {
  font-size: 24px !important;
  transform: scale(.6);
  transition: transform .2s ease-in-out;
  transform-origin: left;
  text-align: left;
  user-select: none;
  text-transform: uppercase;
  &.active {
    transform: scale(1);
  }
}

.acc-descr {
  font-size: 1.6rem;
  transition-duration: .2s;
}

.acc-indicator {
  background-color: var(--primary-text);
  transform: rotate(0deg);
  transform-origin: center;
  height: .3rem;
  width: 1.3rem;
  min-width: 1.3rem;
  min-height: .3rem;
  position: relative;
  transition: transform .5s ease-out;
}
.acc-indicator:before {
  transform: rotate(90deg);
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  transition: transform .5s ease-out;
  background-color: var(--primary-text);
  transform-origin: center;
}

.acc-indicator.active {
  transform: rotate(180deg);
}
.acc-indicator.active:before {
  transform: rotate(180deg);
}

.acc-desc-sub {
  padding: 20px 30px 30px 0;
  position: relative;
  /* position: absolute; */
  font-size: 16px;
  font-family: Inter, sans-serif;
  text-align: left;
  text-transform: none;
  transform: translate(0px, 0px);
}
.acc-desc-sub:before {
  left: 0;
  /* background: hsla(0,0%,100%,.4); */
  background: var(--primary-text);
  content: "";
  display: block;
  position: absolute;
  height: .25rem;
  width: 100%;
  bottom: .55rem;
  z-index: -1;
  box-sizing: border-box;
}

.acc-dash-detail {
  left: 0;
  transform-origin: left;
  /* background: hsla(0,0%,100%,.4); */
  background: var(--primary-text);
  position: absolute;
  bottom: .2rem;
  backface-visibility: hidden;
  height: .35rem;
  width: 5rem;
  transition-duration: .5s;
  transform: scaleX(0);
  &.active {
    transform: scaleX(1);
  }
  &:after {
    right: -.35rem;
    border-right: .35rem solid transparent;
    /* border-top: .35rem solid hsla(0,0%,100%,.4); */
    background: var(--primary-text);
    content: "";
    display: block;
    position: absolute;
    top: 0;
  }
}

.br-wrapper {
  position: relative;
}
.border-line {
  height: 100%;
  width: .3rem;
  position: absolute;
  top: 0;
  background-color: var(--primary-text);
  animation: height-go-100 1s;
}
.dash-detail {
  transform-origin: top;
  background: var(--primary-text);
  height: 40%;
  width: .8rem;
  position: absolute;
  top: 0;
  right: 0;
  animation: height-go-40 1.2s;
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -.8rem;
    top: auto;
    right: 0;
    border-left: .8rem solid transparent;
    border-top: .8rem solid var(--primary-text);
  }
}
@keyframes height-go-100 {
  0% {
    height: 0%;
  }
  100% {
    height: 100%
  }
}
@keyframes height-go-40 {
  0% {
    height: 0%;
  }
  100% {
    height: 40%
  }
}

.icon-tmp {
    min-width: 24px;
    width: 24px;
}
</style>