<template>
  <div
    class="player-display"
    :class="{
      'justify-right': teamSide === 'left',
      'player-reserve': teamId === null,
      'dragovered': dragOvered
    }"
    :style="{
      width: teamId !== null ? '100%' : 'auto',
    }"
    @drop="onPlayerDrop"
    @dragenter.prevent
    @click="$emit('player-click', {$event, player})"

    @dragover.prevent="onDragover"
    @dragleave="dragOvered = false"
  >
    <div
      :draggable="player.user_id && ofAdmins"
      @dragstart="startDrag"
      @dragend="dragEnd"
      class="role"
      :class="{
        'non-empty': player.user_id,
        ['theme-borders-' + $store.state.main.themeClass]: true,
        'grabbing_enabled': player.user_id && ofAdmins
      }"
      :style="{
        position: 'relative',
        backgroundImage: player.user_id ? 'url(\'/storage/img/profileicon/' + player.avatar + '.png\')' : 'none',
        order: 3 - (teamSide === 'right' ? 1 : 0),
        userSelect: player.user_id ? '' : 'none',
        cursor: player.user_id && ofAdmins ? 'grab' : player.user_id ? 'pointer' : '',
        'border-color': roleToColor[['rtc', 'rtc_se'].includes(this.tType) ? player.site_role : player.role] //['dev', 'mod', 'admin', 'vip'].includes(player.site_role) ? 'darkorange !important' : ''
      }"
    >{{player.user_id ? '' : '♯'}}
      <svg
        v-if="can('admin@view') && teamId !== null"
        style="position: absolute; top: -6px; left: -3px; pointer-events: none;"
        :style="{
          filter: player.status ? (player.status === 'join' ? 'drop-shadow(0 0 3px green)' : 'drop-shadow(0 0 3px red)') : 'drop-shadow(0 0 1px #fff)'
        }"
        width="14" height="16"
        :fill="player.status ? (player.status === 'join' ? 'green' : 'red') : '#505050'"
      >  
        <use :xlink:href="`/img/icons.svg?v=1#lightbulb`"/>
      </svg>
    </div>
    <!-- <div
      class="high-elf"
      :class="{['theme-bg-' + $store.state.main.themeClass]: true}"
      v-if="['dev', 'mod', 'admin', 'vip'].includes(player.site_role)"
      style="position: absolute; bottom: 5px; width: 36px; box-sizing: border-box;"
      :style="{
        'margin-left': teamSide !== 'right' ? '3px' : '',
        'background-color': ['dev', 'mod', 'admin', 'vip'].includes(player.site_role) ? 'darkorange !important' : ''
      }"
    >
      {{ $t('roles.' + player.site_role).substring(0,3) }}
    </div> -->
    <div style="position: absolute; top: 2px; left: 24px; font-size: 13px;">
      {{player.role === 'reserve' || player.role === 'success'? '⭐' : ''}}
    </div>
    <div
      class="copied-tt"
      ref="copytt"
    >
      Скопировано
    </div>
    <div
      class="nickname hide-overflow"
      :style="{ order: teamId !== null ? (3 - (teamSide === 'left' ? 1 : 0)) : 4}"
      :class="{
        myself: user.id === player.user_id
      }"
      @click="copyNick"
    >
      {{player.nickname}}
      <!-- {{player.user_id}} {{ player.role}} -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerDisplay',
  props: [
    'player',
    'teamId',
    'teamSide',
    'tType'
  ],
  data: () => ({
    dragOvered: false,
  }),
  methods: {
    copyNick() {
      if (!this.$refs.copytt.classList.contains('animate-tt')) {
        navigator.clipboard.writeText(this.player.nickname).then(() => {
          this.$refs.copytt.classList.add('animate-tt')
          setTimeout(() => {
            this.$refs.copytt.classList.remove('animate-tt')
          }, 700)
        }, () => {
          this.$notify({
            group: 'n',
            text: 'Провал',
            duration: 1500,
          })
        });
      }
    },
    onDragover() {
      if (this.teamId !== null && this.ofAdmins) {
        this.dragOvered = true
      }
    },
    startDrag(evt) {
      if (this.player.user_id && this.ofAdmins && ['rtc', 'rtc_se'].includes(this.tType)) {
        // this.$refs.ptooltip.style.display = 'none'
        this.$emit('close-tt')
        evt.dataTransfer.dropEffect = 'move'
        evt.dataTransfer.effectAllowed = 'move'
        evt.dataTransfer.setData('pid', this.player.user_id)
      } else return false
    },
    dragEnd() {
      //if its not empty item then hide tt
      // if (this.$refs.ptooltip)
      //   this.$refs.ptooltip.style.display = null
      this.dragOvered = false
      this.$emit('close-tt')
    },
    onPlayerDrop (evt) {
      console.log('cp3434', this.tType)
      if (['rtc', 'rtc_se'].includes(this.tType)) {
        this.dragOvered = false
        const pid = evt.dataTransfer.getData('pid')

        console.log('cp 1119', this.player)
        
        if (pid) {
          if (!this.player.user_id) {
            //dropping on empty player in team
            this.$store.dispatch('tournament/movePlayer', {pid, team: this.teamId, role: this.player.role})
          } else 
          if (this.teamId > 0) {
            //dropping on nonempty in team
            this.$store.dispatch('tournament/swapPlayer', {pid, pid1: pid, pid2: this.player.user_id, team: this.teamId, role: this.player.role})
          } else {
            //dropping on nonempty in reserve
            this.$store.dispatch('tournament/swapPlayer', {pid, pid1: pid, pid2: this.player.user_id, /*inPlace: true,*/ team: this.teamId, role: this.player.role})
          }
          this.$store.dispatch('tournament/tickJustDropped')
        }
      }
    }
  },
  computed: {
    roleToColor () {
      return this.$store.state.main.roleToColor
    },
    ofAdmins() {
      return this.$store.getters['auth/ofAdmins']
    },
    user() {
      return this.$store.state.auth.user
    },
  }
}
</script>

<style lang="scss" scoped>
.player-display {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0;
  transform: translate(0,0);
  /* &:hover>.player-tooltip {
    display: block;
  }
  .player-tooltip:hover {
    display: none;
  } */
}
.player-reserve {
  /* flex-direction: column; */
  min-width: 20%;
  max-width: 20%;
  box-sizing: border-box;
}
.justify-right {
  justify-content: flex-end;
}
.role {
  background-color: #000;
  color: #808191;
  font-size: 30px;
  min-width: 42px;
  width: 42px;
  height: 42px;
  line-height: 32px;
  margin-bottom: 5px;
  border-style: dashed;
  border-width: 3px;
}
.non-empty {
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 12px;
  /* border: 3px solid ;//#615dfa; */
  border-style: solid;
  border-width: 3px;
}
.grabbing_enabled:active {
  cursor: grabbing !important;
}
.nickname {
  position: relative;
  /* user-select: all; */
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  display: flex;
  max-width: 150px;
  font-size: 13px;
  margin: 0 10px;
  color: #808191;
  cursor: pointer;
}
.dragovered {
  .role {
    outline: 2px dotted mediumaquamarine;
    outline-offset: 2px;
  }
}
.myself {
  color: var(--secondary-main);
  font-weight: 600;
}
.copied-tt {
  position: absolute;
  top: -18px; left: 25%;
  background: var(--secondary-main);
  box-shadow: 0 0 10px #333;
  border-radius: 6px;
  padding: 4px 12px;
  color: #fff;
  height: 28px;
  transform-origin: bottom;
  /* transform: scaleY(0); */
  display: none;
  animation: copy-tt;
  animation-duration: 0.7s;
}
.animate-tt {
  display: block;
}
@keyframes copy-tt {
  0% {
    transform: scaleY(0);
  }
  5% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
</style>