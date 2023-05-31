<template>
  <div class="screen-full card users-wrapper">
    <h2>Админка юзеров</h2>
    <div v-if="!inLoading">
      <table v-if="players && players.length">
        <thead>
          <tr>
            <td>ID</td>
            <td></td>
            <td>Никнейм</td>
            <td>MMR</td>
            <td>Статус</td>
            <td>Соц сети</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, pidx) in players" :key="pidx"
            style="user-select: text;"
          >
            <td>{{p.user_id}}</td>
            <td>
              <img
                @click="playerClick($event, p.user_id)"
                class="ratings-avatar tooltip-trigger"
                :src="'/storage/img/profileicon/' + p.avatar + '.png'"
                alt="ava"
                style="margin-right: 10px; cursor: pointer;"
              >
            </td>
            <td>
              <a
                :href="'/profiles/' + p.user_id"
                target="_blank"
                style="color: var(--primary-text); display: flex; align-items: center; justify-content: flex-start;"
              >
                {{p.account.nickname}}
              </a>
            </td>
            <td>2000?</td>
            <td style="color: red;">Забанен</td>
            <td>
              <a
                href="http://www.google.com"
                target="_blank"
                class="soc-link"
                style="text-align: center;"
                :style="{
                  'background-color': socColors[0]
                }"
              >
                <img class="soc-icon" :src="`/img/icons/${socTypes[0]}.svg`" :alt="$t(`login-modal.${socTypes[0]}`)">
              </a>
              <a
                href="http://www.google.com"
                target="_blank"
                class="soc-link"
                style="text-align: center;"
                :style="{
                  'background-color': socColors[1]
                }"
              >
                <img class="soc-icon" :src="`/img/icons/${socTypes[1]}.svg`" :alt="$t(`login-modal.${socTypes[1]}`)">
              </a>
              <a
                href="http://www.google.com"
                target="_blank"
                class="soc-link"
                style="text-align: center;"
                :style="{
                  'background-color': socColors[2]
                }"
              >
                <img class="soc-icon" :src="`/img/icons/${socTypes[2]}.svg`" :alt="$t(`login-modal.${socTypes[2]}`)">
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        -
      </div>
    </div>
    <div v-else style="height: 250px; line-height: 250px;">
      Загрузка...
    </div>
    <Tooltip
      :isShown="showTT"
      :x="tooltipX" :y="tooltipY"
      @close="showTT = false"
      :data="tolltipData"
    />
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import WinrateMixin from '@/utility/WinrateMixin.js'
import Tooltip from '@/components/atoms/Tooltip.vue'

export default {
  components: { Tooltip },
  mixins: [WinrateMixin],
  data() {
    return {
      players: [],
      tooltipX: 500,
      tooltipY: 300,
      showTT: false,
      tolltipData:  {
        "user_id": 1,
        "role": null,
        "round": 37,
        "team": null,
        "nickname": "Player_Bhr3t",
        "avatar": "4644",
        "exp": 2250,
        "site_role": "admin",
        "grid_id": null,
        "note": null,
        "profile": {
          "user_id": 1,
          "game": "lol",
          "mmr": {
            "league": "gold",
            "division": 2
          },
          "priority": "10",
          "roles": [
            "top",
            "mid",
            "jung",
            "adc",
            "sup"
          ],
          "elo": 1500
        },
        "statistics": null
      } ,
      socTypes: ['vkontakte', 'twitch', 'discord'],
      socColors: ['#4c75a3', '#6441a5', '#8A9CFE'],
    }
  },
  computed: {
    // bannersList() {
    //   return this.$store.state.adminBanners.bList;
    // },
    inLoading() {
      // return this.$store.state.adminUsers.inLoading
      return false
    }
  },
  methods: {
    // playerClick({$event, player}) {      
    playerClick($event, pid) {      
    // let targ = $event.target
      // if (targ.classList.contains('role') && targ.classList.contains('non-empty')) {
        if (this.tolltipData.user_id === pid) {
          this.showTT = !this.showTT
        } else {
          // let properOffsetX = targ.offsetLeft + targ.parentElement.offsetLeft + targ.parentElement.parentElement.offsetLeft
          // let properOffsetY = targ.offsetTop + targ.parentElement.offsetTop + targ.parentElement.parentElement.offsetTop
          let properOffsetX = $event.pageX - $event.offsetX
          let properOffsetY = $event.clientY - $event.offsetY + 200
          this.tooltipX = properOffsetX
          this.tooltipY = properOffsetY
          // this.tolltipData = {} //getting data when, and should there be any new data?
          this.showTT = true
        }
        // $event.stopPropagation()
      // }
    },
    closeTT() {
      this.showTT = false
    },

    fetchData() {
      axiosInstance
        .get('/api/ratings?date=2021-03')
        .then(resp => {
          console.log(resp)
          this.players = resp.data//.sort((a,b) => Number(a.id) - Number(b.id))
        })
        .catch(err => {
          this.$notify({
            group: 'n',
            text: 'Ошибка. ' + err,
            type: 'success'
          })
        })
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  }
};
</script>

<style lang="scss" scoped>
.users-wrapper {
  width: 100%;
  /* border: 1px solid #ccc; */
  padding: 15px;
  border-radius: 10px;
  position: relative;
  max-width: 1044px;
  margin: 10px auto;
}
.u-row {
  width: 100%;
  display: flex;
  padding: 6px 0;
  
  &:hover {
    outline: 1px dashed orange;;
  }
}
.u-path {
  background-size: 100% auto;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  color: #fff;
  text-shadow: 1px 1px #000, -1px -1px #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
h2 {
  margin-bottom: 16px;
}

.soc-link {
  position: relative;
  display: inline-block;
  background-color: var(--secondary-main);
  margin: 0;
  border-radius: 6px;
  margin: 3px 5px;
  padding: 4px;
  width: 40px;
  color: #ddd;
  text-transform: uppercase;
  /* margin-right: 10px; */
  flex: 1;
  &:hover {
    filter: brightness(1.2);
  }
  &[disabled='disabled'] {
    cursor: auto;
    pointer-events: none;
  }
}
.soc-icon {
  /* margin-top: 5px; */
  height: 20px;
  stroke: var(--primary-text);
}
table tr:hover {
  outline: 1px dashed orange;
}
</style>