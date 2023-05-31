<template>
  <div class="home screen">
    <video
      id="videoBG"
      playsinline=""
      ref="vid1"
      autoplay=""
      loop="true"
      muted
      preload="auto"
    >
      <source src="/videos/promo.mp4" type="video/mp4" />
    </video>
    <div id="videoOverlay" />
    <div class="audio-wrap" v-show="!showVerificationPopup">
      <audio preload controls src="">
        Your browser does not support HTML5 Audio! 😢
      </audio>
      <svg class="icon icon-sound" @click="soundToggle">
        <use
          :xlink:href="`/img/icons.svg#icon-sound-${muted ? 'off' : 'on'}`"
        />
      </svg>
    </div>

    <div
      style="
        position: absolute;
        top: 30px;
        right: 50px;
      "
    >
      <!-- <AuthControl v-if="authTryDone" promo /> -->
      <router-link
        to="/tournaments"
        class="link1"
      >
        Перейти в турниры
      </router-link>
    </div>

    <div class="content-wrapper" v-if="!showVerificationPopup">
      <div class="h2-wrap">
        <div class="br-wrapper">
          <span class="border-line"></span>
          <span class="dash-detail" style=""></span>
        </div>
        <div>
          <h2 class="welc">{{ $t("home.welcome")[0] }}</h2>
          <h2 class="welc">{{ $t("home.welcome")[1] }}</h2>
          <h2 class="welc">{{ $t("home.welcome")[2] }}</h2>
        </div>
      </div>

      <div class="acc-wrap">
        <div class="accordion-smth">
          <div class="acc-item" @click="accData = accData === 0 ? null : 0">
            <div class="accordion-header" data-index="0">
              <div class="accordion-title-wrapper active-1Ri9D">
                <img
                  class="acc-icon"
                  alt="настоящий дух соревнований icon"
                  src="https://images.contentstack.io/v3/assets/blt370612131b6e0756/bltd49a1f62dd145698/5f597a732917074cd81a1e6d/ic-competition.png"
                  :class="{ active: accData === 0 }"
                />
                <h4 class="acc-title" :class="{ active: accData === 0 }">
                  {{ $t("home.header1") }}
                </h4>
              </div>
              <span class="acc-indicator" :class="{ active: accData === 0 }" />
            </div>
            <div
              class="acc-descr"
              :style="{ height: accData === 0 ? '130px' : '0' }"
            >
              <div class="acc-desc-sub">
                <div class="richTextContent-2_e96">
                  {{ $t("home.desc1") }}
                </div>
                <span
                  class="acc-dash-detail"
                  :class="{ active: accData === 0 }"
                />
              </div>
            </div>
          </div>
          <div class="acc-item" @click="accData = accData === 1 ? null : 1">
            <div class="accordion-header" data-index="1">
              <div class="accordion-title-wrapper false">
                <img
                  class="acc-icon"
                  alt="популярные чемпионы из лиги icon"
                  src="https://images.contentstack.io/v3/assets/blt370612131b6e0756/blt68c90ed19df72f7e/5f597a7465c9c14aec2faebf/ic-champions.png"
                  :class="{ active: accData === 1 }"
                />
                <h4 class="acc-title" :class="{ active: accData === 1 }">
                  {{ $t("home.header2") }}
                </h4>
              </div>
              <span class="acc-indicator" :class="{ active: accData === 1 }" />
            </div>
            <div
              class="acc-descr"
              :style="{ height: accData === 1 ? '190px' : '0px' }"
            >
              <div class="acc-desc-sub">
                <div class="richTextContent-2_e96">
                  {{ $t("home.desc2") }}
                </div>
                <span
                  class="acc-dash-detail"
                  :class="{ active: accData === 1 }"
                />
              </div>
            </div>
          </div>
          <div class="acc-item" @click="accData = accData === 2 ? null : 2">
            <div class="accordion-header" data-index="2">
              <div class="accordion-title-wrapper false">
                <img
                  class="acc-icon"
                  alt="красочная вселенная icon"
                  src="https://images.contentstack.io/v3/assets/blt370612131b6e0756/bltc3f5e9f65db6c6e0/5f597a74d1e5eb4414692ee8/ic-universe.png"
                  :class="{ active: accData === 2 }"
                />
                <h4 class="acc-title" :class="{ active: accData === 2 }">
                  {{ $t("home.header3") }}
                </h4>
              </div>
              <span class="acc-indicator" :class="{ active: accData === 2 }" />
            </div>
            <div
              class="acc-descr"
              :style="{ height: accData === 2 ? '110px' : '0px' }"
            >
              <div class="acc-desc-sub">
                <div class="richTextContent-2_e96">
                  {{ $t("home.desc3") }}
                </div>
                <span
                  class="acc-dash-detail"
                  :class="{ active: accData === 2 }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        class="submit-button"
        type="button"
        :style="{ 'pointer-events': twoSecond ? 'all' : 'none' }"
        @click="$store.dispatch('main/setLoginModal', true)"
      >
        <span class="animated-border ab-top" />
        <span class="animated-border ab-bottom" />
        ВПЕРЕД!
      </button>
    </div>
  </div>
</template>

<script>
// import AuthControl from '@/components/molecules/AuthControl'

export default {
  metaInfo: {
    title: "FF15 - Турнирная площадка",
  },
  name: "Home",
  components: {
    // AuthControl
  },
  data: () => {
    return {
      muted: true,
      twoSecond: false,
      accData: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const isPlaying =
        vm.$refs.vid1.currentTime > 0 &&
        !vm.$refs.vid1.paused &&
        !vm.$refs.vid1.ended &&
        vm.$refs.vid1.readyState > 2;
      if (!isPlaying) {
        vm.$refs.vid1.play();
      }
    });
  },
  mounted() {
    if (this.$route.path === "/verify" && this.$route.query) {
      const email = this.$route.query.email;
      const token = this.$route.query.token;
      this.$store.dispatch("main/setVerificationPopup", true);
      this.$store.dispatch("main/verify", { token, email });
      //show modal with loading
      //make ajax
      //show result of ajax
      // console.log('verifficaition')
      // console.log('code', 'email', token, email)
    }

    setTimeout(
      function () {
        this.twoSecond = true;
      }.bind(this),
      400
    );
  },
  methods: {
    soundToggle() {
      this.$refs.vid1.volume = 0.15;
      this.$refs.vid1.muted = !this.$refs.vid1.muted;
      this.muted = this.$refs.vid1.muted;
    },
  },
  computed: {
    showVerificationPopup() {
      return this.$store.state.main.showVerificationPopup;
    },
    user() {
      return this.$store.state.auth.user;
    },
    isAuthed() {
      return this.$store.getters['auth/isAuthed']
    },
    authTryDone() {
      return this.$store.state.auth.tried_auth
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  margin: 0;
  width: 100%;
  z-index: 0;
  background-color: white;
  height: 100vh;
}
#videoBG {
  width: 100%;
  /* width: 100vw; */
  /* height: 100vh; */
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  object-fit: cover;
  position: relative;
  /* min-width: 100vw;
  min-height: 100vh; */
  /* height: 100vh; */
}
#videoOverlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  mix-blend-mode: var(--fill-layer-background-overlay-blend-mode);
  background-size: auto;
  background-repeat: repeat;
  background-position: 50%;
  background: rgb(0 0 0 / 10%);
}
.audio-wrap {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  background-color: #fff;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  & audio {
    display: none;
  }
  & .icon {
    z-index: 2;
    width: 22px;
    height: 22px;
    fill: #000;
    &:hover {
      fill: var(--primary-text1);
      cursor: pointer;
    }
  }
}

.content-wrapper {
  position: absolute;
  top: 15%;
  left: 15%;
  right: 50%;
  bottom: 10%;
  display: flex;
  flex-direction: column;
  font-family: "blolbold";
  font-size: 1.4rem;
  color: #fff;
  text-transform: uppercase;
  .h2-wrap h2 {
    font-size: 3.8vw;
    line-height: 4.2vw;
    margin: 0 auto;
    text-align: left;
    margin-left: 30px;
    .small {
      font-size: 1rem;
      line-height: 0.5rem;
    }
  }
  .h2-wrap {
    margin-bottom: 45px;
    display: flex;
  }
  .sub-header {
    font-size: 7rem;
    line-height: 3.7rem;
    color: #fff;
    text-shadow: 0px 3px #000, 0px -1px #000;
  }
}

.submit-button {
  user-select: none;
  opacity: 0.7;
  font-size: 1.6rem;
  margin: 0 auto;

  cursor: pointer;
  padding: 1.8rem 2.9rem;
  transform: skewX(-14.5deg);
  color: #141e37;
  width: 18rem;
  /* transition: color .2s ease-out; */
  line-height: 1.15;
  background-color: #fff;
  animation: appearcolor;
  animation-duration: 1.5s;
  transition-duration: 0.3s;
  font-family: "blolbold";
}
.submit-button:hover {
  background-color: #000;
  color: #fff;
}
.animated-border {
  position: absolute;
  border-style: solid solid none none;
  border-color: #fff;
  animation: appearborder;
  animation-duration: 1s;
}
.ab-top {
  top: 0;
  left: 0;
  transform-origin: top left;
}
.ab-bottom {
  bottom: 0;
  right: 0;
  transform: rotateZ(180deg);
}
@keyframes appearcolor {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: transparent;
  }
  100% {
    background-color: #fff;
  }
}
@keyframes appearborder {
  0% {
    border-width: 4px;
    width: 0;
    height: 0;
  }
  50% {
    width: 100%;
    height: 0;
  }
  100% {
    width: 100%;
    height: 100%;
    border-width: 4px;
  }
}

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
  color: #fff;
  cursor: pointer;
}

.accordion-title-wrapper {
  display: flex;
  align-items: center;
  height: 54px;
}
.acc-icon {
  transform: scale(0.8);
  margin-right: 2rem;
  transform-origin: center;
  height: 30px;
  width: 30px;
  backface-visibility: hidden;
  transition: transform 0.2s ease-in-out;
  &.active {
    transform: scale(1);
  }
}
.acc-title {
  font-size: 24px !important;
  transform: scale(0.6);
  transition: transform 0.2s ease-in-out;
  transform-origin: left;
  text-align: left;
  user-select: none;
  text-transform: uppercase;
  &.active {
    transform: scale(1);
  }
}
.accordion-smth {
  padding-right: 5%;
  width: 100%;
  display: block;
  max-width: 500px;
}

.acc-wrap {
  margin: 26px;
  min-width: 480px;
  position: relative;
  /* order: 1; */
  /* min-height: 25rem; */
}

.acc-descr {
  font-size: 1.6rem;
  transition-duration: 0.2s;
}

.acc-indicator {
  background-color: #fff;
  transform: rotate(0deg);
  transform-origin: center;
  height: 0.3rem;
  width: 1.3rem;
  min-width: 1.3rem;
  min-height: 0.3rem;
  position: relative;
  transition: transform 0.5s ease-out;
}
.acc-indicator:before {
  transform: rotate(90deg);
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  transition: transform 0.5s ease-out;
  background-color: #fff;
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
  background: hsla(0, 0%, 100%, 0.4);
  content: "";
  display: block;
  position: absolute;
  height: 0.25rem;
  width: 100%;
  bottom: 0.55rem;
  z-index: -1;
  box-sizing: border-box;
}

.acc-dash-detail {
  left: 0;
  transform-origin: left;
  background: hsla(0, 0%, 100%, 0.4);
  position: absolute;
  bottom: 0.2rem;
  backface-visibility: hidden;
  height: 0.35rem;
  width: 5rem;
  transition-duration: 0.5s;
  transform: scaleX(0);
  &.active {
    transform: scaleX(1);
  }
  &:after {
    right: -0.35rem;
    border-right: 0.35rem solid transparent;
    border-top: 0.35rem solid hsla(0, 0%, 100%, 0.4);
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
  width: 0.3rem;
  position: absolute;
  top: 0;
  background-color: #fff;
  animation: height-go-100 1s;
}
.dash-detail {
  transform-origin: top;
  background: #fff;
  height: 40%;
  width: 0.8rem;
  position: absolute;
  top: 0;
  right: 0;
  animation: height-go-40 1.2s;
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -0.8rem;
    top: auto;
    right: 0;
    border-left: 0.8rem solid transparent;
    border-top: 0.8rem solid #fff;
  }
}
@keyframes height-go-100 {
  0% {
    height: 0%;
  }
  100% {
    height: 100%;
  }
}
@keyframes height-go-40 {
  0% {
    height: 0%;
  }
  100% {
    height: 40%;
  }
}
.welc {
  white-space: nowrap;
  width: 100%;
  animation: width-go-100 1.2s;
  overflow: hidden;
}
@keyframes width-go-100 {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
.link1 {
  font-weight: 500;
  color: #fff;
  font-size: 18px;
  background: #ccc3;
  padding: 8px 16px;
}
.link1:hover {
  color: var(--primary-main);
}
</style>