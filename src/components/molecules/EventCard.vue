<template>
  <div
    class="event-card"
    :class="{
      'small-card': cardSize === 'small'
    }"
    :style="{
      'background-image': `url(${bgpic})`
    }"
    
  >
    <div class="left">
      <h5 class="reg-status">{{$t('tournaments.reg-status-' + regStatus)}}</h5>
      <h2 class="card-title">{{cardTitle}}</h2>
      <TimeCounter
        :initTime="startingDate"
        :cardSize="cardSize"
        class="tc-margin"
      />
      <button
        class="reg-btn"
      >
        {{$t('tournaments.register-btn')}}
      </button>
    </div>
    <div class="right">
      <div class="skill-limiters-wrapper">
        <div class="skill-limiter">
          Платина 5
        </div>
        <div class="skill-limiter">
          Платина 1
        </div>
      </div>
      <div class="players-num">
        {{$t('tournaments.players-registered')}}:
        <span class="red">13/24</span>
      </div>
    </div>
  </div>
</template>

<script>
import TimeCounter from '@/components/atoms/TimeCounter.vue'

export default {
  components: { TimeCounter },
  props: [
    'cardSize',
    'regStatus',
    'cardTitle',
    'bgpic',
    'startingDate'
  ],
  data: () => ({
  
  }),
  methods: {
  
  }
};
</script>
<style lang="scss" scoped>
.event-card {
  /* UNIVERSAL */
  display: flex;
  border-radius: 12px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: left;
  text-transform: uppercase;

  /* FOR BIG CARD: */
  padding: 36px;
}
.left {
  margin-right: 16px;
}
.reg-status {
  color: rgb(255,76,51);
  font-size: 11px;
  margin-bottom: 18px;
}
.card-title {
  color: #fff;
  font-size: 22px;
  margin-bottom: 20px;
}
.reg-btn {
  background-color: rgb(255,76,51);
  border-radius: 8px;
  font-size: 12px;
  padding: 14px;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  user-select: none;
  &:hover {
    box-shadow: 0 0 8px #ddd;
  }
}
.right {
  color: rgb(19,37,61);
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
}
.skill-limiters-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
  flex: 1;
}
.skill-limiter {
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  width: 106px;
  vertical-align: bottom;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-image: url('/img/platinum.png');
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: center 40%;
}
.players-num {
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
}
.red {
  color: red;
}
.tc-margin {
  margin-bottom: 30px;
}


/* SMALL CARD */
.event-card.small-card {
  padding: 18px;
  .reg-status {
    color: rgb(255,76,51);
    font-size: 9px;
    margin-bottom: 10px;
  }
  .card-title {
    color: #fff;
    font-size: 18px;
    margin-bottom: 12px;
  }
  .reg-btn {
    font-size: 9px;
    padding: 8px;
  }
  .right {
    font-size: 9px;
    margin-top: 22px;
  }
  .skill-limiters-wrapper {
    margin-bottom: 16px;
  }
  .skill-limiter {
    padding: 6px;
    width: 72px;
    background-size: 60% 60%;
    background-position: center 40%;
  }
  .players-num {
    padding: 7px;
  }
  .tc-margin {
    margin-bottom: 16px;
  }
}
</style>