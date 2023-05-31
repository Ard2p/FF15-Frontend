<template>
  <div
    class="time-counter"
    :class="{ 'small-c': cardSize === 'small'}"
  >
    <div class="the-day-wrapper">
      <div class="init-day">{{initDay}}</div>
      <div class="init-month">{{$t(`tournaments.months`)[initMonth]}}</div>
    </div>
    <div class="unit-wrapper">
      <div class="unit-number">{{getDaysLeft}}</div>
      {{$t(`tournaments.day`)}}
    </div>
    <div class="unit-wrapper">
      <div class="unit-number">{{getHoursLeft}}</div>
      {{$t(`tournaments.hour`)}}
    </div>
    <div class="unit-wrapper">
      <div class="unit-number">{{getMinsLeft}}</div>
      {{$t(`tournaments.min`)}}
    </div>
    <div class="unit-wrapper">
      <div class="unit-number">{{getSecsLeft}}</div>
      {{$t(`tournaments.sec`)}}
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'initTime',
    'cardSize'
  ],
  data: () => ({
    timeValue: 0
  }),
  mounted() {
    this.timeValue = new Date() - new Date(this.initTime)
    this.timer = setInterval(() => this.timeValue = new Date() - new Date(this.initTime), 1000)
  },
  methods: {
    
  },
  computed: {
    initDay() {
      return new Date(this.initTime).getDate()
    },
    initMonth() {
      return new Date(this.initTime).getMonth()
    },
    getDaysLeft() {
      return ~(this.timeValue / (1000 * 60 * 60 * 24))
    },
    getHoursLeft() {
      let hoursLeftInSecs = this.timeValue + (~(this.timeValue / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24))
      return ~(hoursLeftInSecs / (1000 * 60 * 60))
    },
    getMinsLeft() {
      let MinsLeftInSecs = this.timeValue + (~(this.timeValue / (1000 * 60 * 60)) * (1000 * 60 * 60))
      return ~(MinsLeftInSecs / (1000 * 60) / 2)
    },
    getSecsLeft() {
      let secsLeft = this.timeValue + (~(this.timeValue / (1000 * 60)) * (1000 * 60))
      return ~(secsLeft / (1000) / 2)
    }
  }
};
</script>
<style lang="scss" scoped>
.time-counter {
  display: flex;
  color: white;
  user-select: none;
}
.the-day-wrapper {
  text-align: center;
  background-color: rgb(255,76,51);
  border-radius: 8px;
  width: 66px; height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.init-day {
  font-size: 22px;
  font-weight: 600;
}
.init-month {
  font-size: 14px;
}
.unit-wrapper {
  font-size: 12px;
  margin-left: 7px;
  text-align: center;
  font-weight: 600;
}
.unit-number {
  border-radius: 6px;
  background-color: rgb(19,37,61);
  font-size: 18px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
}

/* SMALL */
.time-counter.small-c {
  .the-day-wrapper {
    width: 44px; height: 44px;
  }
  .init-day {
    font-size: 14px;
  }
  .init-month {
    font-size: 9px;
  }
  .unit-wrapper {
    font-size: 9px;
    margin-left: 5px;
  }
  .unit-number {
    font-size: 14px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 3px;
  }
}
</style>