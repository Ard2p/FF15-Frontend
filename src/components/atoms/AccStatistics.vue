<template>
  <div class="acc-statistics">
    <div class="stat-some stat-katana">{{win}}</div>
    <div class="stat-some stat-coin">{{lose}}</div>
    <div class="stat-some stat-cup">{{winrate(win, lose)}}%</div>
  </div>
</template>

<script>
import WinrateMixin from '@/utility/WinrateMixin.js'
export default {
  mixins: [WinrateMixin],
  props: [
    'win',
    'lose'
  ]
}
</script>

<style scoped>
.acc-statistics {
  margin: 0;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  color: var(--primary-main);
}
.stat-katana {
  background: url('/img/icons/stats/katana.svg');
}
.stat-coin {
  background: url('/img/icons/stats/coin.svg');
}
.stat-cup {
  background: url('/img/icons/stats/cup.svg');
}
.stat-some {
  background-size: 18px 18px;
  background-position: 0 50%;
  background-repeat: no-repeat;
  padding-left: 20px;
}
</style>