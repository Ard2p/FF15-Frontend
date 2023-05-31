<template>
  <div class="events-wrapper">
    <EventCard
      cardSize="big"
      regStatus="open"
      cardTitle="RTK Platinum Cup #1"
      bgpic="/img/bg/bg2.jpg"
      class="e-card-outer"
      style="width: 100%;"
      :startingDate="new Date('12/24/2020')"
    />
    <EventCard
      v-for="cidx in 4" :key="'evt_' + cidx"
      cardSize="small"
      :regStatus="fakeRegStatuses[cidx - 1]"
      :cardTitle="fakeCardTitles[cidx - 1]"
      :bgpic="fakeBGPics[cidx - 1]"
      :startingDate="new Date(`11/${11 + (cidx * 2)}/2020 ${(cidx * 4)}:${(cidx * 10)}`)"
      class="e-card-outer"
    />
  </div>
</template>

<script>
import EventCard from '@/components/molecules/EventCard.vue'

export default {
  components: { EventCard },
  data: () => ({
    fakeRegStatuses: ['open', 'closed', 'unknobn', 'vip'],
    fakeCardTitles: ['RTK Platinum Cup #2', 'RTK Smth', 'Random Tourno abcd', 'Adepts of Agartha'],
    fakeBGPics: ['/img/bg/bg1small.jpg', '/img/bg/bg2small.jpg', '/img/bg/mainsmall.jpg', '/img/bg/news.jpg']
  }),
  methods: {
  
  }
};
</script>

<style lang="scss" scoped>
.events-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
}
.e-card-outer {
  width: calc(50% - 10px);
  margin-bottom: 20px;
}
.e-card-outer:nth-child(even) {
  margin-right: 20px;
}
</style>