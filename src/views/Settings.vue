<template>
  <div class="settings screen">
    <div class="settings__inner card">
      <h2 style="font-size: 22px; margin-bottom: 20px;">Пользовательские настройки</h2>
      <div class="fields-wrapper">
        <div style="text-align: left; margin-top: 30px; font-weight: 500;">ID: {{user_id}}</div>
        <h3 style="margin-top: 10px;">Изменение почты</h3>
        <div v-if="currentEmail" style="text-align: left; margin: 10px 0; font-size: 14px;">
          Текущая почта: <b style="user-select: text;">{{currentEmail}}</b>
          <div
            style="display: inline-block; margin-left: 6px; color: red;"
            title="Почта не подтверждена"
            v-if="!isEmailVerified"
          >✖</div>
          <div v-else title="Почта подтверждена" style="display: inline-block; margin-left: 6px;">
            ✔️
          </div>
          <button
            style="display: inline-block; margin-left: 12px; height: 32px; line-height: 32px;"
            type="button" class="soc-btn"
            @click="resendConfirmation"
            v-if="!isEmailVerified"
          >
            Переотправить подтверждение
          </button>
        </div>
        <div class="popup__field field">
          <div class="field__label">Почта</div>
          <div class="field__wrap">
            <input type="email" required autocomplete="off" v-model="email" class="field__input"/>
          </div>
          <div class="field__label errored" v-if="errors.email">{{errors.email}}</div>
        </div>
        <button
          class="soc-btn"
          type="button"
          :disabled="emailInLoading"
          @click="changeEmail"
        >
          Изменить
          <Loader v-if="emailInLoading" style="position: absolute; height: 40px; top: -10px; right: 400px;" />
        </button>

        <h3>Социальные сети</h3>
        <div class="soc-wrapper">
          <div
            v-for="(soc, sIdx) in socTypes" :key="soc"
            style="position: relative; width: fit-content;"
          >
            <a
              :href="`/api/auth/${soc}`"
              class="soc-link"
              style="text-align: center;"
              :style="{
                'background-color': socials.includes(soc) ? socColors[sIdx] : socColorsDisabled[sIdx],
              }"
              :disabled="socials.includes(soc)"
            >
              <!-- @click="inSocLoading = soc" -->
              <!-- <Loader v-if="inSocLoading === soc" style="position: absolute; height: 30px; left: -5px; top: calc(50% - 10px);" /> -->
              <img class="soc-icon" :src="`/img/icons/${soc}.svg`" :alt="$t(`login-modal.${soc}`)">
            </a>
            <button
              class="sidebar__remove"
              v-if="socials.includes(soc)"
              @click="confirmDeletion(soc)"
            >
              <svg class="icon icon-remove">
                <use xlink:href="img/icons.svg#icon-remove"></use>
              </svg>
            </button>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'Settings',
  components: {
    Loader
  },
  data: () => {
    return {
      email: '',
      socTypes: ['vkontakte', 'twitch', 'discord'],
      socColors: ['#4c75a3', '#6441a5', '#8A9CFE'],
      socColorsDisabled: ['gray', 'gray', 'gray'],
      oldPW: '',
      newPW: '',
      errors: {email: null, oldPW: null, newPW: null},
      pwInLoading: false,
      emailInLoading: false,
      // socials: []
      // inSocLoading: null
    }
  },
  methods: {
    resendConfirmation() {
      if (this.currentEmail) {
        axiosInstance
          .post('/api/auth/verify/resend', {email: this.currentEmail})
          .then(() => {
            this.$notify({
              group: 'n',
              text: 'Отправлено'
            })
          })
          .catch(() => {
            this.$notify({
              group: 'n',
              text: 'Ошибка',
              type: 'error'
            })
          })
      }
    },
    confirmDeletion(soc) {
      this.$store.dispatch('main/setYesNoModal', {
        val: true,
        text: 'Точно удалить соцсеть?',
        action: () => {
          axiosInstance.delete('/api/auth/' + soc).then(resp => {
            if (resp.data && resp.data.success) {
              this.$notify({
                group: 'n',
                text: 'Удалено',
                type: 'success'
              })
            } else {
              this.$notify({
                group: 'n',
                text: 'Неудача. ' + resp.data.code,
                type: 'error'
              })
            }
            this.$store.dispatch('main/setYesNoModal', { val: false})
            
          }).catch(err => {
            this.$notify({
              group: 'n',
              text: err,
              type: 'error'
            })
            this.$store.dispatch('main/setYesNoModal', { val: false})
          })
        }
      })
    },
    setValidationErrors(errs) {
      if (!errs) errs = {}
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
    resetMailForm() {
      this.email = ''
    },
    resetPWForm() {
      this.oldPW = ''
      this.newPW = ''
    },
    // before sending reset and try validate again?
    // resetValidationErrors() {
    //   this.errors = {email: null, password: null, confword: null}
    // },
    changeEmail() {
      if (!this.emailInLoading) {
        this.emailInLoading = true
        axiosInstance
          .put('/api/profile', {
            update: 'email',
            email: this.email
          })
          .then(response => {
            if (response.data && response.data.success === true) {
              this.$store.dispatch('auth/setMail', this.email)
              this.resetMailForm()
              this.$notify({
                group: 'n',
                text: 'Email изменен',
                duration: 2500,
              })
              

            } else {
              let errs = (response.data && response.data.errors) ? response.data.errors : []
              this.setValidationErrors(errs)
              this.$notify({
                group: 'n',
                text: 'Ошибочные данные',
                duration: 2500,
                type: 'error'
              })
            }
            this.emailInLoading = false
          })
          .catch(err => {
            this.setValidationErrors(err.response.data.errors)
            this.$notify({
              group: 'n',
              text: 'Ошибка валидации',
              duration: 2500,
              type: 'error'
            })
            this.emailInLoading = false
          })

      }
    },
    changePW() {
      if (!this.pwInLoading) {
        this.pwInLoading = true
        axiosInstance
          .put('/api/profile', {
            'update': 'password',
            'password': this.oldPW,
            'password-new': this.newPW
          })
          .then(response => {
            if (response.data && response.data.status === 'success') {
              this.resetPWForm()
              this.$notify({
                group: 'n',
                text: 'Пароль изменен',
                duration: 2500,
              })
              

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
            this.pwInLoading = false
          })
          .catch(err => {
            this.setValidationErrors(err.response.data.errors)
            this.$notify({
              group: 'n',
              text: 'Ошибка валидации',
              duration: 2500,
              type: 'error'
            })
            this.pwInLoading = false
          })

        
      }
    }
  },
  computed: {
    user_id() {
      if (this.$store.state.auth.user && this.$store.state.auth.user.id) {
        return this.$store.state.auth.user.id
      } else {
        return ''
      }
    },
    isEmailVerified() {
      if (this.$store.state.auth.user && this.$store.state.auth.user.email_verified_at) {
        return this.$store.state.auth.user.email_verified_at
      } else {
        return null
      }
    },
    currentEmail() {
      return this.$store.state.auth.user.email
    },
    socials() {
      if (this.$store.state.auth.user && this.$store.state.auth.user.socials) {
        return this.$store.state.auth.user.socials
      } else {
        return []
      }
      
    }
  },
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.$store.dispatch('accounts/profileRefillForSettings')
    })
  },
  // mounted() {
  //   axiosInstance
  //     .get('/api/profile?page=settings')
  //     .then(resp => {
  //       if (resp.data && resp.data) {
  //         this.$set(this, 'socials', resp.data.socials)
  //       }
  //     })
  //   this.email = this.currentEmail
  // }
}
</script>
<style lang="scss" scoped>
.settings {
  padding: 10px;
  max-width: 580px;
  h2 {
    text-align: center;
  }
  
  h3 {
    text-align: left;
    margin-top: 30px;
    margin-bottom: 10px;
  }
}
.fields-wrapper {
  /* max-width: 580px; */
  text-align: right;
}

.soc-wrapper {
  display: flex;
  justify-content: space-evenly;
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
  margin: 0;
  margin-bottom: 10px;
  border-radius: 6px;
  padding: 10px;
  width: 100px;
  color: #ddd;
  text-transform: uppercase;
  /* margin-right: 10px; */
  flex: 1;
  &:hover {
    filter: brightness(1.2);
  }
  &[disabled='disabled'] {
    cursor: auto;
    pointer-events: none;
  }
}
.soc-link:last-child {
  margin-right: 0;
}
.soc-btn {
  margin-left: 0;
  position: relative;
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 42px;
  width: fit-content;
  padding: 0 10px;
  &:hover {
    filter: brightness(1.2);
  }
}
.field__label {
  margin-bottom: 16px;
  &.errored {
    color: tomato;
    margin-top: 3px;
    font-size: 11px;
  }
}


.sidebar__remove {
  position: absolute;
  top: 10px;
  right: 5px;
  width: 24px;
  height: 24px;
  background: #ffffff;
  color: #000;
  fill: #000;
  border-radius: 50%;
  font-size: 0;
  box-shadow: 0 0 3px gray;
}
.sidebar__remove .icon {
  font-size: 10px;
  fill: #11142D;
  -webkit-transition: -webkit-transform .25s;
  transition: -webkit-transform .25s;
  -o-transition: transform .25s;
  transition: transform .25s;
  transition: transform .25s, -webkit-transform .25s;
}
.sidebar__remove:hover .icon {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>