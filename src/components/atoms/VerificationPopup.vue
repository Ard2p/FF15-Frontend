<template>
  <div>
    <div
      v-show="showPopup"
      class="modal-blur"
      :class="{
        'hide-blur': showPopup
      }"
    />
    <!-- @click="$store.dispatch('main/setVerificationPopup', false)" -->
    <div
      class="popup"
      :style="{
        'transform': showPopup ? 'scale(1)' : 'scale(0)',
        'transition': '.25s'
      }"
    >
      <div v-if="verifyResult === 'pending'">
        <h2 style="font-size: 22px">Верификация email, подождите</h2>
        <!-- <Loader style="height: 90px;" /> -->
        <div class="loadingio-eclipse" style="transform: translateY(-50px) scale(0.6);">
          <div class="ldio-rpinwye8j0b">
            <div/>
          </div>
        </div>
      </div>
      <div v-else-if="verifyResult === 'success'">
        <p style="margin: 50px 0; font-size: 20px; color: green;">Email верифицирован</p>
        <button class="main__btn btn btn_purple" @click="$store.dispatch('main/setVerificationPopup', false)">Закрыть</button>
      </div>
      <div v-else-if="verifyResult.startsWith('error_')">
        <p style="margin: 50px 0; font-size: 18px; color: red;">Ошибка, {{ $t('errors.' + verifyResult.substring(6)) }}</p>
        <button class="main__btn btn btn_purple" @click="$store.dispatch('main/setVerificationPopup', false)">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'VerificationPopup',
  components: {
    // Loader
  },
  data: () => {
    return {
    }
  },
  mounted() {
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setLoginModal', false)
      }
    },
  },
  computed: {
    showPopup() {
      return this.$store.state.main.showVerificationPopup
    },
    verifyResult() {
      return this.$store.state.main.verifyResult
    },
  }
}
</script>

<style lang="scss" scoped>
.modal-blur {
  opacity: 0.8;
  transition: all 0.25s ease-out;
  
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1042;
  overflow: hidden;
  position: fixed;

  /* background: #0b0b0b; */
  z-index: 15;
}
.hide-blur {
  opacity: 0;
}
.popup {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 130px);
  left: calc(50vw - 0px);
  width: 420px;
  height: 260px;
  border-radius: 24px;
  padding: 32px;
  /* padding-top: 40px; */
  background-color: var(--primary-opacity1);
  /* box-shadow: 0 0 16px var(--shadow0); */
  & h2 {
    margin-bottom: 48px;
    text-align: left;
  }
  &>a {
    line-height: 28px;
  }
}
.close-btn {
  position: absolute;
  font-size: 24px;
  line-height: 48px;
  width: 48px;
  color:#333;
  font-weight: 600;
  top: 16px; right: 16px;
  border-radius: 100%;
  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}




@keyframes ldio-rpinwye8j0b {
  0% { transform: rotate(0deg) }
  50% { transform: rotate(180deg) }
  100% { transform: rotate(360deg) }
}
.ldio-rpinwye8j0b div {
  position: absolute;
  animation: ldio-rpinwye8j0b 1s linear infinite;
  width: 160px;
  height: 160px;
  top: 20px;
  left: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 0 0 #e15b64;
  transform-origin: 80px 82px;
}
.loadingio-eclipse {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
}
.ldio-rpinwye8j0b {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-rpinwye8j0b div { box-sizing: content-box; }

</style>