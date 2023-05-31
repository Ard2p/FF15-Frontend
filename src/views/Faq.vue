<template>
  <div class="faq screen">
    <div class="card" style="margin: 0 auto;" v-if="!inLoading">
      <h2 style="text-align: left; color: var(--primary-text);">
        {{ $t('faq.header') }}
      </h2>
      <div style="width: 100%; display: flex; margin-top: 30px;">
        <div class="acc-wrap" style="margin: 0 auto;">
          <div class="accordion-smth">
            <AccordeonItem
              v-for="(faq, fidx) in faqs"
              :key="fidx"
              @click.native="accData = (accData === fidx ? null : fidx)"
              :active="accData === fidx"
              :height="faq.height"
            >
              <template #head>
                {{ faq.head }}
              </template>
              <template #body>
                {{ faq.body }}
              </template>
            </AccordeonItem>
          </div>
        </div>
      </div>
    </div>
    <Loader
      style="position: absolute; top: calc(50vh - 30px); left: calc(50vw + 70px);"
      v-else
    />
  </div>
</template>

<script>
import AccordeonItem from '../components/atoms/AccordeonItem.vue'
import Loader from '../components/atoms/Loader.vue'
import axiosInstance from '@/store/axiosInstance.js'
// const faqs = () => require('/json/faq.json')

// .context

export default {
  name: 'Faq',
  components: {
    Loader,
    AccordeonItem
  },
  data: function () {
    return {
      accData: null,
      faqs: [],
      inLoading: false,
      // faqs: [
      //   { head: this.$t('home.header1'), body: this.$t('home.desc1'), height: 110 },
      //   { head: this.$t('home.header2'), body: this.$t('home.desc2'), height: 130 },
      //   { head: this.$t('home.header3'), body: this.$t('home.desc3'), height: 110 },
      //   { head: 'Зачем моберу пальцы на ногах?', body: 'Чтобы вставать на носочки и бесшумно ходить', height: 80 },
      //   { head: 'Что делать если мамка выгоняет из дома?', body: 'В данном случае необходимо обратиться в полицию и суд. Всего доброго', height: 90 },
      // ]
    }
  },
  async mounted () {
    this.inLoading = true
    axiosInstance.get('/json/faq.json')
      .then(res => {
        this.inLoading = false
        this.faqs = res.data
      })
      .catch(() => {
        console.log('BASTARD')
        this.inLoading = false
      })
  },
  methods: {
    fetchData() {
      // axiosInstance
      //   .get('/api/ratings' + query)
      //   .then(resp => {
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
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  computed: {
    theme () {
      return this.$store.state.main.theme
    }
  }
}
</script>

<style lang="scss" scoped>
.faq {
  padding: 20px 10px;
  color: #808191;
}
.card {
  /* max-width: 600px; */
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


.accordion-smth {
  padding-right: 5%;
  width: 100%;
  display: block;
  /* max-width: 500px; */
}

.acc-wrap {
  margin: 26px;
  min-width: 480px;
  position: relative;
  /* order: 1; */
  /* min-height: 25rem; */
}
</style>