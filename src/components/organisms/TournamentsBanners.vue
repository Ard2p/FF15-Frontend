<template>
  <div
    v-if="currentBanner"
    class="banners-wrapper"
    :style="{
      backgroundImage: `url(${currentBanner.img})`
    }"
  >
    <div class="decorations">
      <!-- <div class="main__live live live_big">Live</div> -->
      <div
        class="main__title h4"
        v-html="currentBanner.title"
      />
      <!-- <div class="main__parameters">
        <div class="main__parameter">
          <div class="main__icon">
            <img class="main__pic" src="img/lol-icon.png" alt="">
          </div>
          <div class="main__text">{{$t('games.' + currentBanner.game)}}®</div>
        </div>
        <div class="main__parameter">🇺🇸 English</div>
        <div class="main__parameter">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="28" viewBox="0 0 124.189 132.243"><path d="m62.096 8.5859c-5.208 0-9.424 4.2191-9.424 9.4261 0.001 5.203 4.217 9.424 9.424 9.424 5.202 0 9.422-4.221 9.422-9.424 0-5.208-4.22-9.4261-9.422-9.4261zm-10.41 21.268c-6.672 0-12.131 5.407-12.131 12.07v29.23c0 2.275 1.791 4.123 4.07 4.123 2.28 0 4.127-1.846 4.127-4.123v-26.355h2.102s0.048 68.811 0.048 73.331c0 3.05 2.478 5.53 5.532 5.53 3.052 0 5.525-2.48 5.525-5.53v-42.581h2.27v42.581c0 3.05 2.473 5.53 5.531 5.53 3.054 0 5.549-2.48 5.549-5.53v-73.331h2.127v26.355c0 2.275 1.85 4.123 4.126 4.123 2.28 0 4.073-1.846 4.073-4.123v-29.23c0-6.663-5.463-12.07-12.129-12.07h-20.82z"/></svg>
          <b>17</b>/25
        </div>
      </div> -->
      <div class="dec__bottom-row">
        <a
          v-if="currentBanner.btn_link"
          :href="currentBanner.btn_link"
          class="main__btn btn btn_purple"
          style="line-height: 56px; text-align: center;"
          target="_blank"
        >
          {{currentBanner.btn_name}}
        </a>
        <div v-else/>
        <div class="slide-controls">
          <VueSlickCarousel
            v-if="bList.length"
            :arrows="true"
            :dots="false"
            :edgeFriction="0.35"
            :infinite="true"
            :slidesToShow="4"
            :slidesToScroll="1"
            :pauseOnHover="true"
            :autoplay="false"
            @afterChange="carouAfterChange"
          >
            <div
              v-for="(banner, bidx) in bList" :key="'b_' + banner.id"
              tabindex="-1" aria-hidden="true"
            >
              <div
                class="main__preview"
                style="width: 96px;"
                :style="{
                  'background-image': `url(${banner.img})`,
                }"
                :class="{
                  'active': bidx === activeIdx,
                }"
                @click="activeIdx = bidx"
              />
            </div>
          </VueSlickCarousel>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: { VueSlickCarousel },
  data: () => ({
    banners: [
      '/img/banners/b5.png?v=0',
      '/img/banners/b6.png?v=0',
      '/img/banners/b7.png?v=0',
      '/img/banners/b8.png?v=0',
      '/img/banners/b5.png?v=1',
      '/img/banners/b6.png?v=1',
      '/img/banners/b7.png?v=1',
      '/img/banners/b8.png?v=1',
      '/img/banners/b5.png?v=2',
      '/img/banners/b6.png?v=2',
      '/img/banners/b7.png?v=2',
      '/img/banners/b8.png?v=2'
    ],
    slides: [],
    queue: [],
    activeIdx: 0
  }),
  mounted() {
    this.slides = this.banners.slice()

  },
  methods: {
    carouAfterChange(newCurrent) {
      this.activeIdx = newCurrent
    }


  },
  computed: {
    currentBanner() {
      return this.bList[this.activeIdx]
    },
    bList() {
      return this.$store.state.banners.bList
    }
  }
}
</script>

<style lang="scss" scoped>
.banners-wrapper {
  position: relative;
  user-select: none;
  width: 100%;
  max-height: 488px;
  height: 488px;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 64px;
  text-align: left;
  transition-duration: .5s;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, rgba(58, 62, 69, 0) 31%, rgba(27, 29, 33, 0.9) 82%);
  }
}
.banners-wrapper-ph {
  position: relative;
  user-select: none;
  width: 100%;
  max-height: 488px;
  height: 488px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
  text-align: center;
  transition-duration: .5s;
}
.decorations {
  position: relative;
  /* z-index: 2; */
  color: #ffffff;
  width: 100%;
}
.main__live {
  display: inline-block;
  border-radius: 8px;
  background: #FF754C url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='11' viewBox='0 0 16 11'%3E%3Cpath fill='%23fff' d='M7.717 7a2 2 0 1 1 0 4 2 2 0 1 1 0-4zm4.593-1.658a1 1 0 0 1-1.414 1.415 4.5 4.5 0 0 0-6.361 0 1 1 0 1 1-1.414-1.415 6.5 6.5 0 0 1 9.189 0zm2.83-2.145a1 1 0 1 1-1.414 1.414 8.5 8.5 0 0 0-12.019 0A1 1 0 1 1 .292 3.197c4.1-4.1 10.747-4.1 14.847 0z'/%3E%3C/svg%3E") no-repeat 14px 50%/16px auto;
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  color: #ffffff;
  margin-bottom: 8px;
  min-width: 78px;
  padding: 0 14px 0 38px;
  line-height: 26px;
}
.main__title {
  margin-bottom: 8px;
  font-family: 'blolbold', sans-serif;
  font-size: 32px;
  line-height: 1.5;
  letter-spacing: -.5px;
  font-weight: 500;
  max-width: 1100px;
}
.main__parameters {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.main__parameter {
  display: flex;
  align-items: center;
}
.main__parameter:not(:first-child) {
  margin-left: 12px;
}
.main__parameter:not(:first-child):before {
  content: "•";
  margin-right: 12px;
}
.main__icon {
  margin-right: 8px;
  font-size: 0;
}
.main__icon .main__pic {
  max-width: 24px;
}
.main__btn {
  min-width: 130px;
  background: #6C5DD3;
  color: #ffffff;
  margin: 12px 0;
  &:hover {
    background: #5a49ce;
  }
}



.dec__bottom-row {
  display: flex;
  justify-content: space-between;
  max-height: 80px;
}
.slide-controls {
  position: relative;
  max-width: 444px;
  width: 444px;
}
.slick-list {
  padding: 12px 6px;
  position: relative;
  overflow: hidden;
  display: block;
  margin: 0;
  /* padding: 12px 6px; */
  height: 100%;
}
.slick-track {
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  height: 56px;
}
.main__preview {
  /* float: left; */
  height: 100%;
  min-height: 1px;
  height: 56px;
  margin: 0 6px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 12px;
  font-size: 0;
  cursor: pointer;
  /* transition: box-shadow .25s; */
  /* transition: box-shadow .25s, -webkit-box-shadow .25s; */
  display: block;
  transition-duration: .5s;
  margin: 12px 6px;
  /* position: absolute; */
  &:hover {
    box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.8);
  }
  &.active {
    box-shadow: 0 0 6px 2px #ffffff;
  }
}
.slick-prev {
  left: -3px;
  padding-right: 1px;
}
.slick-arrow {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3F8CFF;
  font-size: 0;
  -webkit-transition: background .25s;
  -o-transition: background .25s;
  transition: background .25s;
}
.slick-arrow:hover {
  background: #0c6dff;
}
.icon-arrow-prev,
.icon-arrow-next {
  width: 0.6em;
  height: 1em;
  fill: #FFF;
  font-size: 9px;
}
.slick-next {
  right: -3px;
  padding-left: 2px;
}

.invis {
  visibility: hidden;
  display: none;
}
</style>