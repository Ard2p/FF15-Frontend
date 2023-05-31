<template>
  <div class="search" :class="searchOpen ? 'active' : ''" v-click-outside="closeSearchDD">
    <div class="search__field">
      <input
        class="search__input"
        type="text"
        :placeholder="$t('header.search-ph')"
        @focus="searchOpen = true"
        ref="searchInput"
        v-model="searchLine"
        style="z-index: 3; position: relative;"
      >
      <button class="search__toggle" @click="searchOpen = !searchOpen">
        <svg v-if="!searchOpen" class="icon icon-search">
          <use xlink:href="/img/icons.svg#icon-search"/>
        </svg>
        <svg v-else class="icon icon-close">
          <use xlink:href="/img/icons.svg#icon-close"/>
        </svg>
      </button>
      <Loader v-if="inLoading" style="position: absolute; bottom: 0; right: -75px; height: 26px;"/>
    </div>
    <div v-if="searchOpen" class="search__result">
      <div class="search__list" v-if="searchResults.length">
        <router-link
          v-for="profile in searchResults.slice(0, 6)" :key="profile.user_id"
          class="search__item"
          :to="'/profiles/' + profile.user_id"
          @click.native="closeSearchDD"
        >
          <div class="search__preview bg-yellow">
            <Avatar
              :pic="profile.avatar"
              :role="profile.role"
              :size="40"
            />
            <!-- <img class="search__pic" :src="'/storage/img/profileicon/' + profile.avatar + '.png'" alt="avatar"> -->
          </div>
          <div class="search__text">
            {{ profile.nickname }}
            <svg class="icon icon-arrow-right">
              <use xlink:href="/img/icons.svg#icon-arrow-right"/>
            </svg>
          </div>
        </router-link>
      </div>
      <div v-else-if="searchLine.length < 2" class="search__text" style="padding: 10px 0;">
        Кого вы хотите найти?
      </div>
      <div v-else class="search__text" style="padding: 10px 0;">Никого не найдено :(</div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance.js'
import Loader from '@/components/atoms/Loader.vue'
import Avatar from '@/components/quarks/Avatar'

export default {
  name: 'Search',
  components: { Loader, Avatar },
  data: () => {
    return {
      searchOpen: false,
      searchLine: '',
      searchResults: [],
      inLoading: false
    }
  },
  methods: {
    searchGetFocused() {
      if (!this.searchOpen) {
        setTimeout(() => { this.$refs.searchInput.focus() }, 1)
      } else {
        this.searchLine = ''
        this.$refs.searchInput.blur()
        this.closeSearchDD()
      }
    },
    closeSearchDD() {
      this.searchOpen = false
    }
  },
  watch: {
    searchLine(newVal) {
      if (newVal.length > 1) {
        this.inLoading = true
        axiosInstance
          .post('/api/profiles/search', {
            nickname: newVal
          })
          .then(function (response) {
            this.searchResults = response.data
            this.inLoading = false
          }.bind(this))
          .catch(function (err) {
            this.$notify({
              group: 'n',
              text: 'Неправильные данные' + err,
              duration: 2500,
              type: 'error'
            })
            this.inLoading = false
          }.bind(this))
      } else {
        this.searchResults = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    width: 304px;
    margin-left: -8px;
    margin-right: auto;
    position: relative;
    z-index: 3;
  }
  .search__field {
    position: relative;
    z-index: 2;
  }
  .search__input {
    width: 100%;
    height: 48px;
    padding: 0 10px 0 44px;
    border-radius: 12px;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text);
    transition: background .25s;
  }
  .search.active .search__input {
    background: var(--primary-decor4);
  }
  .search__toggle {
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    bottom: 0;
    width: 42px;
    font-size: 0;
  }
  .search__toggle .icon {
    fill: var(--primary-text2);
    transition: fill .25s;
  }
  .search__toggle:hover .icon {
    fill: var(--primary-text1);
  }
  .search__toggle .icon-search {
    font-size: 20px;
  }
  .search__toggle .icon-close {
    font-size: 16px;
  }
  .search.active .search__result {
    visibility: visible;
    opacity: 1;
  }
  .search__result {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    padding: 56px 16px 4px;
    border-radius: 12px;
    background: var(--primary-opacity1);
    box-shadow: 0 10px 30px var(--shadow1);
    visibility: hidden;
    opacity: 0;
    transition: all .25s;
  }
  
  .search__item:not(:last-child) {
    border-bottom: 1px solid var(--primary-decor2);
  }
  .search__item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    color: var(--primary-text);
    transition: color .25s;
  }
  .search__preview {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin-right: 15px;
    border-radius: 12px;
    overflow: hidden;
    font-size: 0;
  }
  /* .search__pic {
    max-width: 100%;
    max-height: 100%;
    border-radius: 100%;
  } */
  .search__text {
    /* position: relative; */
    padding-right: 30px;
    line-height: 1.42857;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
  }
  .search__item:hover {
    color: var(--primary-text1);
  }
  .search__text .icon {
    /* position: absolute; */
    /* top: 5px;
    right: 9px; */
    font-size: 10px;
    fill: var(--primary-text);
    -webkit-transition: all .25s;
    -o-transition: all .25s;
    transition: all .25s;
  }
  .search__item:hover .icon {
    transform: translateX(4px);
    fill: var(--primary-text1);
  }
</style>