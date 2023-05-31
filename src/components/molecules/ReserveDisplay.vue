<template>
  <div
    class="reserve-display"
    @drop="onReserveDrop"
    @dragover.prevent="onReserveDragover" @dragenter.prevent
    :class="{'dragoveredReserve': dragovered}"
    @dragleave="dragovered = false"
  >
    <PlayerDisplay 
      v-for="(player, idx) in team"
      :key="String(player.id) + String(idx)"
      :player="player"
      :tType="tType"
      :teamId="null"
      @player-click="playerClick"
      @close-tt="closeTT"
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
  props: [
    'team',
    'teamColor',
    'tType'
  ],
  data: () => {
    return {
      rolesMap: ["top", "jung", "mid", "adc", "sup"],
      dragovered: false
    }
  },
  computed: {
    ofAdmins() {
      return this.$store.getters['auth/ofAdmins']
    }
  },
  methods: {
    onReserveDragover() {
      if (this.ofAdmins) {
        this.dragovered = true
      }
    },
    onReserveDrop (evt) {
      this.dragovered = false
      if (evt.target.classList.contains('reserve-display')) {
        const pid = evt.dataTransfer.getData('pid')
        this.$store.dispatch('tournament/movePlayer', {pid, 'team': null, 'role': null})
      }
    },
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
.reserve-display {
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  min-height: 53px;
  padding-left: 10px;
}
.dragoveredReserve {
  outline: 2px dotted mediumaquamarine;
  outline-offset: 2px;
}
</style>