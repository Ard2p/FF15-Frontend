<template>
  <div
    class="grid-wrapper"
    style="transition-duration: .3s; padding: 0,"
    ref="grid"
    @mousedown="gridMouseDown"
    @mousemove="gridMouseMove"
    @mouseup="gridMouseUp"
    @mouseleave="gridMouseUp"
  >
  <!-- height: isShown ? '1062px' : '0', -->
  <!--  @scroll="syncScrollBody(1)" ref="gridHeader1" -->
    <div class="grid-header">
      <div class="grid-header-inner">
        <div
          v-for="round in rounds.main.length"
          :key="round"
          class="round-header"
        >
          <div>Раунд {{ round }}</div>
          <div class="round-date">{{formatDate(tournament.start)}}</div>
        </div>
        <div
          class="round-header"
          style="border: 0;"
        >
        </div>
      </div>
    </div>
    <!-- <div style="display: flex;">
      <pre>{{rounds}}</pre>
      <pre style="background: pink">{{roundsX}}</pre>
    </div> -->
    <div
      class="grid-body top-grid"
    >
      <template v-for="(round, ridx) in rounds.main">
        <div
          :key="ridx"
          class="round-column"
          :class="`column-round-${ridx}`"
        >
          <BattleCard
            v-for="battle in round" :key="battle.id"
            :battle="battle"
            :current-battle="currentBattle"
            :highlighted-battle="(ownTeam && ownTeam.team) ? ownTeam.team : -1"
            :teams="teams.filter(t => (t.team === battle.team1 || t.team === battle.team2))"
            :round="ridx"
            mode="team"
            class="top"
            @click.native="$store.dispatch('tournament/setBattle', battle)"
            @team-click="$emit('team-click', $event)"
            :uid="tournament.user_id"
          />
          <!-- @click.native="currentBattle = battle" -->
          <div style="padding-top: 25px;" />
        </div>
        <div
          v-if="ridx < rounds.main.length - 1"
          :key="'filler' + ridx"
          :class="`filler-column-x-x filler-round-${((ridx === (rounds.main.length - 2)) && (tournament.type === 'team_de' || tournament.type === 'rtc_de')) ? ridx - 2: ridx}`"
        >
          <div
            v-for="r in ~~((round.length + 1) / 2)" :key="r"
            class="filler-wrapper"
            :class="{
              final: (ridx === (rounds.main.length - 2) && (tournament.type === 'team_de' || tournament.type === 'rtc_de')),
            }"
          >
            <div :class="{['r' + ridx]: ridx === (rounds.main.length - 2)}"/><div/>
          </div>
        </div>
      </template>
      <!-- <div :class="`filler-column-x-x filler-round-${rounds.main.length - 2}`">
        <div
          class="filler-wrapper"
          :class="{
            final: true,
          }"
        >
          <div :class="'r' + (rounds.main.length)"/><div/>
        </div>
      </div> -->
      <!-- <div style="min-height: 100%; display: flex; padding-bottom: 34px;">
        <BattleTeamRow
          :pic="'/img/team-1.png'"
          :team="null"
          :score="null"
          :win="false"
          style="margin: auto 0; box-shadow: 0 0 10px orange; border-radius: 8px;"
          class="mid-row"
        />
      </div> -->
      <div style="padding-left: 50px;" />
    </div>

    <!-- BOTTOM GRID -->
    <div class="grid-header" style="margin-top: 6px;" v-if="rounds.loosers.length">
      <div class="grid-header-inner">
        <div
          v-for="round in rounds.loosers.length"
          :key="round"
          class="round-header"
        >
          <div>Раунд нижней сетки {{ round }}</div>
          <div class="round-date">{{formatDate(tournament.start)}}</div>
        </div>
      </div>
    </div>

    <div
      class="grid-body bottom"
      v-if="rounds.loosers.length"
    >
      <template v-for="(round, ridx) in rounds.loosers">
        <div
          :key="ridx"
          class="round-column"
          :class="`column-round-${(ridx === (rounds.loosers.length - 1)) ? ridx - 1 : ~~(ridx / 2)}`"
        >
          <BattleCard
            v-for="battle in round" :key="battle.id"
            :battle="battle"
            :current-battle="currentBattle"
            :highlighted-battle="(ownTeam && ownTeam.team) ? ownTeam.team : -1"
            :teams="teams.filter(t => (t.team === battle.team1 || t.team === battle.team2))"
            :round="ridx"
            mode="team"
            @click.native="$store.dispatch('tournament/setBattle', battle)"
            @team-click="$emit('team-click', $event)"
            :uid="tournament.user_id"
          />
          <div style="padding-top: 50px;" />
        </div>
        <div
          v-if="ridx < rounds.loosers.length"
          :key="'filler' + ridx"
          :class="`filler-column-x-x filler-round-${~~(ridx / 2)} ${(ridx % 2 === 0) ? 'bottom' : 'bottom-odd'}`"
        >
          <div
            v-for="r in ~~((ridx % 2 === 0) ? round.length : (round.length)/2)" :key="r"
            class="filler-wrapper"
            :class="{
              final: (ridx % 2 === 0),
            }"
          >
            <div :class="{['r' + ridx]: (ridx % 2 === 0)}"/><div/>
          </div>
        </div>
      </template>
      <!-- <div style="padding-left: 50px;" /> -->
    </div>
  </div>
</template>

<script>
import BattleCard from '@/components/molecules/BattleCard.vue'

export default {
  components: { BattleCard },
  props: ['isShown', 'teams', 'grids', 'ownTeam'],
  data: function () { return {
    // currentBattle: null,
    pos: null,
    dx: 0,
    dy: 0,
  }},
  created() {
  },
  methods: {
    formatDate (d) {
      return `${d.substring(8, 10)}/${d.substring(5, 7)}/${d.substring(0, 4)}`
    },
    syncScrollBody (n) {
      this.$refs['gridBody' + n].scrollLeft = this.$refs['gridHeader' + n].scrollLeft
    },
    syncScrollHeader (n) {
      this.$refs['gridHeader' + n].scrollLeft = this.$refs['gridBody' + n].scrollLeft
    },

    gridMouseDown ($event) {
      this.pos = {
        left: this.$refs.grid.scrollLeft,
        top: this.$refs.grid.scrollTop,
        x: $event.clientX,
        y: $event.clientY
      }
      this.$refs.grid.style.cursor = 'grabbing';
      this.$refs.grid.style.userSelect = 'none'
    },
    gridMouseMove ($event) {
      if (this.pos) {
        this.dx = $event.clientX - this.pos.x
        this.dy = $event.clientY - this.pos.y

        this.$refs.grid.scrollTop = this.pos.top - this.dy
        this.$refs.grid.scrollLeft = this.pos.left - this.dx
      }
    },
    gridMouseUp () {
      this.$refs.grid.style.cursor = 'grab';
      this.$refs.grid.style.removeProperty('user-select');
      this.pos = null
    },
  },
  computed: {
    rounds () {
      const griddo = {
        main: [],
        loosers: []
      }
      this.grids.forEach(grid => {
        if (grid.grid === 'main' || grid.grid === 'loosers') {
          if (griddo[grid.grid][grid.round - 1]) {
            griddo[grid.grid][grid.round - 1].push(grid)
          } else {
            griddo[grid.grid][grid.round - 1] = [grid]
          }
        }
      })
      return griddo
    },
    tournament () {
      return this.$store.state.tournament.tournament
    },
    // grids() {
    //   return this.$store.getters['tournament/grids']
    // },
    // selectedGrid() {
    //   return this.$store.getters['tournament/selectedGrid']
    // },
    // rounds() {
    //   return this.$store.getters['tournament/rounds']
    // },
    // selectedRound() {
    //   return this.$store.state.tournament.selectedRound
    // },
    // currentRound() {
    //   return this.$store.state.tournament.round
    // },
    currentBattle() {
      return this.$store.getters['tournament/selectedBattle']
    },
    // selectedRoundValue() {
    //   return this.rounds.find(r => Array.isArray(r) && r.length && r[0].round === this.selectedRound)
    // }
  }
}
</script>

<style lang="scss" scoped>
/* ::-webkit-scrollbar {
  display: none;
} */
.grid-wrapper {
  border-radius: 20px;
  /* height: 370px; */
  margin-top: 0px;
  margin-bottom: 20px;
  /* margin: 0 -158px; */
  overflow-x: scroll;
  /* box-shadow: 0 0 10px var(--shadow0); */
  /* overflow: hidden; */
  /* scrollbar-width: none; */
}
.grid-inner {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
}
.grid-tab {
  padding: 4px 15px;
  margin-right: 5px;
  background-color: var(--primary-main);
  font-weight: bold;
  color: var(--opacity-bg1);
  &:hover {
    outline: 2px solid var(--secondary-main);
  }
}
.round-inner {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.btn-wutton {
  background: var(--primary-main);
  margin: 3px;
  width: 14px;
  height: 18px;
  line-height: 16px;
  font-weight: 500;
  color: #fff;
}
.btn-wutton.active {
  background: var(--secondary-main);
}

::-webkit-scrollbar {
  height: 14px;
}
::-webkit-scrollbar-thumb {
  background: var(--grid-scroll);
  border: 3px solid transparent;
  background-clip: padding-box;
  opacity: 1;
  box-shadow: none;
  /* height: 8px; */
}
.grid-header {
  /* max-width: 1024px;
  overflow-x: scroll; */
  padding-bottom: 3px;
  margin-bottom: 3px;
}
.grid-header-inner {
  display: flex;
  width: fit-content;
  height: 80px;
  padding: 20px 70px;
  padding-right: 96px;
  background: var(--grid-header);
}
.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 314px;
  min-width: 312px;
  height: 40px;
  border: 1px solid var(--grid-team-number);
  border-radius: 8px;
  color: #888B98;
  margin-right: 130px;
  padding: 0 15px;
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
}
.round-header:last-child {
  margin-right: 0;
}
.round-header > .round-date {
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-align: right;
}
.grid-body {
  display: flex;
  /* height: 555px; */
  padding: 25px 50px;
  /* overflow: scroll; */
  /* &.bottom {
    height: 332px;
  } */
}
.round-column {
  width: 354px;
  margin-right: 12px;
  /* height: fit-content; */
}
.filler-column-x-x {
  width: 66px;
  min-width: 66px;
  margin-right: 12px;
}
.filler-wrapper {
  display: flex;
  &> div:nth-child(1) {
    border: 1px solid var(--grid-support-line);
    border-left: 0;
    width: 50%;
  }
  &> div:nth-child(2) {
    border-top: 1px solid var(--grid-support-line);
    height: 1px;
    width: 50%;
  }
  &:last-child:last-child {
    margin-bottom: 0;  
  }
}
.filler-round-0 {
  padding-top: 41px;
  &> .filler-wrapper {
    margin-bottom: 142px;
    &> div:nth-child(1) {
      height: 124px;
    }
    &> div:nth-child(2) {
      margin-top: 62px;
    }
  }
}
.filler-round-0.bottom > .filler-wrapper > div:nth-child(1) {
  height: 1px;
}
.filler-round-0.bottom-odd > .filler-wrapper {
  &> div:nth-child(1) {
    height: 144px;
  }
  &> div:nth-child(2) {
    margin-top: 72px;
  }
}
.filler-round-1 {
  padding-top: 103px;
  &> .filler-wrapper {
    margin-bottom: 268px;
    &> div:nth-child(1) {
      height: 267px;
    }
    &> div:nth-child(2) {
      margin-top: 132px;
    }
  }
}
.filler-round-1.bottom {
  padding-top: 113px;
}
.filler-round-1.bottom > .filler-wrapper > div:nth-child(1) {
  height: 1px;
}
.filler-round-1.bottom > .filler-wrapper {
  margin-bottom: 285px;
}
.filler-round-1.bottom-odd {
  padding-top: 114px;
  &> .filler-wrapper {
    margin-bottom: 286px;
    &> div:nth-child(1) {
      height: 286px;
    }
    &> div:nth-child(2) {
      margin-top: 143px;
    }
  }
}
.filler-round-2 {
  padding-top: 233px;
  &> .filler-wrapper {
    margin-bottom: 535px;
    &> div:nth-child(1) {
      height: 535px;
    }
    &> div:nth-child(2) {
      margin-top: 268px;
    }
  }
}
.filler-round-2.bottom {
  padding-top: 257px;
}
.filler-round-2.bottom > .filler-wrapper > div:nth-child(1) {
  height: 1px;
}
.filler-round-2.bottom > .filler-wrapper {
  margin-bottom: 571px;
}
.filler-round-2.bottom-odd {
  padding-top: 257px;
  &> .filler-wrapper {
    /* margin-bottom: 286px; */
    &> div:nth-child(1) {
      height: 574px;
    }
    &> div:nth-child(2) {
      margin-top: 287px;
    }
  }
}
.filler-round-3 {
  padding-top: 501px;
  &> .filler-wrapper {
    /* margin-bottom: 268px; */
    &> div:nth-child(1) {
      height: 1070px;
    }
    &> div:nth-child(2) {
      margin-top: 535px;
    }
  }
}
.final {
  &> div:first-child {
    border: 0;
    border-top: 1px solid var(--grid-support-line);
    height: 1px;
    width: 100%;
    &.r3 {
      margin-top: 396px;
    }
    /* &.r4 {
      margin-top: 535px;
    } */
    &.top.r4 {
      margin-top: 535px;
    }
  }
  &> div:nth-child(2) {
    display: none;
  }
}
.top-grid .filler-round-3 .final .r4 {
  margin-top: 535px;
}
.filler-wrapper.final:last-child,
.bottom-odd > .filler-wrapper:last-child {
  margin-bottom: 0;
}

.column-round-1 {
  padding-top: 58px;
}
.bottom .column-round-1 {
  padding-top: 70px;
}
.column-round-2 {
  padding-top: 190px;
}
.bottom .column-round-2 {
  padding-top: 214px;
}
.column-round-3 {
  padding-top: 457px;
}
.column-round-4 {
  padding-top: 457px;
}
.bottom .column-round-4 {
  padding-top: 214px;
}
.bottom .column-round-3 {
  padding-top: 501px;
}
</style>