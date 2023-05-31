<template>
  <!-- <div
    class="start-timer"
    v-if="match && match.start_at"
  >
    {{ formatDate(new Date(match.end_at) - new Date(match.start_at)) }}
  </div> -->
  <div
    class="start-timer"
    v-if="match && match.start_at"
  >
    {{ formatDate(new Date() - new Date(match.start_at)) }}
  </div>
</template>

<script>


export default {
  props: ['match'],
  data() {
    return {
      timerInterval: null,
      timePassed: 0,
    };
  },

  mounted() {
    this.startTimer();
  },
  beforeDestroy () {
    clearInterval(this.timerInterval)
  },

  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timePassed += 1
        if (!this.match || !this.match.start_at) {
          clearInterval(this.timerInterval)
        }
      }, 1000);
    },

    formatDate (s) {
      this.timePassed
      const currentSeconds = s / 1000
      let mm = Math.floor(currentSeconds / 60)
      let ss = Math.floor(currentSeconds % 60 )
      
      if (mm < 10) {
        mm = `0${mm}`
      }
      if (ss < 10) {
        ss = `0${ss}`
      }
      return `${mm}:${ss}`
    },
  }
};
</script>

<style scoped lang="scss">
.start-timer {
  position: absolute;
  font-weight: 500;
  padding: 2px 4px;
  left: -24px;
  top: -20px;
  color: #fff;
  background: dodgerblue;
}
</style>
