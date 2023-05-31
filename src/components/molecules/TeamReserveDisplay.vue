<template>
  <div
    class="team-reserve-display"
  >
    <div
      v-for="(team, tIdx) in teams"
      :key="tIdx"
      style="
        display: flex;
        align-items: center;
        height: 41px;
        border-radius: 8px;
        color: var(--grid-card-body-text);
        background: var(--grid-card-body);
        width: calc(25% - 6px);
        overflow: hidden;
        cursor: pointer;
      "
      class="team-element"
      @click="$emit('team-click', {$event, team})"
    >
    <!-- border-right: 1px solid var(--primary-opacity1); -->      
      <div
        style="background: var(--grid-team-number);
        display: flex;
        width: 40px;
        height: 41px;
        color: var(--grid-team-number-text);"
      ><Avatar
          :pic="team.avatar || 0"
          :mode="team.avatar ? 'team' : ''"
          :size="34"
          style="border: 0; margin: auto;"
        /></div><span style="padding: 0 6px; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{ team.name }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/quarks/Avatar.vue'

export default {
  name: 'TeamReserveDisplay',
  components: {
    Avatar
  },
  props: [
    'teams'
  ],
  data: () => {
    return {
    }
  },
  computed: {
    // currentAvatar () {
    //   console.log('cp 4767', this.teams)
    //   return (this.team && this.team.avatar) ? this.team.avatar : null
    // },
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.team-reserve-display {
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;
  position: relative;
  /* max-width: 900px; */
  width: 100%;
  /* margin: 0 auto; */
  min-height: 53px;
  /* padding-left: 10px; */
}
.dragoveredReserve {
  outline: 2px dotted mediumaquamarine;
  outline-offset: 2px;
}
.team-element {
  margin: 4px 0px;
  margin-right: 8px;
}
.team-element:nth-of-type(4n) {
  margin-right: 0;
}
</style>