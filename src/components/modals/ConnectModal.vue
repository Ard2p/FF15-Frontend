<template>
  <div>
    <div
      class="modal-bg-darkness"
      @click="close"
      v-show="cmOpen"
    />
    <div
      class="connect__inner"
      :style="{
        'transform': cmOpen ? 'scale(1)' : 'scale(0)'
      }"
    >
      <button
        class="close-btn"
        @click="$store.dispatch('main/closeCModal')"
        :title="$t('login-modal.close-hint')"
      >
        &times;
      </button>
      <h2>{{$t('connectModal.header')}}</h2>
      <div class="game-label" style="text-align: right; margin-top: -10px;">
        {{
          (game in games)
            ? games[game]
            : game
        }}
      </div>
      
      
      
      
      <!-- THE FORMS (DEPENDING ON step) -->
      <div class="connect__screen" v-if="step < 3">
        <div style="text-align: left;">
          {{stepCurrentTip}} {{nameChecked ? Ok: ''}}
        </div>
        <div class="line">
          <div
            class="connect__avatar"
            :style="{
              backgroundImage: avatarIcon(generatedPic)
            }"
            v-if="generatedPic > -1"
          />
          <input
            :disabled="step > 1"
            type="text"
            style="width: 100%; transition-duration: .4s;"
            class="field__input"
            v-model="accName"
          >
        </div>
        <div class="line">
          <button class="soc-btn" v-if="!stepLoading" @click.stop="pushStep">
            Проверить
          </button>
          <div style="margin: auto;" class="small-loader" v-else-if="stepLoading"></div>
        </div>
        <div class="line" v-if="!stepLoading && step > 1">
          <button class="soc-btn cancel-btn" v-if="!stepLoading && step > 1" @click="doStepBack">Назад</button>
        </div>
      </div>




      <div class="connect__screen" v-else-if="step === 3">
        <div class="leag-rank-wrap">

          <!-- LEAGUE -->
          <div style="width: 70%;">
            <div class="field__label" style="margin-bottom: 10px; user-select: none; color: #808191;">Выберите максимальный ранг одиночной очереди за год</div>
            <!-- <select v-model="leagPicked">
              <option v-for="leag_key in Object.keys(getLeague)" :key="leag_key" :value="leag_key">{{leag_key}}</option>
            </select> -->
            <div
              class="dropdown js-dropdown"
              style="flex-grow: 2; width: 100%; margin-left: 0;"
              :class="leagSelectOpen ? 'active' : ''"
              v-click-outside="leagSelectClose"
            >
              <div
                class="dropdown__head js-dropdown-head"
                @click="leagSelectOpen = !leagSelectOpen"
                :class="{
                  moon: theme === 'moon',
                  'filter-active': leagPicked !== 'wat'
                }"
                style="background: var(--primary-decor4);"
              >
                <img v-if="leagPicked" width="28" height="28" :src="`/img/rank-icons/${leagPicked}.png`">
                <span v-if="leagPicked" style="margin-left: 5px;">
                  {{ $t('lol.leagues.' + leagPicked) }}
                </span>
              </div>
              <div
                class="dropdown__body js-dropdown-body"
                v-if="leagSelectOpen"
              >
                <a
                  class="dropdown__item"
                  v-for="leag_key in Object.keys(getLeague)" :key="leag_key"
                  @click="leagPicked = leag_key; leagSelectOpen = false"
                  :class="{
                    moon: theme === 'moon'
                  }"
                  style="cursor: pointer"
                >
                  <img width="28" height="28" :src="`/img/rank-icons/${leag_key}.png`">
                  <div
                    class="dropdown__title title"
                    :style="{
                      color: leagPicked === leag_key ? 'var(--primary-main)' : ''
                    }"
                    style="margin-left: 5px;"
                  >
                    {{ $t('lol.leagues.' + leag_key) }}
                  </div>
                </a>
              </div>
            </div>
          </div>
        
          <!-- RANK -->
          <div style="width: 26%;" v-if="!['master', 'grandmaster', 'challenger'].includes(leagPicked)">
            <div
              class="field__label"
              style="margin-bottom: 10px; user-select: none; color: #808191;"
              v-if="leagPicked"
            >
              Выберите дивизион
            </div>
            <div
              class="dropdown js-dropdown"
              style="flex-grow: 2; width: 100%; margin-left: 0;"
              :class="rankSelectOpen ? 'active' : ''"
              v-click-outside="rankSelectClose"
              v-if="leagPicked"
            >
              <div
                class="dropdown__head js-dropdown-head"
                @click="rankSelectOpen = !rankSelectOpen"
                :style="{
                  'pointer-events': !['master', 'grandmaster', 'challenger'].includes(leagPicked) ? 'auto' : 'none'
                }"
                :class="{
                  moon: theme === 'moon',
                  
                }"
                style="background: var(--primary-decor4);"
              >
                <!-- 'filter-active': leagPicked !== 'wat' -->
                <span v-if="rankPicked" style="margin: 0 auto;">
                  {{ ['0', 'I','II','III','IV','V','VI','VII','VIII','IX','X'][rankPicked] }}
                </span>
              </div>


              <div
                class="dropdown__body js-dropdown-body"
                v-if="rankSelectOpen"
              >
                <a
                  class="dropdown__item"
                  v-for="range_key in Object.keys(getLeague[leagPicked])" :key="range_key"
                  @click="rankPicked = range_key; rankSelectOpen = false"
                  :class="{
                    moon: theme === 'moon'
                  }"
                  style="cursor: pointer"
                >
                  <div
                    class="dropdown__title title"
                    :style="{
                      color: rankPicked === range_key ? 'var(--primary-main)' : ''
                    }"
                    style="margin: 0 auto;"
                  >
                    {{ ['0', 'I','II','III','IV','V','VI','VII','VIII','IX','X'][range_key] }}
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- <div class="line" v-if="leagPicked">
          <div v-for="range_key in Object.keys(getLeague[leagPicked])" :key="range_key">
            <input type="radio" name="divv" :value="range_key" v-model="rankPicked">
            <div>{{ range_key }} ({{ getLeague[leagPicked][range_key] }})</div>
          </div>
        </div> -->

        <div class="line" style="flex-direction: column; min-width: 100%;" @dragover.prevent @dragenter.prevent>
          <div
            style="color: #808191; pointer-events: none; user-select: none;"
            class="field__label"
            @dragover.prevent
            @dragenter.prevent
          >
            Расставьте приоритет ролей по убыванию
          </div>
          <div style="display: flex; margin: 0 auto;" @dragover.prevent>
            <div
              v-for="(role, idx) in pickedRoles" :key="role"
              class="role-item"
              draggable="true"
              :data-key="idx"
              @dragstart="dragstartHandler"
              @dragover="dragoverHandler"
              @drop.prevent
            >    
              <img
                width="64"
                height="64"
                style="pointer-events:none;"
                :src="`/img/rank-icons/${role}.png`"
                :alt="role"
                :title="role"
              >
            </div>
          </div>
        </div>
        <button v-if="!stepLoading" class="soc-btn" @click="pushStep">Сохранить</button>
        <div class="small-loader" v-else-if="stepLoading"></div>
      </div>


      <div v-if="step1Status !== ''" class="line" style="margin-top: 20px; font-weight: 800;">
        {{ step1Status }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectModal',
  props: ['uid', 'game'],
  data: () => {
    return {
      nameChecked: false,
      accName: '',
      leagPicked: undefined,
      rankPicked: undefined,
      pickedRoles: ["top", "mid", "jung", "adc", "sup"],
      draggedIdx: -1,
      games: {'lol': 'League of Legends'},
      leagSelectOpen: false,
      rankSelectOpen: false
    }
  },
  methods: {
    leagSelectClose() {
      this.leagSelectOpen = false
    },
    rankSelectClose() {
      this.rankSelectOpen = false
    },
    close($event) {
      if (!$event.target.closest('.modal-bg-darkness') || $event.target.classList.contains('modal-bg-darkness')) {
        this.$store.dispatch('main/closeCModal')
      }
    },
    pushStep() {
      if (this.step === 1)
        this.$store.dispatch('auth/connectCheckName', { accName: this.accName, game: this.game })
      else if (this.step === 2)
        this.$store.dispatch('auth/connectCheckAcc', { game: this.game })
      else if (this.step === 3) {
        this.$store.dispatch('auth/connectSave', {
          league: this.leagPicked,
          division: ['master', 'grandmaster', 'challenger'].includes(this.leagPicked) ? "1" : this.rankPicked,
          game: this.game,
          roles: this.pickedRoles
        })
      }
    },
    doStepBack() {
      //check what step it is
      this.$store.dispatch('auth/doStepBack')
    },
    avatarIcon(pid) {
      return `url('https://ddragon.leagueoflegends.com/cdn/10.14.1/img/profileicon/${pid}.png')`
    },
    dragstartHandler(ev) {
      this.draggedIdx = ev.srcElement.attributes['data-key'].value
      ev.dataTransfer.setData("text", ev.srcElement.attributes['data-key'].value);
      //should it be filled from elements data attribute
    },
    dragoverHandler(ev) {
      ev.preventDefault()
      // console.log(ev.target.attributes['data-key'])
      // console.log(ev.target.attributes['data-key'].value)
      
      let dragoveredIdx = ev.srcElement.attributes['data-key'].value
      // console.log(this.dragoveredIdx)

      if ((this.draggedIdx > -1) && dragoveredIdx !== this.draggedIdx) {
        let tmp = this.pickedRoles[this.draggedIdx]
        let tmp2 = this.pickedRoles[dragoveredIdx]
        this.$set(this.pickedRoles, this.draggedIdx, tmp2)       
        this.$set(this.pickedRoles, dragoveredIdx, tmp)
        this.draggedIdx = dragoveredIdx
      }
      // ev.dataTransfer.setData("target", ev.target);
    },
    hotKeysModal(event) {
      if (event.key === "Escape") {
        this.$store.dispatch('main/closeCModal')
      }
    },
  },
  computed: {
    cmOpen() {
      return this.$store.state.main.connectModalOpen
    },
    stepCurrentTip() {
      return this.$store.state.auth.connect.stepCurrentTip
    },
    step() {
      return this.$store.state.auth.connect.step
    },
    stepLoading() {
      return this.$store.state.auth.connect.loading
    },
    step1Status() {
      return this.$store.state.auth.connect.step1Status
    },
    generatedPic() {
      return this.$store.state.auth.connect.generatedPic
    },
    getLeague() {
      return this.$store.state.auth.connect.league
    },
    theme() {
      return this.$store.state.main.theme
    }
  },
  mounted() {
    this.$store.dispatch('auth/doStepBack')
    document.addEventListener("keydown", this.hotKeysModal)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.hotKeysModal)
  },
  
  watch: {
    cmOpen(newVal) {
      if (newVal === true) {
        Object.assign(this.$data, this.$options.data.call(this))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-bg-darkness {
  position: fixed;
  z-index: 15;
  background-color: #222d;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  width: 100%;
  height: 100%;
  transition: all 0.25s ease-out;
  overflow: hidden;
}
.connect__inner {
  z-index: 20;
  position: fixed;
  top: calc(50vh - 320px);
  left: calc(50vw - 0px);
  width: 420px;
  border-radius: 24px;
  padding: 32px;
  background-color: var(--primary-opacity1);
  transition-duration: .25s;
  & h2 {
    margin-bottom: 48px;
    text-align: left;
  }
  &>a {
    line-height: 28px;
  }
}

.connect__avatar {
  margin-right: 6px;
  min-width: 64px;
  max-width: 64px;
  height: 64px;
  line-height: 64px;
  background-size: 100% 100%;
  background-color: black;
  border: 1px solid black;
  border-radius: 5px;
}
.role-item {
  /* border: 1px solid black; */
  margin: 5px;
  /* padding: 5px; */
  cursor: grab;
  min-width: 32px;
}
.role-item:active {
  cursor: grabbing;
}
.close-btn {
  position: absolute;
  font-size: 24px;
  line-height: 40px;
  width: 48px;
  height: 48px;
  color: var(--primary-text);
  font-weight: 600;
  top: 16px; right: 16px;
  border-radius: 100%;
  &:hover {
    box-shadow: 0 5px 20px var(--shadow6);
  }
}


.game-label {
  user-select: none;
  height: 48px;
  padding: 0 0px 0 0px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-weight: 600;
  color: var(--primary-text2);
  /* margin: 3px; */
  font-size: 16px;
  transition: all .25s;
  z-index: 9;
  margin-bottom: 20px;
}
.field__input {
  height: 56px;
  padding: 0 22px;
}
.soc-btn {
  user-select: none;
  background-color: var(--primary-main);
  width: 100%;
  border-radius: 12px;
  line-height: 38px;
  color: #ddd;
  font-size: 14px;
  font-weight: 600;
  height: 56px;
  &:hover {
    filter: brightness(1.2);
  }
}
.cancel-btn {
  color: var(--primary-text);
  background-color: var(--third);
  &:hover {
    filter: brightness(0.9);
  }
}

.leag-rank-wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 30px;
}
/* .moon img {
  filter: brightness(1) drop-shadow(0px 0px 2px #fff);;
} */
</style>