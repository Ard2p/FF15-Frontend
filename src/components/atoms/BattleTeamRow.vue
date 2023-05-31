<template>
  <div class="team-row">
    <div class="team-id">{{ team !== null ? team : '?' }}</div>
    <div
      class="pic-name"
      :style="{
        width: mode === 'rtc' ? '190px': '214px',
        color: ownBattle ? 'var(--secondary-main)' : 'var(--grid-card-body-text)'
      }"
    >
      <!-- <div
        v-if="mode !== 'rtc'"
        class="team-pic"
        :style="{backgroundImage: team !== null ? `url(${teamMeta ? teamMeta.avatar : ''})` : ''}"
      /> -->
      <div
        v-if="['team', 'team_de'].includes(mode) && teamMeta"
        style="min-width: 41px; margin-right: 5px; display: flex;"
        @click="$emit('team-click', {$event, team: teamMeta});"
      >
        <Avatar
          :pic="teamMeta ? teamMeta.avatar : ''"
          :mode="'team'"
          :size="34"
          style="border: 0; margin: auto;"
        />
      </div>
      <!-- :size="32"
        style="min-width: 41px; margin: auto 6px auto 0; border: 0;" -->
      <div v-else-if="!['rtc', 'rtc_se'].includes(mode)" style="width: 41px; margin-right: 6px;">

      </div>
      <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
        {{
          ['rtc', 'rtc_se'].includes(mode)
            ? (team !== null ? 'Команда-' + team : '')
            : (teamMeta ? teamMeta.name : '')
        }}
      </div>
    </div>
    <div class="score" :class="{'active' : win}">
      {{team !== null ? score : null}}
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/quarks/Avatar.vue'

export default {
  props: [ 'team', 'teamMeta', 'score', 'win', 'mode', 'ownBattle'],
  components: { Avatar }
}
</script>
<style lang="scss" scoped>
.team-row {
  display: flex;
  height: 41px;
  line-height: 41px;
  box-sizing: content-box;
  font-size: 16px;
}
.team-id {
  background: var(--grid-team-number);
  width: 40px; /* plus border */
  border-right: 1px solid var(--primary-opacity1);
  color: var(--grid-team-number-text);
  border-radius: 0 0 0 8px;
}
.top-row > .team-id {
  border-radius: 8px 0 0 0;
}
.mid-row > .team-id {
  border-radius: 8px 0 0 8px;
}
.pic-name {
  display: flex;
  font-weight: bold;
  text-align: left;
  padding: 0 8px;
  background: var(--grid-card-body);
}
.team-pic {
  min-width: 41px;
  height: 41px;
  text-align: center;
  font-size: 24px;
  background-size: 32px 32px;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 8px;
}
.score {
  width: 40px;
  border-left: 1px solid var(--primary-opacity1);
  font-weight: bold;
  color: var(--grid-card-body-text);
  border-radius: 0 0 8px 0;
  background: var(--grid-card-body);
}
.top-row > .score {
  border-radius: 0 8px 0 0;
}
.mid-row > .score {
  border-radius: 0 8px 8px 0;
}
.score.active {
  background-color: var(--primary-main);
  color: #fff;
}
</style>