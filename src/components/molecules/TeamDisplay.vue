<template>
  <div class="team-display" v-if="team.length || tType === 'rtc'">
    <!-- <div>{{team[0]}}</div> -->
    <p class="team-label" :style="{ textAlign: teamSide === 'right' ? 'left' : 'right'}">
      {{teamLabel}}
    </p>
    <PlayerDisplay 
      v-for="(role, ridx) in (['rtc', 'rtc_se'].includes(tType) ? $options.rtcRoleMap : $options.teamRoleMap)"
      :key="role"
      :player="['rtc', 'rtc_se'].includes(tType)
        ? team.find(pl => pl.role === role) || {role, nickname: '-'}
        : team[ridx] || {role, nickname: '-'}
      "
      :teamId="teamId"
      :teamSide="teamSide"
      :tType="tType"
      @player-click="playerClick"
      @close-tt="closeTT"
    />
  </div>
  <div
    v-else
    style="display: flex; flex-direction: column; width: 220px;"
  >
    <p
      class="team-label"
      style="align-self: center; flex-shrink: 1;"
      v-text="empty ? '-' : '?'"
    />
    <div
      style="color: var(--primary-text); font-size: 20px; font-weight: 600; display: flex; justify-content: center; align-items: center; flex-grow: 1;"
      v-text="empty ? 'Пропущено' : 'TBA'"
    />
  </div>
</template>

<script>
import PlayerDisplay from '@/components/atoms/PlayerDisplay.vue'

export default {
  name: 'TeamDisplay',
  components: {
    PlayerDisplay
  },
  rtcRoleMap: ["top", "jung", "mid", "sup", "adc"],
  teamRoleMap: ["top", "jung", "mid", "sup", "adc", "xxx"],
  props: [
    'team',
    'teamLabel',
    'teamId',
    'teamSide',
    'empty',
    'tType'
  ],
  // data: () => {
  //   return {
  //     rolesMap: ["top", "jung", "mid", "sup", "adc"]
  //   }
  // },
  computed: {

  },
  methods: {
    playerClick({$event, player}) {
      this.$emit('player-click', {$event, player})
    },
    closeTT() {
      this.$emit('close-tt')
    }
  }
}
</script>

<style lang="scss" scoped>
.team-display {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  position: relative;
  width: 220px;
}
.team-label {
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  color: #808191;
  padding: 0 20px;
  margin-top: 4px;
  margin-bottom: 20px;
}
</style>