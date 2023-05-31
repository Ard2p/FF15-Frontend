<template>
  <div class="screen-full card faq-wrapper">
    <div style="display: flex; justify-content: space-between;">
      <h2>Админка faq</h2>
      <button
        class="btn btn_purple" style="display: inline-block; height: 18px; min-width: 84px;"
        @click="rows.push({id: '#', head: '', body: '', height: 150 })"
      >
        Create
      </button>
    </div>
    <div v-if="!inLoading">
      <table v-if="rows && rows.length">
        <thead>
          <tr>
            <td>ID</td>
            <td>Head</td>
            <td>Body</td>
            <td>Height</td>
            <td>Controls</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, ridx) in rows" :key="ridx"
            style="user-select: text;"
          >
            <td>{{row.id || ridx}}</td>
            <td contenteditable>{{row.head}}</td>
            <td contenteditable>{{row.body}}</td>
            <td contenteditable>{{row.height}}</td>
            <td>
              <button class="btn btn_purple" style="display: inline-block; height: 18px; min-width: 84px;">Update</button>
              <button class="btn btn_purple" style="display: inline-block; height: 18px; min-width: 84px;">Delete</button>
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
  </div>
</template>

<script>
// import axiosInstance from '@/store/axiosInstance.js'

export default {

  data() {
    return {
      rows: [
        { head: this.$t('home.header1'), body: this.$t('home.desc1'), height: 110 },
        { head: this.$t('home.header2'), body: this.$t('home.desc2'), height: 130 },
        { head: this.$t('home.header3'), body: this.$t('home.desc3'), height: 110 },
        { head: 'Зачем моберу пальцы на ногах?', body: 'Чтобы вставать на носочки и бесшумно ходить', height: 80 },
        { head: 'Что делать если мамка выгоняет из дома?', body: 'В данном случае необходимо обратиться в полицию и суд. Всего доброго', height: 90 },
      ]
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
    
    fetchData() {
      // axiosInstance
      //   .get('/api/ratings?date=2021-03')
      //   .then(resp => {
      //     console.log(resp)
      //     this.players = resp.data//.sort((a,b) => Number(a.id) - Number(b.id))
      //   })
      //   .catch(err => {
      //     this.$notify({
      //       group: 'n',
      //       text: 'Ошибка. ' + err,
      //       type: 'success'
      //     })
      //   })
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
.faq-wrapper {
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
table tr td {
  padding: 6px 10px;
}
table tbody tr:hover {
  outline: 1px dashed orange;
}
</style>
