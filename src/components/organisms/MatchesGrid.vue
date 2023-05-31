<template>
  <div
    class="card grid-wrapper"
    style="transition-duration: .3s;"
    :style="{
      height: isShown ? '470px' : '0',
      padding: isShown ? '15px' : '0 15px',
    }"
  >
    <div class="grid-inner">
      <div
        class="matches-wrapper"
        v-if="grids"
      >
        <div
          
          class="round"
        >
          <!-- v-for="(round, ridx) in rounds" :key="'round_' + ridx" -->
          <h3 style="margin-bottom: 8px; color: #808191; margin-bottom: 16px; text-align: left;">Раунд {{selectedRound}} </h3>
          <div class="round-inner">
            <div
              v-for="battle in selectedRoundValue" :key="battle.id"
              class=""
              style="position: relative;"
              @click="$store.dispatch('tournament/setBattle', battle)"
            >
            <!-- battle-wrapper -->
            <!-- :style="{
                'box-shadow': currentBattle.id === battle.id ? '0 0 5px var(--secondary-main)': ''
              }" -->
              <!-- <div v-if="can('admin@view')" style="position: absolute; height: 5px; width: 100%; top: -9px; left: 0; z-index: 1; display: flex; justify-content: space-between; background: var(--opacity-bg1);">
                <div v-show="false" style="position: absolute; top: -32px; background: transparent; color: #fff;">
                  <button class="btn-wutton">{{battle.team1}}</button>
                  <button class="btn-wutton">{{battle.team2}}</button>
                  <button class="btn-wutton active">↺</button>
                </div>
              </div> -->
              <!-- {{$t('match-statuses.' + battle.matches[0].status)}} -->
              <BattleCard
                :battle="battle"
                :current-battle="currentBattle"
                :round="selectedRound"
                mode="rtc"
                style="margin-bottom: 12px;"
              />
              <!-- <BattleTeamRow
                :pic="'/img/platinum.png'"
                :team="battle.team1"
                :score="battle.team1_score"
                :win="battle.win === battle.team1"
                style="border-bottom: 1px solid var(--primary-decor2);"
              />
              <BattleTeamRow
                :pic="'/img/platinum.png'"
                :team="battle.team2"
                :score="battle.team2_score"
                :win="battle.win === battle.team2"
              /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import BattleTeamRow from '@/components/atoms/BattleTeamRow.vue'
import BattleCard from '@/components/molecules/BattleCard.vue'

export default {
  components: { BattleCard },
  props: ['isShown'],
  data: () => ({
  }),
  mounted() {
  },
  methods: {
  },
  computed: {
    grids() {
      return this.$store.getters['tournament/grids']
    },
    selectedGrid() {
      return this.$store.getters['tournament/selectedGrid']
    },
    rounds() {
      return this.$store.getters['tournament/rounds']
    },
    selectedRound() {
      return this.$store.state.tournament.selectedRound
    },
    currentRound() {
      return this.$store.state.tournament.round
    },
    currentBattle() {
      return this.$store.getters['tournament/selectedBattle']
    },
    selectedRoundValue() {
      return this.rounds.find(r => Array.isArray(r) && r.length && r[0].round === this.selectedRound)
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.grid-wrapper {
  height: 370px;
  margin-top: 20px;
  margin-bottom: 20px;
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
.battle-wrapper {
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
  margin-top: 14px;
  background-color: var(--grid-card);
  width: calc(25% - 20px);
  font-size: 14px;
  /* overflow: hidden; */
  flex-grow: 1;
  max-width: calc(25% - 10px);
}
.status-indicator {
  min-width: 15%;
  height: 5px;
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
</style>