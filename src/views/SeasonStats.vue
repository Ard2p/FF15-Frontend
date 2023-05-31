<template>
  <div class="season-stats screen" ref="outer">
    <div class="card" style="min-height: 600px;">
      <div style="display: flex; justify-content: space-between;">
        <h2 style="text-align: left; color: var(--primary-text);">Статистика</h2>
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
      <table v-show="!isLoading && (champions && champions.length)">
        <thead>
          <tr>
            <SortSwitcher
              v-for="(col, colIdx) in sorts"
              :key="colIdx"
              :dir="sort === col.column ? dir : null "
              :column="col.column"
              :label="col.label"
              :sortable="col.sortable"
              @sort-click="sortClick(col.column, col.sortFunc)"
            />
          </tr>
        </thead>
        <tbody>
          <!-- .slice(0, 20) -->
          <tr
            v-for="(c, cidx) in champions" :key="c[0]"
            style="text-align: left; height: 54px;"
          >
            <td v-text="cidx + 1"/>
            <td>
              <Avatar
                :pic="c[0]"
                mode="abstract"
                role="abstract"
                style="margin-right: 10px; vertical-align: middle;"
              />
              {{c[1]}}
            </td>
            <td v-text="c[2]"/>
            <td :style="{color: c[3] > 49 ? 'green' : 'salmon'}">{{ c[3] }}</td>
            <td v-text="c[4]"/>
            <td v-text="c[5]"/>
            <td>
              <!-- .slice(0, 5) -->
              <router-link
                v-for="(player, pidx) in Object.keys(c[6])"
                :key="pidx"
                style="display: inline-block; position: relative;"
                :to="'/profiles/' + c[6][player].id"
                class="stats-player-link"
              >
                <!-- :pic="c[6][player].avatar" -->
                <Avatar
                  :pic="c[6][player].avatar"
                  :role="c[6][player].role"
                  :size="36"
                  style="margin: 0 2px;"
                />
                <pre
                  class="stats-tooltip"
                  v-html="c[6][player].nickname + '\nИгр: ' + c[6][player].games"
                />
              </router-link>
            </td>
            <td>{{ c[7] }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!isLoading && (!champions || !champions.length)" style="margin-top: 200px;">
        Пока что пусто
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/quarks/Avatar'
import axiosInstance from '@/store/axiosInstance.js'
import WinrateMixin from '../utility/WinrateMixin.js'
import Loader from '@/components/atoms/Loader.vue'
import SortSwitcher from '@/components/quarks/SortSwitcher'

export default {
  name: 'Ratings',
  mixins: [WinrateMixin],
  components: {
    Loader,
    Avatar,
    SortSwitcher
  },
  data: () => {
    return {
      champions: [],
      seasonOpen: false,
      seasonSelected: 0,
      isLoading: false,
      sort: 'games',
      dir: true,
      totalGames: 0,
      sorts: [
        {
          column: 'id',
          label: '#',
          sortable: false
        },
        {
          column: 'name',
          label: 'Чемпион'
        },
        {
          column: 'rang',
          label: 'Ранг'
        },
        {
          column: 'win',
          label: '% побед',
          // sortFunc: (a, b, dir) => ((a.win / a.games) - (b.win / b.games)) * (dir ? -1 : 1)
          // sortFunc: (a, b, dir) => (a.win - b.win) * (dir ? -1 : 1)
          sortFunc: (a, b, dir) => (a[3] - b[3]) * (dir ? -1 : 1)
        },
        {
          column: 'pick',
          label: '% выбора',
          sortFunc: (a, b, dir) => (a[4] - b[4]) * (dir ? -1 : 1)
        },
        {
          column: 'ban',
          label: '% блокировки',
          // sortFunc: (a, b, dir) => ((a.ban / a.games) - (b.ban / b.games)) * (dir ? -1 : 1)
          sortFunc: (a, b, dir) => (a[5] - b[5]) * (dir ? -1 : 1)
        },
        {
          column: 'player',
          label: 'Игроки',
          sortable: false
        },
        {
          column: 'games',
          label: 'Всего игр',
          sortFunc: (a, b, dir) => (a[7] - b[7]) * (dir ? -1 : 1)
        }
      ]
    }
  },
  methods: {
    sortClick (column, sortFunc) {
      if (this.sort !== column) {
        this.sort = column
        this.dir = true
      } else {
        this.dir = (this.dir === true ? false : true)
      }
      
      if (!sortFunc) {
        const collator = new Intl.Collator('ru')
        const multi = this.dir ? -1 : 1
        const columnIdx = this.sorts.findIndex(cc => cc.column === column)
        this.champions.sort((a, b) => collator.compare(a[columnIdx], b[columnIdx]) * multi)
      } else {
        this.champions.sort((a, b) => sortFunc(a, b, this.dir))
      }
    },
    close () {
      this.seasonOpen = false
    },
    fetchData() {
      this.isLoading = true
      const query = `?date=${this.seasonOptions[this.seasonSelected].y + '-' + this.seasonOptions[this.seasonSelected].m0}`
      axiosInstance
        .get('/api/statistics' + query)
        .then(resp => {
          // this.champions = resp.data
          if (resp.data.champions) {
            this.totalGames = resp.data.games
            // this.champions = resp.data.champions.map(ch => {
            //   ch.win = ~~(ch.win * 1000 / ch.games) / 10
            //   ch.ban = ~~(ch.ban * 1000 / ch.games) / 10
            //   ch.pick = ~~(ch.games * 1000 / this.totalGames) / 10
            //   return ch
            // })
            this.champions = resp.data.champions.map(ch => {
              // ch.win = ~~(ch.win * 1000 / ch.games) / 10
              // ch.ban = ~~(ch.ban * 1000 / ch.games) / 10
              // ch.pick = ~~(ch.games * 1000 / this.totalGames) / 10
              ch.players.sort((a, b) => b.games - a.games)
              return [
                ch.icon,
                ch.name,
                ch.rang,
                ~~(ch.win * 1000 / ch.games) / 10,
                ~~(ch.games * 1000 / this.totalGames) / 10,
                ~~(ch.ban * 1000 / this.totalGames) / 10,
                ch.players,
                ch.games
              ]
            })
            const columnIdx = this.sorts.findIndex(cc => cc.column === this.sort)
            if (!this.sorts[columnIdx].sortFunc) {
              const collator = new Intl.Collator('ru')
              const multi = this.dir ? -1 : 1
              this.champions.sort((a, b) => collator.compare(a[columnIdx], b[columnIdx]) * multi)
            } else {
              this.champions.sort((a, b) => this.sorts[columnIdx].sortFunc(a, b, this.dir))
              // this.champions.sort((a, b) => sortFunc(a, b, this.dir))
            }
          }
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
        for (let midx = yidx === 2021 ? 0 : 0; midx <= 11; midx++) {
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
      return this.champions.find(p => p.user_id === this.user.id)
    },
    user() {
      return this.$store.state.auth.user
    }
  }
}
</script>
<style lang="scss" scoped>
.season-stats {
  position: relative;
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
  /* padding-top: 4px;
  padding-bottom: 4px; */
  /* border-bottom: 1px solid #E4E4E4; */
  /* box-shadow: inset 0 -1px 0 0 var(--primary-decor2); */
}
tbody tr:nth-child(2n + 1) {
  background-color: var(--shadow6);
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
.player-link {
  color: var(--secondary-main);
}

.stats-tooltip {
  position: absolute;
  padding: 8px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  bottom: 42px;
  opacity: 0;
  /* z-index: 0; */
  transition-duration: .2s;
  pointer-events: none;
}
.stats-player-link:hover > .stats-tooltip {
  opacity: 1;
}

.dropdown.js-dropdown.active {
  z-index: 1 !important;
}
</style>