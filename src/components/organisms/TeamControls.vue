<template>
  <div class="card" style="margin: 10px; margin-top: 20px;">
    <div style="color: #BDBDBD; font-weight: 500; font-size: 18px; margin-bottom: 16px;">Создание команды</div>
    <div style="display: flex;">
      <div class="acc-one" style="display: flex;">
        <div
          class="left"
          style="display: flex; flex-direction: column;"
          :style="!team ? 'padding-top: 8px' : ''"
        >
          <Avatar
            :size="132"
            :pic="currentAvatar || '0'"
            :mode="currentAvatar ? 'team' : ''"
            :class="(!team || inEditing) ? 'own-ava' : ''"
            :style="(!team || inEditing) ? 'margin-top: 8px' : ''"
            @click.native="avatarClick"
          />
          <div class="field__label errored" v-if="errors.tempAva">{{errors.tempAva}}</div>
        </div>
        <div v-if="$store.state.team.creationRequestLoading" style="display: flex; width: 100%; height: 100%; justify-content: center; align-items: center;">
          <Loader style="height: 56px;"/>
        </div>
        <div v-if="(!team || inEditing) && !$store.state.team.creationRequestLoading" class="right" style="margin-right: 12px;">
          <div class="popup__field field">
            <div class="field__label">Название команды</div>
            <div class="field__wrap">
              <input type="email" @input="errors.name = ''" required autocomplete="off" v-model="name" maxlength="20" class="field__input" :class="{errored: errors.name}"/>
            </div>
            <div class="field__label errored" v-if="errors.name">{{errors.name}}</div>
          </div>
          <div class="popup__field field">
            <div class="field__label">Короткое название</div>
            <div class="field__wrap">
              <input type="email" @input="errors.tag = ''" required autocomplete="off" v-model="tag" maxlength="5" class="field__input" :class="{errored: errors.tag}"/>
            </div>
            <div class="field__label errored" v-if="errors.tag">{{errors.tag}}</div>
          </div>
          <button
            v-if="!inEditing"
            class="action-btn"
            style="background-color: var(--primary-main); width: 100%; margin-top: 12px;"
            v-text="'Создать'"
            @click="requestNewTeam"
          />
          <template v-if="inEditing">
            <button
              class="action-btn"
              style="background-color: var(--primary-main); width: 100%; margin-top: 12px;"
              v-text="'Подтвердить'"
              @click="requestTeamUpdate"
            />
            <button
              class="action-btn"
              style="background-color: var(--primary-main); width: 100%; margin-top: 12px;"
              v-text="'Отмена'"
              @click="inEditing = false"
            />
          </template>
        </div>
        <div v-else-if="!$store.state.team.creationRequestLoading" class="right" style="margin-right: 12px;">
          <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">Название команды</div>
            <div class="field__label">{{ team.name }}</div>
          </div>
          <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">Короткое название</div>
            <div class="field__label">{{ team.tag }}</div>
          </div>
          <!-- <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">ММР</div>
            <div class="field__label">{{ team.mmr }}</div>
          </div> -->
          <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">Статус</div>
            <div class="field__label">{{ team.status }}</div>
          </div>
          <!-- <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">Код</div>
            <div class="field__label" style="word-break: break-all;">{{ team.code }}</div>
          </div> -->
          <div style="display: flex;">
            <div class="field__label" style="margin-right: 10px;">Создана</div>
            <div class="field__label">{{ new Date(team.created_at).toLocaleDateString() }}</div>
          </div>
          <button
            class="action-btn"
            v-if="user && user.team && user.team.member === 'owner'"
            style="background-color: var(--primary-main); width: 100%; margin-top: 12px;"
            v-text="'Редактировать'"
            @click="switchToEdit"
          />
          <button
            v-if="user && user.team && (user.team.member === 'owner')"
            class="action-btn"
            style="background-color: var(--primary-main); width: 100%; margin-top: 12px;"
            v-text="'Удалить'"
            @click="deleteTeam"
          />
        </div>
        
      </div>
      <div class="acc-two">
        <div style="display: flex;" v-if="team && team.members">
          <!-- <div v-if="!team || !team.members || !team.members.length">
            В команде нет игроков, возможно ли это?
          </div> -->
          <!-- :pic="member.avatar" -->
          <div
            v-for="(member, midx) in team.members"
            :key="midx"
            class="member-link"
            @click="memberlinkClicked = (memberlinkClicked === midx ? null : midx)"
          >
          <!-- 
            info-link
            kick
            switch host
           -->
          <!-- :to="'/profiles/' + member.id" -->
            <div
              v-show="memberlinkClicked === midx"
              style="position: absolute; top: calc(100% + 8px);"
            >
              <button
                class="member-control-btn"
                @click="$router.push('/profiles/' + member.id)"
              >
                инфо
              </button>
              <button
                class="member-control-btn"
                @click="kickPlayer(member.id)"
              >
                кик
              </button>
              <!--<button
                class="member-control-btn"
                @click="switchToPlayer(member.id)"
              >
                дать хост
              </button> -->
            </div>
            <Avatar
              :pic="member.avatar"
              :size="34"
              :role="member.role"
              style="margin: 8px; cursor: pointer;"
              class="member-link-avatar"
            />
            <pre
              class="member-tooltip"
              v-html="member.nickname"
            />
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: auto;">
          <button
            class="action-btn"
            style="background-color: var(--primary-main); width: calc(100% - 160px); "
            @click="teamLinkCopy"
          >
            Пригласить игроков
          </button>
          <button
            v-if="user && user.team && (user.team.member === 'owner')"
            class="action-btn"
            style="background-color: var(--primary-main); width: 60px;"
            @click="teamLinkRefresh"
          >
            Перегенерация кода
          </button>
          <button
            class="action-btn"
            style="background-color: var(--primary-main); width: 80px;"
            @click="leaveTeam"
          >
            Выйти
          </button>
        </div>
      </div>
      <div class="acc-three">
        <!-- <div class="line-1" style="display: flex; justify-content: space-around;">
          <div class="ubadge">20 <span class="ubadge-text">побед</span></div>
          <div class="ubadge">20 <span class="ubadge-text">пораж</span></div>
        </div>
        <div class="line-2">
          <div class="ubadge" style="margin: 0 auto;">20 <span class="ubadge-text">рейтинг</span></div>
        </div> -->
      </div>
    </div>
  </div>
</template>


<script>
// import RoleTosser from '@/components/atoms/RoleTosser.vue'
// import AccStatistics from '@/components/atoms/AccStatistics.vue'
import Avatar from '@/components/quarks/Avatar'
import Loader from '@/components/atoms/Loader'
// import axiosInstance from '@/store/axiosInstance.js'

export default {
  name: 'TeamControls',
  components: {
    // RoleTosser,
    // AccStatistics,
    Avatar,
    Loader
  },
  data: () => {
    return {
      inEditing: false,
      name: '',
      tag: '',
      errors: {
        name: '',
        tag: '',
        tempAva: ''
      },
      memberlinkClicked: null
    }
  },
  props: ['own', 'user', 'profile', 'statistics', 'activeAcc', 'nickname', 'roles'],
  computed: {
    currentAvatar () {
      // return this.$store.state.main.dpoint === 'teams'
      //   ? 'teamicon'
      //   : this.$store.state.main.dpoint === 'champions'
      //     ? 'champion'
      //     : 'profileicon'
          // teamicon
      return this.tempAva ? this.tempAva.path : (this.team ? this.team.avatar : null)
    },
    team () {
      return this.$store.getters['team/team']
    },
    tempAva () {
      return this.$store.getters['team/tempAva']
    },
    teamBackendValidator () {
      return this.$store.state.team.teamBackendValidator
    }
  },
  watch: {
    teamBackendValidator (newVal) {
      if (newVal.name) {
        if (newVal.name[0] === 'unique') {
          this.errors.name = 'Существует в базе'
        } else {
          this.errors.name = newVal.name
        }
      }
      if (newVal.tag) {
        if (newVal.tag[0] === 'unique') {
          this.errors.tag = 'Существует в базе'
        } else {
          this.errors.tag = newVal.tag
        }
      }
    }
  },
  methods: {
    switchToEdit () {
      this.name = this.team.name
      this.tag = this.team.tag
      this.inEditing = true

    },
    switchToPlayer (playerId) {
      this.$store.dispatch('team/switchToPlayer', {teamId: this.team.id, playerId})
    },
    kickPlayer (playerId) {
      this.$store.dispatch('team/kickPlayer', {teamId: this.team.id, playerId})
    },
    leaveTeam () {
      this.$store.dispatch('team/leaveTeam', this.team.id)
    },
    teamLinkRefresh () {
      this.$store.dispatch('team/refreshTeamCode', this.team.id)
    },
    teamLinkCopy() {
      navigator.clipboard.writeText(window.location.origin + '/?team_invite=' + this.team.code).then(() => {
        /* clipboard successfully set */
        this.$notify({
          group: 'n',
          text: 'Ссылка-инвайт скопирована',
          duration: 1500,
        })
      }, () => {
        /* clipboard write failed */
        this.$notify({
          group: 'n',
          text: 'Провал',
          duration: 1500,
        })
      });
    },
    avatarClick () {
      if (!this.team || this.inEditing) {
        this.errors.tempAva = ''
        this.$store.dispatch('main/setTeamAvatarModal', true)
      }
    },
    validate () {
      if (this.name.length < 3) {
        this.errors.name = '3+ символов'
        return false
      }
      if (this.tag.length < 3) {
        this.errors.tag = '3+ символов'
        return false
      }
      if (!this.tempAva && !this.inEditing) {
        this.errors.tempAva = 'Выбери аватар'
        return false
      }
      return true
    },
    requestNewTeam () {
      if (!this.validate()) {
        return false
      }
      const opts = {
        tag: this.tag,
        name: this.name,
        ...this.tempAva
      }
      this.$store.dispatch('team/requestNewTeam', opts)
    },
    deleteTeam () {
      this.$store.dispatch('team/deleteTeam', this.team.id)
    },
    requestTeamUpdate () {
      if (!this.validate()) {
        return false
      }
      const opts = {
        tag: this.tag,
        name: this.name,
        ...this.tempAva
      }
      // console.log('wergrwg', opts)
      this.$store.dispatch('team/requestUpdateTeam', { opts, id: this.team.id })
    }
  },
}
</script>
<style lang="scss" scoped>
.profile {
  padding: 10px;
  color: #BDBDBD;
}

.details-wrapper {
  display: flex;
  padding: 16px;
}
.acc-one {
  width: 40%;
}
.acc-two {
  min-width: 200px;
  width: 30%;
  border-left: 1px solid var(--primary-decor2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
}
.acc-one__left {
  width: 40%;
  display: flex;
}
.acc-one__right {
  text-align: left;
  width: 60%;
  padding-right: 10px;
  padding-left: 12px;
}
.acc-avatar-wrap {
  border-radius: 100%;
  padding: 5px;
  padding-bottom: 1px;
  margin: auto;
  background: linear-gradient(110deg, #6BA4D1, #7D80D1)
}
.acc-avatar {
  border-radius: 100%;
  border: 3px solid var(--primary-opacity1);
}
.acc-roles {
  display: flex;
  justify-content: space-around;
}
.acc-champs {
  display: flex;
  justify-content: space-around;
}
.acc-refill {
  display: flex;
}

.acc-name {
  /* user-select: all; */
  color: var(--primary-text);
  font-size: 20px;
  line-height: 36px;
  font-weight: bold;
  cursor: pointer;
  overflow: hidden;
  /* margin-left: -25px; */
}
.acc-pos {
  color: #BDBDBD;
  margin: 5px 0;
}
.acc-leag {
  margin: 0;
  height: 26px;
  line-height: 26px;
  color: #BDBDBD;
  font-weight: bold;
}
.acc-exp {
  display: flex;
  justify-content: space-between;
  color: #BDBDBD;
  font-weight: 500;
  margin: 10px 0;
}
.acc-exp__bar {
  width: 100%;
  height: 6px;
  background-color: #BDBDBD;
  border-radius: 3px;
}
.acc-label {
  color: #BDBDBD;
  font-weight: 500;
  margin: 6px 0;
}
.champ {
  border-radius: 100%;
  width: 32px; height: 32px;
  background: url('/img/685.png');
  background-size: 100%;
}
.acc-two .acc-label {
  margin-top: 10px;
  margin-bottom: 14px;
}

.own-ava {
  cursor: pointer;
}
.own-ava:hover {
  border-style: dashed;
}

.acc-one {
  width: 38%;
}
.acc-two {
  min-width: 250px;
  width: 35%;
  border-left: 1px solid var(--primary-decor2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
}
.acc-three {
  width: 27%;
  border-left: 1px solid var(--primary-decor2);
}
.left {
  margin-right: 40px;
}
.team-ava {
  border-radius: 100%;
  border: 3px solid #e0e0e0;
  width: 124px;
  height: 124px;
  cursor: pointer;
  &.small {
    
    border: 2px solid #e0e0e0;
  }
  &.empty {
    &:after {
      border-left: 3px solid #e0e0e0;
      content: '';
      height: 50px;
      display: block;
      position: relative;
      top: calc(25%);
      left: calc(50% - 1.5px);
    }
    &.small:after {
      height: 12px;
      border-left: 2px solid #e0e0e0;
      top: calc(25% - 2px);
      left: calc(50% - 1px);
    }
    &:before {
      border-top: 3px solid #e0e0e0;
      content: '';
      width: 50px;
      display: block;
      position: relative;
      top: calc(50% - 1.5px);
      left: calc(50% - 25px);
    }
    &.small:before {
      width: 12px;
      border-top: 2px solid #e0e0e0;
      top: calc(50% - 1px);
      left: calc(50% - 6px);
    }
  }
}
.ubadge {
  padding: 10px;
  border: 1px solid #eee;
  color: var(--secondary-main);
  font-weight: 900;
  border-radius: 0.5rem;
  max-width: 80px;
  margin: 12px;
  font-size: 20px;
  line-height: 22px;
}
.ubadge-text {
  font-size: 14px;
  font-weight: normal;
  color: #b2b3bd;
}
.field__input {
  padding: 0 10px;
  box-shadow: none !important;
}
.field__input.errored {
  box-shadow: 0 0 0 1px red !important;
}

.errored {
  color: red;
  margin-top: 4px;
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
.member-link-avatar:hover ~ .member-tooltip {
  opacity: 1;
}

.member-control-btn {
  display: block;
  border-radius: 12px;
  width: 80px;
  background: var(--primary-main);
  padding: 5px;
  color: #fff;
  margin-bottom: 4px;
}
</style>