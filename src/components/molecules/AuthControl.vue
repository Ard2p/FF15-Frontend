<template>
  <div
    class="auth-control" v-if="isAuthed"
    v-click-outside="close"
  >
    <div
      class="profile__widget"
      :class="{'active' : showUserMenu}"
      @click="showUserMenu = !showUserMenu"
      v-if="user && user.id"
    >
      <Avatar
        :pic="user.avatar"
        :role="user.role"
        :size="50"
        style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;"
      />
      <!-- <div
        style="display: flex; justify-content: space-between; align-items: center; color: #babec2; cursor: pointer; user-select:none;"
        class="header-avatar"
        :style="{backgroundImage: 'url(/img/685.png)'}"
      /> -->
        <!-- :style="{backgroundImage: (user.avatar || user.avatar === 0) ? 'url(\'/storage/img/profileicon/' + user.avatar + '.png\')' : ''}" -->
    </div>
    <div
      class="auth__dd"
      v-if="showUserMenu"
    >
      <!-- v-if="user && user.hasOwnProperty('id')" -->
      <GeneralLink
        v-if="can('admin@view')"
        to="/admin"
        @click.native="close"
        :title="'Админка'"
        icon="icon-settings" linkClass="header__link"
      />
      <GeneralLink
        v-if="user && user.hasOwnProperty('id')"
        to="/profile" :title="$t('pages.profile')"
        @click.native="close"
        icon="icon-profile" linkClass="header__link"
      />
      <GeneralLink
        v-if="user && user.hasOwnProperty('id')"
        to="/settings"
        @click.native="close"
        :title="$t('pages.settings')"
        icon="icon-settings" linkClass="header__link"
      />
      <button
        class="header__link"
        @click="$store.dispatch('auth/logout', $router); showUserMenu = false"
        style="display: flex; width: 100%; text-align: left; cursor: pointer;"
      >
        <div class="sidebar__icon">
          <svg class="icon icon-logout">
            <use xlink:href="/img/icons.svg#icon-logout"/>
          </svg>
        </div>
        {{$t('logout')}}
      </button>
    </div>
  </div>
  <button
    v-else
    class="navbar__item"
    @click="$store.dispatch('main/setLoginModal', true)"
  >
    {{$t('login')}}
  </button>
</template>

<script>
import GeneralLink from '@/components/atoms/GeneralLink.vue'
import Avatar from '@/components/quarks/Avatar'

export default {
  name: 'AuthControl',
  props: ['promo'],
  components: {
    GeneralLink,
    Avatar
  },
  data: () => {
    return {
      showUserMenu: false
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAuthed() {
      return this.$store.getters['auth/isAuthed']
    }
  },
  methods: {
    close() {
      this.showUserMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .auth-control {
    position: relative;
  }
  .header-avatar {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    font-size: 0;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 100%;
  }
  .avatar-wrapper {
    padding: 3px;
    background-color: transparent;
    border-radius: 100%;
    width: 56px;
    height: 56px;
    &:hover {
      /* box-shadow: 0 0px 10px var(--shadow0); */
      background-color: var(--primary-main);
    }
    &.active {
      background-color: var(--secondary-main);
    }
  }
  .auth__dd {
    z-index: 10;
    position: absolute;
    top: 60px;
    right: 0;
    /* width: 190px; */
    border-radius: 20px;
    padding: 20px;
    /* box-shadow: 0 10px 36px var(--shadow4); */
    box-shadow: 0px 8px 16px var(--shadow1);
    /* rgba(0, 0, 0, 0.5); */
    background-color: var(--primary-opacity1);
    margin-bottom: -15px;
    color: #808191;
    transition: padding .25s, background-color .25s;
    /* border: 1px solid var(--primary-decor2); */
  }
  .auth__dd:before {
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0 12px 12px 12px;
    border-color: transparent transparent var(--primary-opacity1) transparent;
    content: "";
    position: absolute;
    right: 14px;
    bottom: calc(100% - 2px);
  }
  .header__link {
    display: flex;
    align-items: center;
    height: 56px;
    border-radius: 12px;
    width: 216px;
    font-weight: 600;
    color: #808191;
    transition: all .25s;
    font-size: 14px;
  }
  .header__link:hover {
    background: var(--primary-decor4);
    color: var(--third-color);
  }
</style>