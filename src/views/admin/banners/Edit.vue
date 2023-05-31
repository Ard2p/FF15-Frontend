<template>
  <div class="admin screen">
    <div class="card">
      <h2 v-if="isNew">Создать баннер</h2>
      <h2 v-else>Редактировать баннер</h2>
      <img
        style="position: absolute; top: 10px; right: 15px; width: 160px; height: 44px; background-size: cover; outline: 1px dotted gray;"
        :src="banner.img"
        alt="preview here"
      />
      <div class="field-wrapper">
        <span class="lab">title</span>
        <input class="field-input" type="text" v-model="banner.title">
      </div>
      <div class="field-wrapper">
        <span class="lab">path</span>
        <input class="field-input" type="text" v-model="banner.img">
      </div>
      <div class="field-wrapper">
        <span class="lab">status</span>
        <select v-model="banner.status">
          <option v-for="s in statuses" :key="s" :value="s">{{s}}</option>
        </select>
      </div>
      <div class="field-wrapper">
        <span class="lab">btn_link</span>
        <input class="field-input" type="text" v-model="banner.btn_link">
      </div>
      <div class="field-wrapper">
        <span class="lab">btn_name</span>
        <input class="field-input" type="text" v-model="banner.btn_name">
      </div>
      <div class="field-wrapper">
        <span class="lab">game</span>
        <input class="field-input" type="text" v-model="banner.game">
      </div>
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <router-link
          class="btn btn_purple"
          style="min-width: auto; height: 36px; line-height: 36px; margin-right: 5px; margin-top: 15px;"
          to="/admin/banners"
        >
          Вернуться к списку
        </router-link>
        <button class="btn btn_purple" style="margin-left: auto; width: 150px; height: 36px; margin-top: 15px;" @click="send">Сабмит</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
export default {
  data() {
    return {
      statuses: ['publish', 'draft'],
      banner: {}
      // {
      //   img: '/img/banners/b5.png',
      //   btn_name: 'watch',
      //   btn_link: '#',
      //   game: 'lol',
      //   status: 'draft',
      //   title: 'Renegades vs Chiefs - ESL ProLeague Season 16 - Playoffs. yo'
      // },
    }
  },
  methods: {
    send() {
      const method = (this.banner.id || this.banner.id === 0) ? 'put' : 'post'
      const url = '/api/admin/banners' + ((this.banner.id || this.banner.id === 0) ? '/' + this.banner.id : '')
      console.log('cp-banners-1', this.banner)

      axiosInstance[method](url, this.banner)
          .then(response => {
              console.log('response cp-b-2:', response, method)
              if (response.statusText === 'OK') {
                  this.$notify({
                    group: 'n',
                    text: 'Изменен',
                    duration: 2500
                  })
                  this.$router.push('/admin/banners')
              } else if (response.statusText === 'Created') {
                  this.$notify({
                    group: 'n',
                    text: 'Создан',
                    duration: 2500
                  })
                  this.$router.push('/admin/banners')
              } else {
                  throw Error('SMTH X2')
              }

          })
          .catch(err => {
            this.$notify({
              group: 'n',
              text: 'Ошибка ' + err,
              duration: 2500
            })
            console.log('err cp2779:', err)
          })
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id === 'new'
    },
    bCurrent() {
      return this.$store.state.adminBanners.bCurrent
    }
  },
  mounted() {
    if (this.bCurrent) {
      this.$set(this, 'banner', this.bCurrent)
    }
  },
  watch: {
    bCurrent(newVal) {
      this.$set(this, 'banner', newVal)
    }
  }
};
</script>

<style lang="scss" scoped>
.admin {
  padding: 10px;
}
.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
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
.field-wrapper {
  display: flex;
  margin: 4px 0;
}
.lab {
  display: block;
  width: 110px;
  min-width: 110px;
  text-align: left;
  display: flex;
  align-items: center;
}
.field-input {
  border: 1px solid #ccc;
  font-size: 16px;
  width: 60%;
  padding: 6px;
  border-radius: 6px;
  width: 100%;
}
h2 {
  margin-bottom: 16px;
}
</style>