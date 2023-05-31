<template>
  <div v-if="timeLeft > 0" class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          :class="remainingPathColor"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    <!-- {{timeFraction}} -->
  </div>
  <div v-else class="base-timer">
    Время вышло
  </div>
</template>

<script>
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

// const TIME_LIMIT = 60 * 15;

export default {
  props: ['prep'],
  data() {
    return {
      timePassed: 0,
      timerInterval: null
    };
  },

  computed: {
    
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
    //   const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

        const d1 = new Date(this.prep)
        const d2 = new Date()
        const m15 = 1000 * 60 * 15
        const currentSeconds = (d1 - d2 + m15) / 1000
        let mins = Math.floor(currentSeconds / 60)
        let secs = Math.floor(currentSeconds % 60)
        if (secs < 10) {
            secs = `0${secs}`
        }
        if (mins < 10) {
            mins = `0${mins}`
        }
      return `${mins}:${secs}`
    //   return `${minutes}:${seconds}`;
    },

    timeLeft() {
        this.timePassed
        const d1 = new Date(this.prep)
        const d2 = new Date()
        const m15 = 1000 * 60 * 15
      return d1 - d2 + m15
      //TIME_LIMIT - this.timePassed;
    },

    timeFraction() {
    //   const rawTimeFraction = this.timeLeft / TIME_LIMIT;
    //   return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        const d1 = new Date(this.prep)
        const d2 = new Date()
        const m15 = 1000 * 60 * 15
        return (d2 - d1) / m15
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;

    //   if (this.timeLeft <= alert.threshold) {
    //     return warning.color;
    //   } else if (this.timeLeft <= warning.threshold) {
    //     return info.color;
    //   } else {
    //     return alert.color;
    //   }
    if (this.timeFraction < 0.2) {
        return info.color
    } else if (this.timeFraction < 0.6) {
        return warning.color
    } else {
        return alert.color
    }
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue <= 0) {
        this.onTimesUp();
      }
    }
  },

  mounted() {
    this.startTimer();
  },

  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval);
    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.base-timer {
  position: absolute;
  width: 40px;
  height: 40px;
  right: -42px;
  top: -12px;
  color: var(--grid-card-body-text);

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}
</style>
