<template>
  <div
    ref="ptooltip"
    class="player-tooltip"
    :style="{
      left: x - 294 + 'px',
      top: y - 290 + 'px',
    }"
    v-click-outside="close"
    v-if="isShown"
  >
    <div class="tt__top tt__section">
      <div class="top-left">
        <Avatar
          :pic="data.avatar"
          mode="team"
          :role="data.site_role"
          :size="68"
        />
      </div>
      <div class="top-right" style="flex-grow: 1;">
        <div class="line1">
          {{data.name}}
        </div>
        <div class="line2" style="color: #808191;">
          {{data.tag}}
        </div>
      </div>
    </div>
    <!-- <div class="tt__mid tt__section">
      <div class="acc-leag" v-if="data && data.profile && data.profile.mmr">
        {{$t('lol.leagues.' + data.profile.mmr.league)}} {{data.profile.mmr.division}}
      </div>
    </div> -->
    <div class="tt__mid tt__section">
      <!-- {{data}}xx -->
      <div style="display: flex; flex-wrap: wrap;" v-if="data && data.members">
        <!-- <div v-if="!team || !team.members || !team.members.length">
          В команде нет игроков, возможно ли это?
        </div> -->
        <!-- :pic="member.avatar" -->
        
        <div
          v-for="(member, midx) in data.members"
          :key="midx"
          class="member-link"
          @click="$router.push('/profiles/' + member.user_id)"
        >
        <!-- @click="memberlinkClicked = (memberlinkClicked === midx ? null : midx)" -->
          <!-- <div
            v-show="memberlinkClicked === midx"
            style="position: absolute; top: calc(100% + 8px);"
          >
            <button
              class="member-control-btn"
              @click="$router.push('/profiles/' + member.id)"
            >
              инфо
            </button>
          </div> -->
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
    </div>
    <div class="tt__bot tt__section" v-if="can('tournament@kick') || can('user@ban')">
      <button class="tt__btn blu" v-if="can('tournament@kick')" v-show="!inLoading">Кикнуть</button>
      <div v-if="inLoading">
        Загрузка...
      </div>
      <button
        class="tt__btn red"
        v-if="can('user@ban')"
        v-show="!inLoading"
      >
        Распустить
      </button>
    </div>
  </div>
</template>

<script>
// import axiosInstance from '@/store/axiosInstance.js'
import Avatar from '@/components/quarks/Avatar'
// import TeamDisplay from '@/components/molecules/TeamDisplay'

export default {
  props: [
    'x', 'y', 'isShown',
    'data'
  ],
  components: {
    Avatar
  },
  data() {
    return {
      inLoading: false,
      memberlinkClicked: null
    }
  },
  methods: {
    close($event) {
      if (!$event.target.closest('.ban-modal-wrapper') && !$event.target.closest('.tooltip-trigger')) {
        this.$emit('close')
      }
    },
    // kick() {
    //   const tid = this.$store.state.tournament.tournament.id
    //   this.inLoading = true
    //   axiosInstance
    //     .post(`/api/tournaments/${tid}/events`, {
    //       event: 'kick',
    //       user_id: this.data.user_id
    //     })
    //     .then(resp => {
    //       if (resp.data && resp.data.success) {
    //         this.$notify({
    //           group: 'n',
    //           text: 'Успешно кикнут',
    //           duration: 2500
    //         })
    //         this.$store.dispatch('tournament/playerKicked', this.data.user_id)
    //         this.inLoading = false
    //         this.close()
    //       } else {
    //         this.inLoading = false
    //         this.$notify({
    //           group: 'n',
    //           text: 'Действие не удалось',
    //           duration: 2500
    //         })
    //       }
    //     })
    //     .catch(() => {
    //       this.$notify({
    //         group: 'n',
    //         text: 'Ошибка, кикнуть не удалось',
    //         duration: 2500
    //       })
    //       this.inLoading = false
    //     })
    // },
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.player-tooltip {
  position: fixed;
  background-color: var(--primary-opacity1);
  border: 2px solid var(--primary-main);
  border-radius: 10px;
  color: var(--primary-text); //#cbced1;
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