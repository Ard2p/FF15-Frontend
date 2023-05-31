<template>
  <div class="tournament screen">
      <MatchesGrid5x5 :isShown="true" style="margin-bottom: 200px;" />
      <!-- <Tooltip
        :isShown="showTT"
        :x="tooltipX" :y="tooltipY"
        @close="showTT = false"
        :data="tolltipData"
      /> -->
      <!-- {{dataExample}} -->
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

// import TeamDisplay from '@/components/molecules/TeamDisplay.vue'
// import ReserveDisplay from '@/components/molecules/ReserveDisplay.vue'
// import Toggle from '@/components/atoms/Toggle.vue'
// import Loader from '@/components/atoms/Loader.vue'
// import Tooltip from '@/components/atoms/Tooltip.vue'

// import Flipper from 'vue-flipper'
import MatchesGrid5x5 from '@/components/organisms/MatchesGrid5x5.vue'
import axiosInstance from '@/store/axiosInstance.js'

const dataExample = () => require('@/assets/json/oldGridExample.json')

export default {
  name: 'Tournament',
  components: {    
    // TeamDisplay,
    // ReserveDisplay,
    // Toggle,
    // Loader,
    // Tooltip,
    // Flipper,
    MatchesGrid5x5
  },
  props: ['tid'],
  data: () => {
    return {
      dataExample: dataExample()
    }
  },
  computed: {
    nextRoundLoading () {
      return this.$store.state.tournament.nextRoundLoading
    },
    twLocation() {
      return window.location.hostname
    },
    rounds() {
      return this.$store.getters['tournament/rounds']
    },
    roundsMeta() {
      return this.rounds.map(r => {
        if (Array.isArray(r) && r.length) {
          return r[0].round
        } else {
          return undefined
        }
      })
    },
    selectedRound() {
      return this.$store.state.tournament.selectedRound
    },



    teamsTabSwitchable() {
      return this.tournament.grids && this.tournament.grids.filter(p => p.round === this.selectedRound).length
    },
    
    totalPlayers() {
      return this.tournament.players.filter(p => p.round === this.tournament.round).length
    },
    player_me() {
      if (this.isAuthed && this.tournament && this.tournament.round && this.tournament.players) {
        return this.tournament.players.filter(p => p.round === this.tournament.round).find(player => player.user_id === this.user.id)
      } else {
        return null
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    tournament() {
      return this.$store.state.tournament.tournament
    },
    dataInLoading() {
      return this.$store.state.tournament.in_loading.tournament
    },

    ...mapGetters({
      'isAuthed': 'auth/isAuthed',
      'team1': 'tournament/team1',
      'team2': 'tournament/team2',
      'teamNull': 'tournament/teamNull',
      'selectedBattle': 'tournament/selectedBattle',
      'firstLoad': 'tournament/firstLoad'
    }),
    team1Id() {
      //return this.$store.getters['tournament/selectedBattle'].team1
      return this.selectedBattle.team1
    },
    team2Id() {
      // return this.$store.getters['tournament/selectedBattle'].team2
      return this.selectedBattle.team2
    },
    myRound() {
      //условие показа кнопки кода турнира
      let player = this.team1.find(p => (p.user_id === this.user.id && p.round === this.tournament.round))
      if (!player) {
        player = this.team2.find(p => (p.user_id === this.user.id && p.round === this.tournament.round))
      }
      return !!player
    },
    refreshOn() {
      return this.$store.state.main.refreshTournamentsOn
    }
  },
  // created() {
  //   this.fetchData()
  // },
  // beforeRouteLeave (to, from, next) {
  //   this.$store.dispatch('main/setRefreshVal', false)
  //   next()
  // },
  methods: {
    deleteRoundConfirm (tid) {
      this.$store.dispatch('main/setYesNoModal', {
        val: true,
        text: 'Точно удалить последний раунд?',
        action: () => {
          this.$store.dispatch('tournament/deleteLastRound', tid);
          this.closeSettings()
          this.$store.dispatch('main/setYesNoModal', { val: false })
        }
      })
    },
    regenMatchCode() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {
        axiosInstance
          .post(`/api/tournaments/${this.tournament.id}/events`, {event: 'regen', match: this.selectedBattle.matches[0].id})
          .then(resp => {
            if (resp.success !== false) {
              this.$notify({
                group: 'n',
                text: 'Отправлено',
                duration: 1500,
              })
            }
          })
      }
    },
    getMatchData() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {
        axiosInstance
          .post(`/api/tournaments/${this.tournament.id}/events`, {event: 'refresh', match: this.selectedBattle.matches[0].id})
          .then(resp => {
            if (resp.success !== false) {
              this.$notify({
                group: 'n',
                text: 'Отправлено',
                duration: 1500,
              })
            }
          })
      }
    },
    tCodeCopy() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {
        navigator.clipboard.writeText(this.selectedBattle.matches[0].code).then(() => {
          this.$notify({
            group: 'n',
            text: 'Скопировано',
            duration: 1500,
          })
        }, () => {
          this.$notify({
            group: 'n',
            text: 'Провал',
            duration: 1500,
          })
        })
      }
    },
    changeRound(rm) {
      this.showRoundDD = false
      if (rm !== this.selectedRound) {
        this.$store.dispatch('tournament/changeRound', rm)
      }
    },
    closeRoundDD() {
      this.showRoundDD = false
    },
    updateShowGrid() {
      if (this.teamsTabSwitchable) {
        this.showGrid = !this.showGrid
      }
    },
    tryChangeTStatus(newStatus, tid) {
      this.$store.dispatch('tournament/tryChangeStatus', {newStatus, tid})
    },
    closeSettings() {
      this.settingsOpen = false
    },
    closeTStatus() {
      this.tstatusOpen = false
    },
    // recreate() {
    //   this.fetchData()
    // },
    fetchData() {
      this.$store.dispatch('tournament/getTournamentDetails', this.tid)
    },
    leaveTournament() {
      this.$store.dispatch('tournament/leaveTournament', this.tournament.id)
    },
    enterTournament() {
      this.game = this.tournament.game
      this.$store.dispatch('tournament/enterTournament', {tid: this.tournament.id, idx: null})
    },
    playerClick({$event, player}) {      
      let targ = $event.target
      if (targ.classList.contains('role') && targ.classList.contains('non-empty')) {
        if (this.tolltipData.user_id === player.user_id) {
          this.showTT = !this.showTT
        } else {
          // let properOffsetX = targ.offsetLeft + targ.parentElement.offsetLeft + targ.parentElement.parentElement.offsetLeft
          // let properOffsetY = targ.offsetTop + targ.parentElement.offsetTop + targ.parentElement.parentElement.offsetTop
          let properOffsetX = $event.pageX - $event.offsetX
          let properOffsetY = $event.clientY - $event.offsetY
          this.tooltipX = properOffsetX
          this.tooltipY = properOffsetY
          this.tolltipData = player
          this.showTT = true
        }
        $event.stopPropagation()
      }
    },
    closeTT() {
      this.showTT = false
    }
  },
  // beforeRouteEnter(from, to, next) {
  //   next(vm => {
  //     vm.fetchData()
  //   })
  // },
}
</script>



<style lang="scss" scoped>
.tournament {
  /* position: relative; */
  color: black;
  padding: 10px;
}
.tournament-header {
  position: relative;
  background-image: url('/img/bg/tournament-header-bg.png');
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 162px;
  box-sizing: border-box;
  border-radius: 20px;
  color: rgb(16, 38, 60);
  padding: 52px 44px 18px 44px;
  /* margin-top: 24px; */
  margin-bottom: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  p {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin: 8px 0;
    font-weight: 500;
    color: gray;
  }
  i {
    width: 26px;
    margin-right: 6px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    display: block;
    &.i-start_dt {
      background-image: url('/img/icons/start_dt.png');
    }
    &.i-composition {
      background-image: url('/img/icons/composition.png');
    }
    &.i-disco {
      background-image: url('/img/icons/disco.png');
    }
  }
  .subtitle {
    font-family: 'Jost', sans-serif;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
  }
  .subtext {
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    color: gray;
    font-size: 11px;
    line-height: 11px;
  }
  &-info {
    display: flex;
    justify-content: space-between;
    .info-sub {
      display: flex;
      width: 360px;
      justify-content: space-between;
    }
  }
}
.hollow-btn {
  width: 152px;
  padding: 0 2px;
  div {
    background-color: #fff;
    border-radius: 15px;
    height: 26px;
    line-height: 26px;
  }
}
.teams {
  display: flex;
  margin: 0 auto;
  max-width: 840px;
  min-height: 50px;
  justify-content: center;
}
.teamstab-btn {
  position: absolute;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  right: 20px;
  top: 5px;
  border: 0;
  /* fill: var(--primary-text); */

  /* fill: var(--primary-opacity1); */
  fill: #eee;
  /* background-color: var(--primary-text); */
  background-color: transparent;
  cursor: pointer;
  user-select: none;
  &:hover {
    /* fill: rgb(0, 137, 255); */
    fill: var(--primary-main);;
  }
}
.roles-decorator {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: calc(100% - 42px);
  i {
    position: relative;
    display: block;
    width: 80px;
    margin: 0 10px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    transform-style: preserve-3d;
    background-size: 24px 24px;
    /* transform: translateZ(1px); */
    /* &:before {
      content: '';
      transform: translateZ(-1px);
      display: block;
      position: absolute;
      top: 10px;
      width: 100%;
      border-bottom: 1px solid #deddec;//#efeefd;
    } */
  }
  .i-top {
    background-image: url('/img/icons/roles/top.png');
  }
  .i-jung {
    background-image: url('/img/icons/roles/jung.png');
  }
  .i-mid {
    background-image: url('/img/icons/roles/mid.png');
  }
  .i-adc {
    background-image: url('/img/icons/roles/adc.png');
  }
  .i-sup {
    background-image: url('/img/icons/roles/sup.png');
  }
}
.team {
  display: flex;
  border-radius: 5px;
  position: relative;
}
.team-blue {
  background-color: #99e8;
}
.player {
  padding: 10px;
  /* border: 1px solid salmon; */
}
.role {
  border-radius: 100%;
  background-color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  color: black;
  margin-bottom: 5px;
}

.loader {
  position: absolute;
  top: calc(50% - 80px);
  left: calc(50% - 28px);
}

.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 15px;
  box-sizing: border-box;
}
.card:before,
.tournament-header:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--card-glow);
  filter: blur(43px);
  border-radius: 24px;
  transition: background .25s;
}


.teams-card {
  position: relative;
  width: 55%;
  padding-bottom: 20px;
}
.broadcast-card {
  width: 43%;
  padding: 15px 21px;
}
.reserve-card {
  margin-top: 14px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  /* min-height: 170px; */
}
.Flipper{
  position:relative;
  -webkit-perspective:3000px !important;
  -moz-perspective:3000px !important;
  perspective:3000px !important;
}

.settings-wrap {
  position: absolute;
  top: 10px;
  right: 15px;
  display: flex;
  flex-direction: column;
}
.settings-dd {
  width: 150px;
  z-index: 10;
  position: absolute;
  top: 24px;
  right: 0;
  /* width: 190px; */
  border-radius: 10px;
  padding: 16px;
  /* box-shadow: 0 10px 36px var(--shadow4); */
  box-shadow: 0px 24px 64px var(--shadow4);
  background-color: var(--primary-opacity1);
  margin-bottom: -15px;
  color: #808191;
  transition: padding 0.25s, background-color 0.25s;
}
.settings-btn {
  margin-left: auto;
  .icon-settings {
    font-size: 21px;
    fill: var(--primary-text);
    opacity: 0.7;
    transition: all 0.25s;
  }
  &:hover .icon {
    fill: var(--primary-text1);
    opacity: 1;
  }
}

.acc-indicator {
  background-color: var(--primary-text);
  transform: rotate(0deg);
  transform-origin: center;
  height: .2rem;
  width: 1rem;
  min-width: 1rem;
  min-height: .2rem;
  position: relative;
  transition: transform .5s ease-out;
  cursor: pointer;
}
.acc-indicator:before {
  transform: rotate(90deg);
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  transition: transform .5s ease-out;
  background-color: var(--primary-text);
  transform-origin: center;
}

.acc-indicator.active {
  transform: rotate(180deg);
}
.acc-indicator.active:before {
  transform: rotate(180deg);
}

.score {
  margin-bottom: 15px;
  font-family: Jost, sans-serif;
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  color: var(--primary-main);
}


.t-status-wrap {
  /* width: 150px; */
  /* display: flex; */
  position: relative;
  flex-direction: column;
  user-select: none;
  font-size: 12px;
}
.t-status-dd {
  box-shadow: 0px 24px 64px var(--shadow5);
  /* width: 130px; */
  z-index: 10;
  position: absolute;
  top: 16px;
  right: -35px;
  border-radius: 6px;
  padding: 10px;
  /* padding-top: 10px; */
  
  background-color: var(--primary-opacity1);
  margin-bottom: -15px;
  color: #808191;
  transition: padding 0.25s, background-color 0.25s;
}
.t-status-btn {
  margin-left: auto;
}
.status-btn {
  justify-content: center;
  cursor: pointer;
  
}

.status-btn {
  display: flex;
  align-items: center;
  height: 56px;
  border-radius: 12px;
  
  font-weight: 600;
  color: #808191;
  transition: all .25s;
  font-size: 14px;
  padding: 0 20px;
  cursor: pointer;
  &:hover {
    background: var(--primary-decor4);
    color: var(--third-color);
  }
  &.selected {
    color: var(--primary-main);
  }
}

.round-top-btn {
  border: 2px solid var(--primary-main);
  color: var(--primary-main);
  font-family: Jost, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  height: 30px;
  width: 152px;
  border-radius: 15px;
  font-weight: 600;
}
.round-btn {
  font-size: 16px;
  color: #808191;
  width: 152px;
  /* background-color: var(--primary-opacity1); */
  /* &.r-active:hover {
    color: var(--primary-main);
  } */
  &.secondary:hover {
    color: var(--secondary-main);
  }
}

.status-chip {
  border-radius: 6px;
  padding: 5px 16px;
  font-size: 14px;
  line-height: 15px;
  margin-right: 10px;
  font-weight: 500;
  color: white;
  background: #3f8cff;
}
.bg-open {
  background: #50c878;
}
.bg-create {
  background: #3f8cff;
}
.bg-process,
.bg-pending {
  background: gold;
  color: black;
}
.bg-balance {
  background: orange;
}
.bg-end,
.bg-archive {
  background: #e84c4c;
}
</style>

<style>
.ql-align-center {
  text-align: center;
}
.ql-align-right {
  text-align: right;
}
.ql-align-justify {
  text-align: justify;
}
</style>
