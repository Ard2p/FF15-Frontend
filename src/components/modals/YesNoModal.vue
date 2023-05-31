<template>
  <div>
    <div
      v-show="isShown"
      class="modal-blur"
      :class="{
        'hide-blur': !isShown
      }"
      @click="$store.dispatch('main/setYesNoModal', { val: false })"
    />
    <div
      class="yesno-modal"
      :style="{
        'transform': isShown ? 'scale(1)' : 'scale(0)',
        'transition': '.25s'
      }"
    >
      <button
        class="close-btn"
        @click="$store.dispatch('main/setYesNoModal', { val: false })"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <div style="margin: 20px auto;">
        {{ $store.state.main.yesNoModalText }}
      </div>
      <div style="display: flex; justify-content: space-around;">
        <button
          class="soc-btn"
          @click="$store.state.main.yesNoModalOkAction"
        >
          Да
        </button>
        <button
          class="soc-btn"
          @click="$store.dispatch('main/setYesNoModal', { val: false })"
        >
          Нет
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import axiosInstance from '@/store/axiosInstance.js'
// import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'YesNoModal',
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
        this.$store.dispatch('main/setYesNoModal', { val: false })
      }
    },
  },
  computed: {
    isShown() {
      return this.$store.state.main.showYesNoModal
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
  z-index: 15;
  background-color: #000;
}
.hide-blur {
  opacity: 0;
}
.yesno-modal {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 160px);
  left: calc(50vw - 0px);
  width: 320px;
  border-radius: 24px;
  padding: 32px;
  padding-top: 42px;
  /* padding-top: 40px; */
  background-color: var(--primary-opacity1);
  /* box-shadow: 0 0 16px var(--shadow4); */
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
  color:var(--primary-text);
  font-weight: 600;
  top: 16px; right: 16px;
  border-radius: 100%;
  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}

.soc-btn {
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  width: 90px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 46px;
  &:hover {
    filter: brightness(1.2);
  }
}
</style>
