<template>
  <div class="ban-modal-wrapper">
    <div
      v-show="isShown"
      class="modal-blur"
      :class="{
        'hide-blur': !isShown
      }"
      @click="$store.dispatch('main/setBanModal', false)"
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
        @click="$store.dispatch('main/setBanModal', false)"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <div style="margin: 20px auto; margin-top: 30px;">
        Забанить <b>{{bmValues.nick}}</b>
      </div>
      <div class="ban-inner">
        <div class="popup__field field">
          <div class="field__label">Бан истекает</div>
          <div class="field__wrap" style="text-align: left;">
            <DatePicker      
              type="datetime"
              v-model="date"
              :default-value="new Date()"
              style="margin: -3px;"
            />
          </div>
        </div>
        <div class="popup__field field">
          <div class="field__label">Причина бана</div>
          <div class="field__wrap">
            <textarea style="height: 80px; resize: none; padding: 5px;" v-model="reason" class="field__input"/>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <button
          class="soc-btn"
          @click="send"
          v-if="!inLoading"
        >
          Забанить
        </button>
        <div v-else style="height: 46px; line-height: 46px; padding:0 10px;">
          Загрузка...
        </div>
        <button
          class="soc-btn"
          @click="$store.dispatch('main/setBanModal', false)"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
// import Loader from '@/components/atoms/Loader.vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  name: 'BanModal',
  components: {
    DatePicker
  },
  data: () => {
    return {
      reason: '',
      date: null,
      inLoading: false
    }
  },
  mounted() {
    document.addEventListener("keydown", this.hotKeysModal)
    // this.date = new Date()
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    send() {
      this.inLoading = true
      axiosInstance
        .put('/api/profiles/' + this.bmValues.uid, {
          update: 'ban',
          reason: this.reason,
          end: this.date
        })
        .then(resp => {
          if (resp.data && resp.data.success) {
            this.$notify({
              group: 'n',
              text: 'Успешный бан',
              duration: 2500
            })
            this.$store.dispatch('main/setBanModal', false)
          } else if (resp.data && resp.data.code){
            this.$notify({
              group: 'n',
              text: 'Бан не удался. ' + resp.data.code,
              duration: 2500
            })
          } else {
            this.$notify({
              group: 'n',
              text: 'Неизвестная ошибка',
              duration: 2500
            })
          }
          this.inLoading = false
        })
        .catch(err => {
          this.$notify({
            group: 'n',
            text: 'Ошибке' + err,
            duration: 2500
          })
          this.inLoading = false
        })
    },
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setBanModal', false)
      }
    },
    resetFields() {
      this.reason = ''
      let d = new Date()
      d.setDate(d.getDate() + 1)
      this.date = d //tomorrow
      this.inLoading = false
    }
  },
  computed: {
    isShown() {
      return this.$store.state.main.showBanModal !== false
    },
    bmValues() {
      return this.$store.state.main.showBanModal
    }
    
  },
  watch: {
    'isShown': 'resetFields'
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
.ban-modal {
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
