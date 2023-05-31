<template>
  <div>
    <div
      v-show="isShown"
      class="modal-blur"
      :class="{
        'hide-blur': !isShown
      }"
      @click="$store.dispatch('main/setTeamInviteModal', { val: false })"
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
        @click="$store.dispatch('main/setTeamInviteModal', { val: false })"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <!-- <Loader v-if="!inviteDetails" style="height: 30px; margin: 30px;" /> -->
      <div v-if="!inviteDetails" class="small-loader" style="margin: 0 auto; width: 56px; height: 56px;"/>
      <div v-else-if="!showError" style="margin: 30px auto 0;">
        <h4 style="margin-bottom: 12px;">
          Вас приглашают в команду {{ inviteDetails.name }}! Желаете вступить?
        </h4>
        <!-- <div class="details-line">
          <div style="color: var(--primary-text2);">id</div>
          <div>{{inviteDetails.id}}</div>
        </div> -->
        <div class="details-line">
          <div style="color: var(--primary-text2);">avatar</div>
          <div>
            <Avatar
              :pic="inviteDetails.avatar || '0'"
              :mode="inviteDetails.avatar ? 'team' : ''"
              :size="30"
            />
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">Название</div>
          <div>
            {{inviteDetails.name}}
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">Короткое название</div>
          <div>
            {{inviteDetails.tag}}
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">Игра</div>
          <div>
            {{inviteDetails.game}}
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">mmr</div>
          <div>
            {{inviteDetails.mmr}}
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">Статус</div>
          <div>
            <div class="green-chip">
              {{inviteDetails.status}}
            </div>
          </div>
        </div>
        <div class="details-line">
          <div style="color: var(--primary-text2);">Создана</div>
          <div>
            {{new Date(inviteDetails.created_at).toLocaleString().substring(0,10).replace(',', '')}}
          </div>
        </div>
        <div>
          <div style="color: var(--primary-text2);">Игроки</div>
          <div style="display: flex;" v-if="inviteDetails.members">
            <!-- <div v-if="!team || !team.members || !team.members.length">
              В команде нет игроков, возможно ли это?
            </div> -->
            <!-- :pic="member.avatar" -->
            <div
              v-for="(member, midx) in inviteDetails.members"
              :key="midx"
              :to="'/profiles/' + member.id"
              class="member-link"
              style="display: flex; align-items: center; justify-content: space-between;"
            >
              <Avatar
                :pic="member.avatar"
                :size="34"
                :role="member.role"
                style="margin: 8px;"
              />
              <pre
                class="member-tooltip"
                v-html="member.nickname"
              />
            </div>
          </div>
        </div>

        <div v-if="!submitting" style="display: flex; justify-content: space-around; margin-top: 20px;">
          <button
            class="soc-btn"
            @click="acceptInvite"
          >
            Принять
          </button>
          <button
            class="soc-btn"
            @click="$store.dispatch('main/setTeamInviteModal', { val: false })"
          >
            Отклонить
          </button>
        </div>
      </div>
      <div v-else>
        <h4 style="margin: 16px 0 22px;">{{showError}}</h4>
        <button
          class="soc-btn"
          @click="$store.dispatch('main/setTeamInviteModal', { val: false })"
        >
          Ок
        </button>
      </div>
      
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
// import Loader from '@/components/atoms/Loader.vue'
import Avatar from '@/components/quarks/Avatar'

export default {
  name: 'TeamInviteModal',
  components: {
    // Loader,
    Avatar
  },
  data: () => {
    return {
      inviteDetails: null,
      submitting: false,
      codeProvided: null,
      showError: false
    }
  },
  activated () {
    if (this.$store.state.main.teamInviteModalCode) {
      this.codeProvided = this.$store.state.main.teamInviteModalCode
      this.$store.dispatch("main/setTeamInviteModal", {val: true, code: null});
    }
  },
  mounted() {
    if (this.codeProvided) {
      this.fetchTeamData()
    } else {
      this.codeProvided = this.$store.state.main.teamInviteModalCode
      this.$store.dispatch("main/setTeamInviteModal", {val: this.codeProvided ? true : false, code: null});
      if (this.codeProvided) {
        this.fetchTeamData()
      }
      // this.$store.dispatch("main/setTeamInviteModal", {val: false, code: null});
    }
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  methods: {
    acceptInvite () {
      // https://dev-rx78-3.ff15.ru/api/teams?page=invite&code=d6f7b34b-0928-420c-a111-d3dbe9d0e65b&accept=true
      this.submitting = true
      axiosInstance
        .get("/api/teams?page=invite&accept=true&code=" + this.codeProvided)
        .then(res => {
          this.submitting = false
          this.$store.dispatch('main/setTeamInviteModal', { val: false })
          if (res && res.data) {
            if (res.data.success || res.data.id) {
              this.$router.push('/profile')
              this.$notify({
                group: 'n',
                text: 'Вступление в команду - ок.',
                duration: 3500,
              })
            } else if (res.data.code === 'tournament.no_account' || res.data.code === 'tournament.no_account_active') {
              this.$notify({
                group: 'n',
                text: 'Аккаунт не заполнен',
                duration: 3500,
                type: 'error'
              })
              this.$store.commit('auth/setStartFrom3', false, { root: true })
              this.$store.commit('main/setConnectModal', true, { root: true })
            } else if (res.data.code === 'tournament.no_profile') {
              this.$notify({
                group: 'n',
                text: 'Профиль не заполнен',
                duration: 3500,
                type: 'error'
              })
              this.$store.commit('auth/setStep', 3, { root: true })
              this.$store.commit('auth/setGeneratedPic', -1, { root: true })
              this.$store.commit('auth/setConnectStatus', 'Выберите лигу, приоритеты ролей и нажмите "Сохранить"', { root: true })
              this.$store.commit('auth/setLeague', res.data.league || {}, { root: true })
              this.$store.commit('auth/setStartFrom3', true, { root: true })
              this.$store.commit('main/setConnectModal', true, { root: true })
            } else {
              this.$notify({
                group: 'n',
                text: this.$t('errors.' + res.data.code),
                duration: 3500,
                type: 'error'
              })
            }
          }
          // тут могут быть ошибки?
        })
        .catch(() => {
          this.submitting = false
          this.$store.dispatch('main/setTeamInviteModal', { val: false })
        })
      
    },
    fetchTeamData () {
      this.submitting = true
      axiosInstance
        .get("/api/teams?page=invite&code=" + this.codeProvided)
        .then( res => {
          console.log('cpfetch', res)
          // if (res.data.success === false) {
          //   if (res.data && res.data.code) {
          //     this.$notify({
          //       group: 'n',
          //       text: this.$t('errors.' + res.data.code),
          //       duration: 3500,
          //       type: 'error'
          //     })
          //   }
          //   this.$store.dispatch('main/setTeamInviteModal', { val: false })
          // } else {
          //   this.inviteDetails = res.data
          // }
          if (res.data.success === false) {
            this.showError = this.$t('errors.' + res.data.code)
          }
          this.inviteDetails = res.data
          this.submitting = false
        })
    },
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/setTeamInviteModal', { val: false })
      }
    },
  },
  computed: {
    // codeProvided () {
    //   return this.$store.state.main.teamInviteModalCode
    // },
    isShown () {
      return this.$store.state.main.showTeamInviteModal
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
  top: calc(50vh - 320px);
  left: calc(50vw - 200px);
  width: 420px;
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
.green-chip {
  border-radius: 12px;
  padding: 4px;
  background: green;
  color: #fff;
}
.soc-btn {
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  width: 120px;
  /* text-transform: uppercase; */
  font-weight: 600;
  height: 46px;
  &:hover {
    filter: brightness(1.2);
  }
}
.details-line {
  height: 36px;
  display: flex;
  justify-content: space-between;
}

.member-tooltip {
  position: absolute;
  padding: 8px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  bottom: 50px;
  opacity: 0;
  /* z-index: 0; */
  transition-duration: .2s;
  pointer-events: none;
}
.member-link {
  display: inline-block; position: relative;
}
.member-link:hover > .member-tooltip {
  opacity: 1;
}
</style>
