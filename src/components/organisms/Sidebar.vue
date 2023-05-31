<template>
  <div class="sidebar">
    <div class="sidebar__top">
      <!-- <router-link to="/">
        <img src="/img/logos/logo2021.png" alt="logo" class="sidebar__logo">
      </router-link> -->
    </div>
    <div class="navbar">
      <div class="navbar__inner">
        <div class="navbar__list">
          <div class="navbar__group">
            <div class="navbar__caption">
              {{$t('navbar.main-menu')}}
            </div>
            <div class="navbar__menu">
              <GeneralLink
                to="/tournaments" extraTo="tournament-detail" :title="$t('pages.tournaments')"
                icon="icon-overview"
              />
              <GeneralLink
                to="/ratings" :title="$t('pages.ratings')"
                icon="icon-chart"
              />
              <GeneralLink
                to="/season-stats" :title="$t('pages.season-stats')"
                icon="icon-chart"
              />
              <GeneralLink
                to="/faq" :title="$t('pages.faq')"
                icon="icon-document"
              />
              <GeneralLink
                to="/contacts" :title="$t('pages.contacts')"
                icon="icon-chat"
              />
            </div>
          </div>
        </div>
        <div v-if="isAuthed" class="navbar__caption">
          {{$t('navbar.user-data')}}
        </div>
        <div
          class="navbar__profile"
          v-if="isAuthed && !accsInLoading"
          v-click-outside="close"
        >
          <div v-if="!activeAcc" style="display: flex;">
            <button
              class="main__btn btn btn_purple"
              style="margin: 0 auto;"
              @click="$store.dispatch('main/showConnectModal')"
            >
              {{ $t('connectModal.create-acc-btn') }}
            </button>
          </div>
          <div
            v-else
            class="profile__widget"
            :class="{'active': showUserMenu, 'moon': theme === 'moon'}"
            @click="showUserMenu = !showUserMenu"
          >
            <div
              style="width: 100%;"
            >
              <div
                v-if="user && user.id"
                style="display: flex; align-items: center; color: #babec2; cursor: pointer; user-select:none;"
              >
                <div class="navbar__desc">
                  <div class="navbar__profile-name">
                    {{ activeAcc.nickname }}
                  </div>
                  <div class="navbar__profile-role" style="height: 20px;">
                    <!-- {{user.role}} -->
                    <template v-if="!user.team">
                      Нет команды
                    </template>
                    <template v-else>                     
                      <!-- <Avatar
                        :pic="user.team.avatar || 0"
                        :size="22"
                        :mode="user.team.avatar ? 'team' : ''"
                        style="border: 0; vertical-align: middle; margin-right: 6px;"
                      /> -->
											<span style="line-height: 20px;">{{user.team.name}}</span>
                    </template>
                    
                  </div>
                </div>
                <!-- <svg class="arrows" viewBox="0 0 10 16">
                  <path d="M1.613 10.2l.094.083L5 13.585l3.293-3.292a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-4 4a1 1 0 0 1-1.32.083l-.094-.083-4-4a1 1 0 0 1 1.32-1.497zm4-10l.094.083 4 4a1 1 0 0 1-1.32 1.497l-.094-.083L5 2.415 1.707 5.707a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094 4-4A1 1 0 0 1 5.613.21z"></path>
                </svg> -->
              </div>
            </div>
          </div>
          <div
            class="profile__details"
            v-if="showUserMenu"
          >
            <div
              style="display: flex; position: relative;"
              v-for="acc in accsWithoutActive" :key="'sl_' + acc.id"
            >
              <button
                class="sidebar__link"
                
                @click="$store.dispatch('accounts/setActive', acc.id); showUserMenu = false"
                style="display: flex; width: 100%; text-align: left; padding: 0 10px; cursor: pointer;"
              >
                <div class="avatar-wrapper" style="margin-right: 10px;">
                </div>
                <div class="navbar__profile-name">
                  {{ acc.nickname }}
                </div>
              </button>
              <button
                @click.stop="deleteAcc(acc.id)"
                class="remove-btn"
              >
                🗑️
              </button>
            </div>
            <button
              class="main__btn btn btn_purple"
              style="margin: 10px auto 0 auto; display: block;"
              @click="$store.dispatch('auth/showFromStep1')"
            >
              {{ $t('connectModal.create-acc-btn') }}
            </button>
          </div>
        </div>
        <div v-if="!authTryDone || accsInLoading" style="padding: 11px 0;">
          <div class="small-loader" style="margin-left: 80px; width: 40px; height: 40px;"/>
        </div>
        <div
          v-if="!isAuthed"
          style="font-size: 12px;
            font-weight: 500;
            line-height: 1.33333;
          "
        >
          Пользователь не авторизован
        </div>
        <Proplist v-if="user && user.id"/>
        <NavbarAd />

      </div>
    </div>

    <div class="sidebar__bottom">
      <ThemeSwitcher />
    </div>
  </div>
</template>


<script>
import Proplist from '@/components/molecules/Proplist.vue'

import GeneralLink from '@/components/atoms/GeneralLink.vue'
import ThemeSwitcher from '@/components/atoms/ThemeSwitcher.vue'
import NavbarAd from '@/components/atoms/NavbarAd.vue'
// import Avatar from '@/components/quarks/Avatar.vue'

export default {
  name: 'Sidebar',
  components: {
    Proplist,
    GeneralLink,
    ThemeSwitcher,
    NavbarAd,
    // Avatar
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
    },
    ref() {
      let r = this.$store.state.main.ref
      if (r && r.length > 0) {
        return '?ref=' + r
      } else return ''
    },
    theme() {
      return this.$store.state.main.theme
    },
    authTryDone() {
      return this.$store.state.auth.tried_auth
    },
    accsWithoutActive() {
      return this.$store.getters['accounts/accsWithoutActive']
    },
    activeAcc() {
      return this.$store.getters['accounts/activeAcc']
    },
    accsInLoading() {
      return this.$store.state.accounts.inLoading
    }
  },
  methods: {
    close() {
      this.showUserMenu = false
    },
    deleteAcc(accId) {
      if (confirm('Подтверди удаление аккаунта')) {
        this.close() //close the dropdown
        this.$store.dispatch('accounts/deleteAcc', accId)
      }
    }
  },
}

</script>

<style lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  flex-shrink: 0;
  width: 256px;
  height: 100vh;
  box-sizing: border-box;
  padding: 96px 0 72px;
  background: var(--opacity-bg1);
  border-right: 1px solid var(--primary-decor2);
  &__top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96px;
  }
  &__logo {
    width: 94px;
  }
  &__bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    height: 72px;
    padding: 0 40px;
    box-shadow: inset 0px 1px 0px var(--primary-decor3);
    background-color: var(--opacity-bg1);
    button {
      appearance: none;
      background-color: transparent;
      border: 0;
      color: #808191;
      border-radius: 9px;
      padding: 6px 10px;
      cursor: pointer;
      &:hover {
        color: var(--primary-main);
      }
      &:focus {
        outline: none;
      }
    }
    .active {
      background-color: var(--primary-main);
      color: #fff !important;
    }
  }
}
.navbar {
  scrollbar-width: none;
  font-family: 'Inter', sans-serif;
  text-align: left;
  max-height: 100%;
  padding: 0 20px 30px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &__inner {
    width: 215px;
    /* overflow: hidden; */
    transition: width .25s;
    min-height: calc(100vh - 198px);
    /* height: 100vh; */
  }
  &__list {
    margin-bottom: 20px;
  }
  &__group {
    position: relative;
    margin-bottom: 0px;
    padding-bottom: 10px;
    &:before {
      content: "";
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 0;
      height: 1px;
      background: var(--primary-decor1);
    }
  }
  &__caption {
    margin-bottom: 16px;
    padding-left: 20px;
    color: #808191;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.33333;
  }
  &__desc {
    flex: 0 0 calc(100% - 38px);
    width: calc(100% - 38px);
    padding: 0;
    text-align: left;
  }
  &__profile-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #808191;
    font-size: 14px;
    line-height: 1.42857;
    font-weight: 600;
    transition: .25s;
  }
  &__profile-role {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.38462;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #808191;
    transition: .25s;
  }
  &__profile {
    position: relative;
    margin-top: 10px;
    .profile__widget {
      position: relative;
      z-index: 12;
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 62px;
      border-radius: 12px;
      color: #11142D;
      cursor: pointer;
      transition: background .25s;
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 14px;
        height: 8px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%231b1d21' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E") no-repeat 50% 50%/100% auto;
        transition: transform .25s;
      }
      &.moon:before {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%23808191' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E");
      }
      &:hover, &:active, &.active {
        background: var(--secondary-main);
        color: #fff;
        & .arrows {
          fill: #fff;
        }
        & .navbar__profile-role {
          color: #fff;
        }
        & .navbar__profile-name {
          color: #fff;
        }
        &:before {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath fill='%23ffffff' d='M.293.293A1 1 0 0 1 1.613.21l.094.083L7 5.585 12.293.293a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E");
        }
        &.active:before {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }
  }
  .profile__details {
    position: absolute;
    padding: 20px 10px 10px;
    margin-bottom: -15px;
    background: var(--primary-opacity1);
    box-shadow: 0 10px 12px var(--shadow1);
    opacity: 1;
    z-index: 3;
    padding-top: 68px;
    top: 0;
    width: 100%;
    border-radius: 12px;
    transition: padding .25s, background .25s;
  }
  
  .avatar-wrapper {
    padding: 2px;
    border-radius: 100%;
  }
  /* .header-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    font-size: 0;

    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 100%;
  } */
}
.sidebar__link {
  display: flex;
  border: 0;
  background-color: transparent;
  align-items: center;
  height: 56px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #808191;
  transition: all .25s;
  text-decoration: none;
  &:hover {
    color: var(--primary-main);
    .navbar__profile-name {
      color: var(--primary-main);
    }
    /* background: #fff; */
    /* box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.04); */
  }
  &:hover>.avatar-wrapper {
    background-color: var(--primary-main);
  }
  &.router-link-exact-active {
    background: var(--primary-main);
    color: #ffffff;
  }
}
.hover-white:hover {
  color: #fff;
}
.navbar__ad {
  position: relative;
  margin-bottom: 20px;
}
.navbar__ad:before {
  top: 8px;
  right: 8px;
  left: 8px;
  bottom: -8px;
  content: "";
  position: absolute;
  background: rgba(27, 29, 33, 0.7);
  border-radius: 20px;
}
.navbar__ad:after {
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: -16px;
  content: "";
  position: absolute;
  background: rgba(27, 29, 33, 0.7);
  border-radius: 20px;
  z-index: 0;
}
.sidebar__banner {
  height: 350px;
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 350px;
  margin-top: 20px;
  padding: 24px;
  border-radius: 20px;
  color: #fff;
  z-index: 1;
}
/* .sidebar__remove {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 4;
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  font-size: 0;
} */
.sidebar__title {
  font-size: 24px;
  line-height: 1.33333;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 12px;
}
.sidebar__info {
  margin-bottom: 24px;
}
.btn_purple {
  background: #6C5DD3;
  color: #ffffff;
}
.btn_purple:hover {
  background: #5a49ce;
}
.btn_wide {
  min-width: 100%;
}
.sidebar__btn.btn {
  min-width: 166px;
  height: 56px;
  padding: 0 20px;
  border-radius: 16px/16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.42857;
  font-weight: 700;
  transition: all .25s;
}
.sidebar__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 20px;
  overflow: hidden;
  background: url('/img/banner1.png');
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(58, 62, 69, 0)), color-stop(45%, rgba(30, 32, 36, 0.55)), color-stop(67%, rgba(27, 29, 33, 0.9)));
    background-image: -webkit-linear-gradient(top, rgba(58, 62, 69, 0) 0%, rgba(30, 32, 36, 0.55) 45%, rgba(27, 29, 33, 0.9) 67%);
    background-image: -o-linear-gradient(top, rgba(58, 62, 69, 0) 0%, rgba(30, 32, 36, 0.55) 45%, rgba(27, 29, 33, 0.9) 67%);
    background-image: linear-gradient(180deg, rgba(58, 62, 69, 0) 0%, rgba(30, 32, 36, 0.55) 45%, rgba(27, 29, 33, 0.9) 67%);
  }
}
.sidebar__details {
  position: relative;
  z-index: 3;
}

.sidebar__logo {
  height: 64px;
  width: 64px;
}

@media only screen and (max-width: 1023px) {
  .sidebar {
    /* z-index: 10; */
    width: 96px;
    padding: 90px 0 72px;
  }
  .sidebar__top {
    height: 90px;
  }
  /* .sidebar__logo {
    width: 74px;
  } */
  .navbar__inner {
    width: 56px;
  }
  .navbar__caption {
    max-width: 53px;
    overflow: hidden;
    white-space: nowrap;
    padding: 0;
    margin-right: 0;
  }
  .sidebar__bottom {
    padding: 35px;
  }
  .profile-list {
    display: none;
  }
  .navbar__profile {
    display: none;
  }
  .navbar__ad {
    display: none;
  }
}
.remove-btn {
  /* border: 2px solid var(--primary-main); */
  border-radius: 100%;
  padding: 4px;
  position: absolute;
  right: -5px;
  top: 25%;
  &:hover {
    background-color: var(--primary-main);
    
  }
}
</style>