<template>
  <div>
    <div
      v-show="showLoginModal"
      class="modal-blur"
      :class="{
        'hide-blur': !showLoginModal
      }"
      :style="{
        background: $route.path === '/' ? '' : '#0b0b0b'
      }"
      @click="$store.dispatch('main/setLoginModal', false)"
    />
    <div
      class="login-modal"
      :style="{
        'transform': showLoginModal ? 'scale(1)' : 'scale(0)',
        'transition': '.25s'
      }"
    >
      <button
        class="close-btn"
        @click="$store.dispatch('main/setLoginModal', false)"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <h2 style="margin-bottom: 20px">Вход</h2>

      <div class="mail-entrance">
        <div class="mail-login-wrapper">
          <a
            class="soc-link soc-link--enter"
            :href="`/api/auth/rso/`"
          >
            <div style="display: flex; align-items: center; justify-content: center">
              <img src="/img/icons/riot_icon.svg" class="soc-icon" style="margin-right: 10px">
              <span>Вход через Riot Games</span>
            </div>
          </a>
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin: 10px 0;">
            <router-link class="recall-link" to="/privacy" @click.native="$store.dispatch('main/setLoginModal', false)">
              Privacy
            </router-link>
            <router-link class="recall-link" to="/agreement" @click.native="$store.dispatch('main/setLoginModal', false)">
              Agreement
            </router-link>
          </div>
        </div>
      </div>
      <div class="field__label" style="margin: 16px 0;">{{$t('login-modal.continue-with')}}</div>
      <div class="soc-wrapper">
        <a
          v-for="(soc, sIdx) in socTypes" :key="soc"
          :href="`/api/auth/${soc}${ref}`"
          class="soc-link"
          :style="{
            'background-color': socColors[sIdx]
          }"
          @click="inSocLoading = soc"
        >
          <!-- {{$t(`login-modal.${soc}`)}} -->
          <Loader v-if="inSocLoading === soc" style="position: absolute; height: 30px; left: -5px; top: calc(50% - 10px);" />
          <img class="soc-icon" :src="`/img/icons/${soc}.svg`" :alt="$t(`login-modal.${soc}`)">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'LoginModal',
  components: {
    Loader
  },
  data: () => {
    return {
      socTypes: ['vkontakte', 'twitch', 'discord'],
      socColors: ['#4c75a3', '#6441a5', '#8A9CFE'],
      emailTab: 0,
      email: '',
      password: '',
      confword: '',
      errors: {email: null, password: null, confword: null},
      inLoading: false,
      inSocLoading: null
    }
  },
  mounted() {
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    tabSwitch(n) {
      this.emailTab = n
      this.email = ''
      this.password = ''
      this.confword = ''
      this.resetValidationErrors()
    },
    resetValidationErrors() {
      this.errors = {email: null, password: null, confword: null}
    },
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setLoginModal', false)
      }
    },
    isResetFrontValid() {
      let result = true
      this.resetValidationErrors()

      if (this.email.length === 0) {
        this.errors.email = 'Email обязателен'
        result = false
      } else if (!this.email.includes('@')) {
        this.errors.email = 'Требуется валидный Email'
        result = false
      }

      return result
    },
    isLoginFrontValid() {
      let result = true
      this.resetValidationErrors()

      if (this.email.length === 0) {
        this.errors.email = 'Email обязателен'
        result = false
      } else if (!this.email.includes('@')) {
        this.errors.email = 'Требуется валидный Email'
        result = false
      }

      if (!this.password) {
        this.errors.password = 'Пароль введи'
        result = false
      }

      return result
    },
    isRegisterFrontValid() {
      let result = true
      this.resetValidationErrors()
      
      
      if (this.email.length === 0) {
        this.errors.email = 'Email обязателен'
        result = false
      } else if (this.email.length > 50) {
        this.errors.email = 'Макс длина email 50 символов'
        result = false
      }
      
      if (this.password.length < 6 || this.password.length > 30) {
        this.errors.password = 'Длина пароля 6-30 символов'
        result = false
      } else if (this.password !== this.confword) {
        this.errors.password = 'Пароль не совпадает с полем подтверждения'
        result = false
      }

      return result
    },
    setValidationErrors(errs) {
      let dic = {
        'min:5': 'Мин длина 5',
        'min:6': 'Мин длина 6',
        'max:20': 'Макс длина 20',
        'max:30': 'Макс длина 30',
        'required': 'Обязательное поле',
        'email': 'Адрес должен быть валидным',
        'unique': 'Уже есть в базе'
      }
      Object.keys(errs).forEach(key => {
        this.errors[key] = dic[errs[key]]
      })
    },

    async requestLogin() {
      if (this.isLoginFrontValid()) {
        this.inLoading = true
        axiosInstance
          .post('/api/auth/login')
          .then(async res => {
            this.$notify({
              group: 'n',
              text: 'Вход выполнен',
              duration: 2500
            })
            this.inLoading = false
            this.tabSwitch(0)
            this.$store.dispatch('main/setLoginModal', false)
            await this.$store.dispatch('auth/setUser', res.data.user)
            // this.$store.dispatch('accounts/requestAccs') - is happening on auth/setUser
            this.$nextTick(() => {
              if (this.$router.history.current.path === '/') {
                this.$router.replace('/tournaments')
              }
            })
          })
          .catch(function (err) {
            console.log(err)
            this.$notify({
              group: 'n',
              text: 'Неправильные данные',
              duration: 2500,
              type: 'error'
            })
            this.inLoading = false
          }.bind(this))
      } else {
        this.$notify({
          group: 'n',
          text: 'Введите корректные данные',
          duration: 2500,
          type: 'error'
        })
        this.inLoading = false
      }
    },
    requestReg() {
      if (this.isRegisterFrontValid()) {
        this.inLoading = true
        axiosInstance
          .post('/api/auth/register' + this.ref, {
            email: this.email,
            password: this.password
          })
          .then(function (response) {
            if (response.data && response.data.status === 'success') {
              this.$notify({
                group: 'n',
                text: 'Успешная регистрация',
                duration: 2500,
              })
              this.tabSwitch(0)
            } else {
              let errs = (response.data) ? response.data.errors : []
              this.setValidationErrors(errs)
              this.$notify({
                group: 'n',
                text: 'Ошибочные данные',
                duration: 2500,
                type: 'error'
              })
            }
            //chancey45@pmarketst.com
            this.inLoading = false
            
            // this.$store.dispatch('main/setLoginModal', false)
          }.bind(this))
          .catch(function (error) {
            this.setValidationErrors(error.response.data.errors)
            this.$notify({
              group: 'n',
              text: 'Ошибочные данные',
              duration: 2500,
              type: 'error'
            })
            this.inLoading = false
          }.bind(this))
      } else {
        this.$notify({
          group: 'n',
          text: 'Введите корректные данные',
          duration: 2500,
          type: 'error'
        })
        this.inLoading = false
      }
    },
    requestReset() {
      if (this.isResetFrontValid()) {
        this.inLoading = true
        axiosInstance
          .post('/api/auth/password/reset' + this.ref, {
            email: this.email
          })
          .then(function () {
            this.$notify({
              group: 'n',
              text: 'Ждите письмо с инструкциями на почту.',
              duration: 2500,
            })
            this.inLoading = false
            this.tabSwitch(0)
            this.$store.dispatch('main/setLoginModal', false)
          }.bind(this))
          .catch(function (error) {
            this.setValidationErrors(error.response.data.errors)
            this.$notify({
              group: 'n',
              text: 'Не правильный email',
              duration: 2500,
              type: 'error'
            })
            this.inLoading = false
          }.bind(this))
      } else {
        this.$notify({
          group: 'n',
          text: 'Не правильный email',
          duration: 2500,
          type: 'error'
        })
        this.inLoading = false
      }
    },

    submitModal() {
      if (this.emailTab === 1) {
        this.requestReg()
      } else if (this.emailTab === 0) {
        this.requestLogin()
      } else {
        //reset pw
        this.requestReset()
      }
    }
  },
  computed: {
    showLoginModal() {
      return this.$store.state.main.showLoginModal
    },
    ref() {
      let r = sessionStorage.getItem('ref')
      // let r = this.$store.state.main.ref
      if (r && r.length > 0) {
        return '?ref=' + r
      } else return ''
    }
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
.login-modal {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 300px);
  left: calc(50vw - 0px);
  width: 420px;
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
  color:var(--primary-text);
  font-weight: 600;
  top: 16px; right: 16px;
  border-radius: 100%;
  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}
.soc-wrapper {
  display: flex;
  justify-content: center;
}
.soc-icon {
  /* margin-top: 5px; */
  height: 20px;
  stroke: var(--primary-text);
}
.soc-link {
  position: relative;
  display: block;
  background-color: var(--secondary-main);
  margin: 0px 0;
  border-radius: 6px;
  padding: 10px;
  height: 40px;
  color: #ddd;
  font-size: 14px;
  text-transform: uppercase;
  margin-right: 10px;
  flex: 1;
  &:hover {
    filter: brightness(1.2);
  }

  &--enter {
    display: flex;
    justify-content: center;
    background-color: var(--primary-main);
    height: 50px;
  }
}
.soc-link:last-child {
  margin-right: 0;
}
.soc-btn {
  position: relative;
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 56px;
  &:hover {
    filter: brightness(1.2);
  }
}
.tabs {
  text-align: left;
  margin: 20px 0;
}
.tab {
  padding: 7px 18px;
  border-radius: 12px;
  /* font-weight: 600; */
  color: var(--primary-text2);
  transition: all 0.25s;
  margin-right: 5px;
}
.tab.active {
  color: var(--primary-main);
}
.field__input {
  height: 56px;
  padding: 0 22px;
}
.field__label {
  margin-bottom: 16px;
  &.errored {
    color: tomato;
    margin-top: 3px;
    font-size: 11px;
  }
}
.popup__field.field {
  margin-bottom: 20px;
}

.recall-link {
  color: var(--secondary-main);
  &:hover {
    color: var(--primary-main);
  }
}
</style>