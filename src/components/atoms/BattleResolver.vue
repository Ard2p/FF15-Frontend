<template>
  <div
    style="top: 90px; right: 18px; z-index: 10;"
  >
    <button
      v-if="can('tournament@edit')"
      class="settings-btn"
      @click="$emit('open-match-settings')"
    >
      <svg class="icon icon-settings">
        <use xlink:href="/img/icons.svg#icon-settings"></use>
      </svg>
    </button>

    <div v-if="mathchSettingsDd" style="width: 310px; right: -100%;" class="settings-dd">
      <div style="margin-left: auto; margin-right: 20px; margin-bottom: 12px;">
        <div class="subtitle" style="margin-bottom: 10px;">
          Управление {{ $store.state.tournament.current_match + 1 }}-м матчем
        </div>
        <div style="display: flex; margin-bottom: 10px; font-size: 14px;">
          <div>
            Кто победил?
            <select
              v-if="['team', 'team_de'].includes($store.state.tournament.tournament.type)"
              :value="scoreSelectedX"
              @change="$emit('update:scoreSelectedX', $event.target.value)"
            >
              <option v-if="selectedBattle.team1" :value="selectedBattle.team1">
                {{
                  $store.state.tournament.tournament.teams.find(team => team.team === selectedBattle.team1)
                    ? $store.state.tournament.tournament.teams.find(team => team.team === selectedBattle.team1).name
                    : '-'
                }}
              </option>
              <option v-if="selectedBattle.team2" :value="selectedBattle.team2">
                {{
                  $store.state.tournament.tournament.teams.find(team => team.team === selectedBattle.team2)
                    ? $store.state.tournament.tournament.teams.find(team => team.team === selectedBattle.team2).name
                    : '-'
                }}
              </option>
              <option :value="null">
                Никто
              </option>
            </select>
            <select
              v-else
              :value="scoreSelectedX"
              @change="$emit('update:scoreSelectedX', $event.target.value)"
            >
              <option v-if="selectedBattle.team1" :value="selectedBattle.team1">
                {{
                  'Команда ' + selectedBattle.team1
                }}
              </option>
              <option v-if="selectedBattle.team2" :value="selectedBattle.team2">
                {{
                  'Команда ' + selectedBattle.team2
                }}
              </option>
              <option :value="null">
                Никто
              </option>
            </select>
          </div>
          <div>
            Статус
            <select :value="statusSelectedX" @change="$emit('update:statusSelectedX', $event.target.value)">
              <option
                v-for="m in Object.keys($store.state.main.matchStatusColors)"
                :key="m"
                :value="m"
              >{{m}}</option>
            </select>
          </div>

        </div>
        <button
          class="action-btn"
          :style="{
            backgroundColor: 'var(--primary-main)'
          }"
          @click="$emit('change-match-data')"
        >
          Применить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'mathchSettingsDd',
    'selectedBattle',
    'scoreSelectedX',
    'statusSelectedX',
  ],
  data() {
    return {
    }
  },
  methods: {

  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.settings-dd {
  width: 150px;
  z-index: 10;
  position: absolute;
  top: 24px;
  right: 0;
  border-radius: 10px;
  padding: 16px;
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
.subtitle {
    font-family: 'Jost', sans-serif;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
  }
</style>