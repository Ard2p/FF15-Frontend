<template>
  <div
    class="battle-container"
  >
    <div v-if="mode !== 'rtc'" style="align-self: center; color: var(--grid-outer-text); min-width: 20px; text-align: left; direction: rtl;">{{battle.num || battle.id}}</div>
    <div
      class="battle-wrapper"
      :style="{
        'background-color': (currentBattle && currentBattle.id === battle.id) ? 'var(--primary-main)': ''
      }"
    >
      <div v-if="mode !== 'rtc' && can('dev@view') && battle" style="position: absolute; left: 50%; top: -14px; color: var(--grid-card-body-text);">
        {{battle.id}}
      </div>
      <BattleTeamRow
        :pic="'/img/team-1.png'"
        :mode="mode"
        :teamMeta="teams && teams.find(t => t.team === battle.team1)"
        :team="battle.team1"
        :score="battle.team1_score"
        :win="battle.win !== null && battle.win === battle.team1"
        class="top-row"
        :ownBattle="highlightedBattle === battle.team1"
        style="border-bottom: 1px solid var(--primary-opacity1);"
        @team-click="$emit('team-click', $event)"
      />
      <!-- {{battle}} -->
      <BattleTeamRow
        :pic="'/img/platinum.png'"
        :mode="mode"
        :teamMeta="teams && teams.find(t => t.team === battle.team2)"
        :team="battle.team2"
        :score="battle.team2_score"
        :ownBattle="highlightedBattle === battle.team2"
        :win="battle.win !== null && battle.win === battle.team2"
        @team-click="$emit('team-click', $event)"
      />
      <BaseTimer
        v-if="
          mode !== 'rtc' && 
          battle.win === null &&
          battle.prepare_at &&
          (can('tournament@edit') || canSelf('tournament@edit-self', uid))
        "
        :init_time="battle.prepare_at"
        :fifteen="true"
      />
      <StartTimer
        v-if="
          mode !== 'rtc' &&
          battle.win === null &&
          (can('tournament@edit') || canSelf('tournament@edit-self', uid))
        "
        :match="battle.matches.find(m => m.status === 'process')"
      />
    </div>

    <!-- <div>{{battle.prepare_at}}</div> -->
    <div
      style="align-self: center; width: 32px; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 1px 0;"
    >
      <div
        class="status-indicator"
        v-for="(match, midx) in battle.matches" :key="midx"
        :style="{
          backgroundColor: $store.state.main.matchStatusColors[match.status],
          marginLeft: mode === 'rtc' ? '6px' : '',
        }"
      />
      
    </div>
  </div>
</template>

<script>
import BattleTeamRow from '@/components/atoms/BattleTeamRow.vue'
import BaseTimer from "@/components/quarks/BaseTimer"
import StartTimer from "@/components/quarks/StartTimer"

export default {
  name: 'BattleCard',
  components: { BattleTeamRow, BaseTimer, StartTimer },
  props: [
    'battle',
    'currentBattle',
    'round',
    'mode',
    'highlighted-battle',
    'teams',
    'uid'
  ],
  data: () => {
    return {
      // currentBattle: null // should be taken from in store?
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.battle-container {
  display: flex;
}
/* .column-lvl-0 {
  margin-bottom: 36px;
}
.column-lvl-0:nth-child(2n) {
  margin-bottom: 56px;
} */
/* .column-lvl-0:nth-last-child(2) {
  margin-bottom: 0;
} */
/* .column-lvl-3 {
  margin-bottom: 181px;
}
.column-lvl-3:last-child {
  margin-bottom: 0;
} */
/* .column-lvl-2 {
  margin-bottom: 448px;
}
.column-lvl-2:last-child {
  margin-bottom: 0;
} */
.battle-wrapper {
  cursor: pointer;
  border-radius: 10px;
  padding: 2px;
  font-size: 14px;
  position: relative;
}
.status-indicator {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin: 1px 0 1px auto;
  background-color: var(--grid-indicators-def);
}

.column-round-0 > .battle-container {
  margin-bottom: 56px;
  &.top:nth-child(2n - 1) {
    margin-bottom: 36px;
  }
}
.column-round-1 > .battle-container {
  margin-bottom: 199px;
  &.top {
    margin-bottom: 181px;
  }
}
.column-round-2 > .battle-container {
  margin-bottom: 486px;
  &.top {
    margin-bottom: 448px;
  }
}
.column-round-3 > .battle-container {
  margin-bottom: 983px;
}

.column-round-4 > .battle-container {
  margin-bottom: 486px;
  &.top {
    margin-bottom: 0px;
  }
}
.battle-container.battle-container:nth-last-child(2) {
  margin-bottom: 0;
}
</style>