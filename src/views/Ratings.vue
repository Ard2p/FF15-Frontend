<template>
  <div class="ratings screen">
    <div class="card" style="min-height: 600px;">
      <div style="display: flex; justify-content: space-between;">
        <h2 style="text-align: left; color: var(--primary-text);">Рейтинг</h2>
        <div
          class="dropdown js-dropdown"
          style="flex-grow: 1; max-width: 33%; margin-left: 0; margin-right: 20px; z-index: 0;"
          :class="seasonOpen ? 'active' : ''"
          v-click-outside="close"
        >
        <div
            class="dropdown__body js-dropdown-body"
            v-if="seasonOpen"
          >
            <a
              class="dropdown__item"
              v-for="(opt, ridx) in seasonOptions" :key="opt.y + '-' + opt.m0"
              @click="seasonSelected = ridx; seasonOpen = false; fetchData()"
              :class="{
                moon: theme === 'moon'
              }"
              style="cursor: pointer"
            >
              <div
                class="dropdown__title title"
                :style="{
                  color: seasonSelected === ridx ? 'var(--primary-main)' : ''
                }"
                style="margin: 0 auto;"
              >
                {{ opt.m1 + ' ' + opt.y }}
              </div>
            </a>
          </div>
          <div
            class="zind-fix dropdown__head js-dropdown-head"
            @click="seasonOpen = !seasonOpen;"
            :class="{
              moon: theme === 'moon',
              
            }"
            style="background: var(--primary-decor4);"
          >
            <span v-if="seasonSelected || seasonSelected === 0" style="margin: 0 auto;">

              {{ seasonOptions[seasonSelected].m1 + ' ' + seasonOptions[seasonSelected].y }}
            </span>
            <span v-else style="color: #808191; text-align: center;">Сезон</span>
            <svg class="icon icon-arrow-down">
              <use xlink:href="/img/icons.svg#icon-arrow-down"/>
            </svg>
          </div>
        </div>
      </div>
      <Loader
        style="position: absolute; top: calc(50vh - 200px); left: calc(50% - 100px)"
        v-if="isLoading"
      />
      <table v-else-if="players && players.length">
        <thead>
          <tr>
            <td>№</td>
            <td>Игрок</td>
            <td>Очки</td>
            <td>Уровень</td>
            <td>Игр</td>
            <td>Побед</td>
            <td>%</td>
            <td>Показатели</td>
            <td>КДА</td>
          </tr>
        </thead>
        <tbody>
          <tr v-if="self" style="font-weight: 700;  border: 2px solid var(--primary-main);">
            <td>{{(players.findIndex(p => p.user_id === user.id) + 1) || 9999}}</td>
            <td>
              <router-link
                :to="'/profiles/' + self.user_id"
                style="color: var(--primary-text); display: flex; align-items: center; justify-content: flex-start;"
              >
                <Avatar
                  :pic="self.avatar"
                  :role="self.role"
                  style="margin-right: 10px;"
                />
                {{self.account.nickname}}
              </router-link>
            </td>
            <td style="color: #6AA121;">{{Math.round(self.points)}}</td>
            <td>{{Math.floor(self.exp/1000)}}</td>
            <td>{{Number(self.win) + Number(self.lose)}}</td>
            <td>{{self.win}}</td>
            <td :style="{
              'color': winrate(self.win, self.lose) > 49 ? 'green' : 'salmon'
            }">{{winrate(self.win, self.lose)}}</td>
            <td>
              <div style="display: flex">
                <div style="flex-grow: 1; color: #6AA121;">
                  {{self.k}}
                </div>
                <div style="flex-grow: 1; color: #F70D1A;">
                  {{self.d}}
                </div>
                <div style="flex-grow: 1; color: #FFD801;">
                  {{self.a}}
                </div>
              </div>
            </td>
            <td>{{Math.round(((self.k + self.a) / self.d) * 100) / 100}}</td>
          </tr>
          <tr
            v-for="(p, pidx) in players" :key="pidx"
            style="user-select: text;"
            :style="{
              'font-weight': (p.user_id === user.id) ? 600 : ''
            }"
          >
            <td>{{pidx + 1}}</td>
            <td>
              <router-link
                :to="'/profiles/' + p.user_id"
                style="color: var(--primary-text); display: flex; align-items: center; justify-content: flex-start;"
              >
                <Avatar
                  :pic="p.avatar"
                  :role="p.role"
                  style="margin-right: 10px;"
                />
                {{p.account.nickname}}
              </router-link>
            </td>
            <td style="color: #6AA121;">{{Math.round(p.points)}}</td>
            <td>{{Math.floor(p.exp/1000)}}</td>
            <td>{{Number(p.win) + Number(p.lose)}}</td>
            <td>{{p.win}}</td>
            <td :style="{
              'color': winrate(p.win, p.lose) > 49 ? 'green' : 'salmon'
            }">{{winrate(p.win, p.lose)}}</td>
            <td>
              <div style="display: flex">
                <div style="flex-grow: 1; color: #6AA121;">
                  {{p.k}}
                </div>
                <div style="flex-grow: 1; color: #F70D1A;">
                  {{p.d}}
                </div>
                <div style="flex-grow: 1; color: #FFD801;">
                  {{p.a}}
                </div>
              </div>
            </td>
            <td>{{Math.round(((p.k + p.a) / p.d) * 100) / 100}}</td>
            
          </tr>
        </tbody>
      </table>
      <div v-else style="margin-top: 200px;">
        Рейтинг пока что пуст
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/quarks/Avatar'
import axiosInstance from '@/store/axiosInstance.js'
import WinrateMixin from '../utility/WinrateMixin.js'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'Ratings',
  mixins: [WinrateMixin],
  components: {
    Loader,
    Avatar
  },
  data: () => {
    return {
      players: [],
      seasonOpen: false,
      seasonSelected: 0,
      isLoading: false
    }
  },
  methods: {
    close () {
      this.seasonOpen = false
    },
    fetchData() {
      this.isLoading = true
      const query = `?date=${this.seasonOptions[this.seasonSelected].y + '-' + this.seasonOptions[this.seasonSelected].m0}`
      axiosInstance
        .get('/api/ratings' + query)
        .then(resp => {
          this.players = resp.data//.sort((a,b) => Number(a.id) - Number(b.id))
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
          this.$notify({
            group: 'n',
            text: 'Ошибка. ' + err,
            type: 'success'
          })
        })
    },
  },
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  computed: {
    seasonOptions () {
      const d = new Date()
      const lastYear = Number(d.getFullYear())
      let lastMonth = Number(d.getMonth())
      const opts = []
      for (let yidx = 2021; yidx <= lastYear; yidx++) {
        for (let midx = yidx === 2021 ? 2 : 0; midx <= 11; midx++) {
          opts.push({y: yidx, m0: String(midx + 1).padStart(2, 0), m1: this.$t('tournaments.months')[midx]})
          if (yidx === lastYear && midx === lastMonth) {
            break
          }
        }
        
      }
      opts.reverse()
      return opts
    },
    theme () {
      return this.$store.state.main.theme
    },
    self() {
      return this.players.find(p => p.user_id === this.user.id)
    },
    user() {
      return this.$store.state.auth.user
    }
  }
}
</script>
<style lang="scss" scoped>
.ratings {
  padding: 20px 10px;
  color: #808191;
}
table {
  margin-bottom: 12px;
}
td {
  display: table-cell;
  vertical-align: middle;
  padding-left: 20px;
  padding-top: 4px;
  padding-bottom: 4px;
  /* border-bottom: 1px solid #E4E4E4; */
  box-shadow: inset 0 -1px 0 0 var(--primary-decor2);
}
thead td {
  /* background-color: #bbb2; */
  /* color: var(--primary-text) */
  padding-top: 24px;
  padding-bottom: 24px;
  font-size: 13px;
  line-height: 1.38462;
  font-weight: 500;
  color: #B2B3BD;
}

.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 30px;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.card:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--card-glow);
  filter: blur(43px);
  border-radius: 24px;
  transition: background .25s;
}

.dropdown__head .icon {
  fill: var(--primary-text);
  transition: .25s;
  margin-right: 7px;
}
.dropdown__head .icon.icon-arrow-down {
  position: absolute;
  width: 10px;
  height: 6px;
  top: 55%;
  right: 5px;
  transform: translateY(-50%);
  font-size: 6px;
  transition: all .25s;
  fill: var(--primary-text2)
}
</style>