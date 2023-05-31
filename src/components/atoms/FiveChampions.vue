<template>
  <div class="acc-champs" style="position: relative">
    <div
      v-for="champ in champions"
      :key="champ.id"
      class="char-wrap"
    >
      <Avatar
        :pic="champ.icon"
        mode="abstract" role="abstract"
        :size="32"
      />
      <pre
        class="char-tooltip"
        v-html="champ.name + '\nИгр: ' + champ.games"
      />
    </div>
    <div
      v-for="shadow of 5 - champions.length"
      :key="shadow"
      style="width: 32px; height: 32px;"
    />
  </div>
</template>
<script>
import Avatar from '@/components/quarks/Avatar'

export default {
  name: 'InnerProfile',
  components: { Avatar },
  props: ['champions']
}
</script>

<style lang="scss" scoped>
.acc-champs {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
}
.char-tooltip {
  position: absolute;
  padding: 8px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  bottom: 32px;
  opacity: 0;
  transition-duration: .2s;
  pointer-events: none;
}
.char-wrap:hover > .char-tooltip {
  opacity: 1;
}
</style>