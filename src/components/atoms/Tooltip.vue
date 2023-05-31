<template>
  <div
    ref="ptooltip"
    class="player-tooltip"
    :style="{
      left: x - 294 + 'px',
      top: !data.isTeams ? y - 290 + 'px' : y - 130 + 'px',
    }"
    v-click-outside="close"
    v-if="isShown"
  >
    <div class="tt__top tt__section">
      <div
        v-if="data.site_role"
        style="position: absolute; top: 6px; right: 6px;"
        :style="`color: ${$store.state.main.roleToColor[data.site_role]}`"
      >{{ $t('roles.' + data.site_role) }}</div>
      <div class="top-left">
        <Avatar
          :pic="data.avatar"
          :role="data.site_role"
          :size="68"
        />
        <div class="tt__level-badge">
          {{Math.floor(data.exp/1000)}}
        </div>
      </div>
      <div class="top-right" style="flex-grow: 1;">
        <div class="line1">
          <a
            :href="'/profiles/' + data.user_id"
            target="_blank"
            style="color: var(--primary-text); display: flex; align-items: center; justify-content: flex-start;"
          >
            {{data.nickname}}
          </a>

        </div>
        <div style="margin-bottom: 8px;">
          {{
            (data.member && data.member.name)
              ? data.member.name
              : data.teamName
                ? data.teamName
                : 'Нет команды'
          }}
        </div>

        <div class="acc-leag" v-if="data && data.profile && data.profile.mmr">
          {{$t('lol.leagues.' + data.profile.mmr.league)}} {{data.profile.mmr.division}}
        </div>
        <AccStatistics
          style="height: 18px; line-height: 20px; margin: 5px 0;"
          v-if="data && data.statistics"
          :win="data.statistics.win"
          :lose="data.statistics.lose"
        />
      </div>
    </div>
    <div class="tt__mid" style="padding-bottom: 0;" v-if="data && data.profile && data.profile.priority">
      Приоритет: {{data.profile.priority}}
    </div>
    <div class="tt__mid" style="padding-bottom: 0;" v-if="data && data.profile && data.profile.elo">
      MMR: {{data.profile.elo}}
    </div>
    <div class="tt__mid tt__section"
      v-if="(champions && champions.length) ||
      (data && data.profile && data.profile.roles)"
    >
      <RoleTosser
        v-if="data && data.profile && data.profile.roles"
        :rolesForYou="data.profile.roles"
        style="margin-bottom: 24px;"
      />
      <div v-if="champions && champions.length" class="acc-champs-label acc-label">
        Любимые чемпионы
      </div>
      <FiveChampions
        v-if="champions && champions.length"
        v-bind="{champions}"
      />
    </div>
    <div class="tt__bot tt__section" v-if="!data.isTeams && (can('tournament@kick') || can('user@ban'))">
      <button class="tt__btn blu" v-if="can('tournament@kick')" @click="kick" v-show="!inLoading">Кикнуть</button>
      <div v-if="inLoading">
        Загрузка...
      </div>
      <button
        class="tt__btn red"
        v-if="can('user@ban')"
        v-show="!inLoading"
        @click="$store.dispatch('main/setBanModal', {uid: data.user_id, nick: data.nickname})"
      >
        Забанить
      </button>
    </div>
    <div
      class="tt__underground tt__section"
      v-if="can('user@edit')"
    >
      <textarea
        style="background: var(--primary-opacity1); color: var(--primary-text); width: 250px; height: 80px; font-size: 12px; resize: none; border: 1px solid var(--primary-decor2);"
        v-model="note"
      />
      <button
        class="tt__btn"
        style="color: var(--primary-main); display: block; width: 150px; margin-top: 5px;"
        v-show="!inLoading"
        @click="saveNote"
      >
        Сохранить заметку
      </button>
      <div v-if="inLoading">
        Загрузка...
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import AccStatistics from '@/components/atoms/AccStatistics.vue'
import RoleTosser from '@/components/atoms/RoleTosser.vue'
import Avatar from '@/components/quarks/Avatar'
import FiveChampions from '@/components/atoms/FiveChampions'

export default {
  props: [
    'x', 'y', 'isShown',
    'data'
  ],
  components: {
    AccStatistics,
    RoleTosser,
    Avatar,
    FiveChampions
  },
  data() {
    return {
      inLoading: false,
      note: ''
    }
  },
  methods: {
    close($event) {
      if (!$event.target.closest('.ban-modal-wrapper') && !$event.target.closest('.tooltip-trigger')) {
        this.$emit('close')
      }
    },
    kick() {
      const tid = this.$store.state.tournament.tournament.id
      this.inLoading = true
      axiosInstance
        .post(`/api/tournaments/${tid}/events`, {
          event: 'kick',
          user_id: this.data.user_id
        })
        .then(resp => {
          if (resp.data && resp.data.success) {
            this.$notify({
              group: 'n',
              text: 'Успешно кикнут',
              duration: 2500
            })
            this.$store.dispatch('tournament/playerKicked', this.data.user_id)
            this.inLoading = false
            this.close()
          } else {
            this.inLoading = false
            this.$notify({
              group: 'n',
              text: 'Действие не удалось',
              duration: 2500
            })
          }
        })
        .catch(() => {
          this.$notify({
            group: 'n',
            text: 'Ошибка, кикнуть не удалось',
            duration: 2500
          })
          this.inLoading = false
        })
    },
    saveNote() {
      this.inLoading = true
      axiosInstance
        .put(`/api/profiles/${this.data.user_id}`, {
          update: 'note',
          note: this.note
        })
        .then(resp => {
          if (resp.data && resp.data.success) {
            this.$notify({
              group: 'n',
              text: 'Заметка сохранена',
              duration: 2500
            })
            // update the note on the player in store
            this.$store.dispatch('tournament/updateNote', { user_id: this.data.user_id, note: this.note })
            this.inLoading = false
            // this.close()
          } else {
            this.inLoading = false
            this.$notify({
              group: 'n',
              text: 'Действие не удалось',
              duration: 2500
            })
          }
        })
        .catch(() => {
          this.$notify({
            group: 'n',
            text: 'Ошибка, сохранение не удалось',
            duration: 2500
          })
          this.inLoading = false
        })
    }
  },
  watch: {
    data(newVal) {
      this.note = newVal.note
    }
  },
  computed: {
    champions () {
      return this.data.profile ? this.data.profile.champions || [] : null
    },

    roles() {
      return this.data.roles ? JSON.parse(this.data.roles) : null
    },
    joinedRoles() {
      if (this.data && this.data.roles) {
        let res = ''
        try {
          res = JSON.parse(this.data.roles).join(', ')
        } catch (error) {
          //
        }
        return res
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.player-tooltip {
  position: fixed;
  background-color: var(--primary-opacity1);
  border: 2px solid var(--primary-main);
  border-radius: 10px;
  color: #cbced1;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 13px;
  display: block;
  z-index: 11;
  top: 370px;
  left: 50px;
  padding: 30px 18px;
  padding-bottom: 22px;
  text-align: left;
  min-width: 290px;
  width: 290px;
  /* transform: translate(0,0); */
}
.player-prop {
  display: flex;
  justify-content: space-between;
  padding: 2px;
  width: 200px;
  text-align: left;
  align-items: center;
  margin-bottom: 1px;
  .p-title {
    margin-right: 5px;
    width: 100px;
  }
  &:nth-child(even) {
    color: rgb(156, 78, 60);
  }
}
.tt__section {
  border-bottom: 1px solid var(--primary-decor2);
}
.tt__top {
  display: flex;
  justify-content: space-between;
}
.top-left {
  margin-bottom: 16px;
  margin-right: 18px;
  
  position: relative;
}
.tt__level-badge {
  width: 24px;
  
  line-height: 20px;
  border: 2px solid #fff;
  background-color: #1f1f1f;
  border-radius: 8px;
  color: #fff;
  position: absolute;
  bottom: -9px;
  left: 22px;
  text-align: center;

}
.line1 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}
.acc-leag {
  font-weight: bold;
  margin-bottom: 5px;
}

.tt__mid {
  padding: 16px 0;
}

.twitch-link {
  fill: #cbced1;
  margin-bottom: -2px;
  &:hover {
    fill: var(--primary-main);
  }
}

.acc-champs {
  display: flex;
  justify-content: space-around;
}
.acc-champs-label {
  text-align: center;
}
.acc-label {
  color: #BDBDBD;
  font-weight: 500;
  margin: 6px 0;
}
.champ {
  border-radius: 100%;
  width: 28px; height: 28px;
  background: url('/img/685.png');
  background-size: 100%;
}
.tt__bot {
  padding-top: 22px;
  display: flex;
  border-bottom: 0;
  justify-content: space-between;
}
.tt__underground {
  margin-top: 12px;
  border-bottom: 0;
}
.tt__btn {
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--disabled-link-text);
  width: 96px;
  height: 35px;
  font-weight: bold;
  &:hover {
    box-shadow: 0 1px 6px var(--disabled-link-text);
  }
  &:active {
    box-shadow: 0 0px 2px var(--disabled-link-text);
  }
}
.blu {
  color: #008cff;
}
.red {
  color: #ee5567;
}
.acc-roles {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}
.role {
  border-radius: 100%;
  border: 2px solid #808191;
  width: 28px;
  height: 28px;
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: 50%;
  width: 24px; height: 24px;
}

.char-tooltip {
  position: absolute;
  padding: 8px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  bottom: 42px;
  opacity: 0;
  /* z-index: 0; */
  transition-duration: .2s;
  pointer-events: none;
}
.char-wrap:hover > .char-tooltip {
  opacity: 1;
}
</style>