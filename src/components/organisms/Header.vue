<template>
  <header class="header">
    <GameSwitcher />
    <div class="search-noti-col">
      <Search />
      <NotificationsTop />
    </div>
    <div class="auth-col">
      <AuthControl v-if="authTryDone" />
      <div v-else class="small-loader" style="margin-left: 0; width: 56px; height: 56px;"/>
    </div>
  </header>
</template>


<script>
import Search from '@/components/atoms/Search.vue'
import GameSwitcher from '@/components/atoms/GameSwitcher.vue'
import NotificationsTop from '@/components/atoms/NotificationsTop.vue'
import AuthControl from '@/components/molecules/AuthControl.vue'

export default {
  name: 'Header',
  components: {
    GameSwitcher,
    Search,
    NotificationsTop,
    AuthControl
  },
  data: () => {
    return {
      showUserMenu: false,
      searchOpen: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAuthed() {
      return this.$store.getters['auth/isAuthed']
    },
    authTryDone() {
      return this.$store.state.auth.tried_auth
    },
    ref() {
      let r = this.$store.state.main.ref
      if (r && r.length > 0) {
        return '?ref=' + r
      } else return ''
    }
  },
  methods: {
    searchGetFocused() {
      if (!this.searchOpen) {
        setTimeout(() => { this.$refs.searchInput.focus() }, 1)
      } else {
        this.$refs.searchInput.blur()
      }
    }
  },
}

</script>

<style lang="scss" scoped>
  .header {
    position: relative;
    /* padding: 48px 40px 44px; */
    padding: 0 64px;
    height: 96px;
    display: flex;
    align-items: center;
    z-index: 1;
    box-shadow: inset 0 -1px 0 0 var(--primary-decor2);
  }
  .search-noti-col {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    max-width: 298px;
    margin: 0 64px;
    margin-left: auto;
  }
</style>