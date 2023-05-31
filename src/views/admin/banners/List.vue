<template>
  <div class="screen-full card banners-wrapper">
    <router-link
      to="/admin/banners/new"
      class="btn btn_purple"
      style="position: absolute; top: 15px; left: 15px; min-width: auto; height: 36px; line-height: 36px;"
      @click.native="$store.dispatch('adminBanners/new')"
    >
      Новый
    </router-link>
    <h2>Админка баннеров</h2>
    <div v-if="!inLoading">
      <div
        class="b-row"
        v-for="b in bannersList" :key="'b_' + b.id"
      >
        <div class="b-col" style="width: 3%;">{{b.id}}</div>
        <div class="b-col" style="width: 30%;">{{b.title}}</div>
        <div
          class="b-col b-path"
          style="width: 25%;"
          :style="{
            'background-image': 'url(' + b.img + ')'
          }"
        >
          {{b.img}}
        </div>
        <div class="b-col" style="width: 3%;">{{b.game}}</div>
        <div class="b-col" style="width: 20%;">{{b.link}}</div>
        <div class="b-col" style="display: flex; width: 19%;">
          <button
            class="btn btn_purple"
            style="min-width: auto; height: 36px; line-height: 36px; margin-right: 5px; padding: 0 5px;"
            @click="$store.dispatch('adminBanners/editPrefetch', b.id)"
          >
            Изменить
          </button>
          <button
            class="btn btn_purple"
            style="min-width: auto; height: 36px; padding: 0 5px;"
            @click="$store.dispatch('adminBanners/delete', b.id)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div v-else style="height: 250px; line-height: 250px;">
      Загрузка...
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      blist: [
        {
          id: 1,
          img: '/img/banners/b5.png',
          btn_name: 'watch',
          btn_link: '#',
          game: 'lol',
          title: 'Renegades vs Chiefs - ESL ProLeague Season 16 - Playoffs'
        },
        {
          id: 2,
          img: '/img/banners/b6.png',
          btn_name: 'join',
          btn_link: '#',
          game: 'lol',
          title: 'Renegades vs Chiefs - ESL ProLeague Season 16 - Playoffs'
        },
        {
          id: 3,
          img: '/img/banners/b7.png',
          btn_name: 'watch',
          btn_link: '#',
          game: 'lol',
          title: 'Renegades vs Chiefs - ESL ProLeague Season 16 - Playoffs'
        },
        {
          id: 4,
          img: '/img/banners/b8.png',
          btn_name: 'watch',
          btn_link: 'https://yandex.ru',
          game: 'lol',
          title: 'Renegades vs Chiefs - ESL ProLeague Season 16 - Playoffs'
        }
      ]
    }
  },
  computed: {
    bannersList() {
      return this.$store.state.adminBanners.bList;
    },
    inLoading() {
      return this.$store.state.adminBanners.inLoading
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("adminBanners/getList");
    })
  }
};
</script>

<style lang="scss" scoped>
.banners-wrapper {
  width: 100%;
  /* border: 1px solid #ccc; */
  padding: 15px;
  border-radius: 10px;
  position: relative;
  max-width: 1044px;
  margin: 10px auto;
}
.b-row {
  width: 100%;
  display: flex;
  padding: 6px 0;
  
  &:hover {
    outline: 1px dashed orange;;
  }
}
.b-path {
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
</style>