<template>
  <div class="banned-popup-wrapper">
    <div
      v-show="isShown"
      class="modal-blur"
      :class="{
        'hide-blur': !isShown
      }"
      @click="$store.dispatch('main/setBannedPopup', false)"
    />
    <div
      class="ban-modal"
      :style="{
        'transform': isShown ? 'scale(1)' : 'scale(0)',
        'transition': '.25s'
      }"
    >
      <button
        class="close-btn"
        @click="$store.dispatch('main/setBannedPopup', false)"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <div style="margin: 20px auto; margin-top: 30px; text-align: center; font-size: 18px; font-weight: 900; color: red;">
        Тебя забанили
      </div>
      <div style="margin: 20px auto;">
        Причина бана: <b>{{bmValues.reason || 'Не указана'}}</b>
      </div>
      <div style="margin: 12px auto; display: flex;">
        <div style="flex-grow: 1;">
          Бан выдан:
        </div>
        <div style="flex-grow: 3; text-align: right;">
          <b>{{formatDate(bmValues.created_at)}}</b>
        </div>
      </div>
      <div style="margin: 12px auto; display: flex;">
        <div style="flex-grow: 1;">
          Бан закончится:
        </div>
        <div style="flex-grow: 3; text-align: right;">
          <b>{{formatDate(bmValues.end)}}</b>
        </div>
      </div>
      <div style="font-size: 12px; text-align: right;">{{new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}}</div>
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <button
          class="soc-btn"
          @click="$store.dispatch('main/setBannedPopup', false)"
        >
          Ладно
        </button>
        <button
          class="soc-btn"
          style="width: 180px;"
          @click="$store.dispatch('main/setBannedPopup', false)"
        >
          Я не верю в это
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BannedPopup',
  mounted() {
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    formatDate (d) {
      const dd = new Date(d)
      return `${dd.getDate()} ${this.$t('tournament.monthsFull')[dd.getMonth()]} ${dd.getFullYear()}г в ${dd.getHours()}:${dd.getMinutes()}`
    },
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setBanModal', false)
      }
    },
  },
  computed: {
    isShown() {
      return this.$store.state.main.showBannedPopup !== false
    },
    bmValues() {
      return this.$store.state.main.showBannedPopup
    }
  },
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
.ban-modal {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 210px);
  left: calc(50vw - 0px);
  width: 420px;
  border-radius: 24px;
  padding: 32px;
  padding-top: 42px;
  /* padding-top: 40px; */
  background-color: var(--primary-opacity1);
  /* box-shadow: 0 0 16px var(--shadow4); */
  text-align: left;
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
