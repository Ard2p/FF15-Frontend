<template>
  <div class="navbar__list profile-list">
    <div class="navbar__group">
      <div v-if="profile && !accsInLoading" class="navbar__menu" style="padding-bottom: 8px;">
        <div class="player-prop" style="flex-direction: column;">
          <div class="acc-leag">
            <span v-if="profile && profile.mmr">
              {{$t('lol.leagues.' + profile.mmr.league)}} {{profile.mmr.division}}
            </span>
            <div v-else style="white-space: nowrap;">
              Нет профиля
            </div>
          </div>
          <AccStatistics
            v-if="profile && profile.statistics"
            :win="profile.statistics.win"
            :lose="profile.statistics.lose"
          />
        </div>

        <div class="player-prop" style="flex-direction: column">
          <div class="acc-label">
            Приоритет ролей в игре
          </div>
          <RoleTosser />
        </div>
      </div>
      <div v-else />
    </div>
  </div>
</template>

<script>
import RoleTosser from '@/components/atoms/RoleTosser.vue'
import AccStatistics from '@/components/atoms/AccStatistics.vue'

export default {
  components: {
    RoleTosser,
    AccStatistics
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
    profile() {
      return this.$store.state.accounts.profile
    },
    accsInLoading() {
      return this.$store.state.accounts.inLoading
    }
  }
}
</script>
<style lang="scss" scoped>
.player-prop {
  display: flex;
  justify-content: space-between;
  line-height: 26px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-text);
  transition: color .25s;
  transition: all .25s;
  text-decoration: none;
  & .p-title {
    color: #808191;
  }
}
.tourneys_wrap {
  padding-left: 16px;
  font-size: 13px;
  line-height: 18px;
  & .tourney {
    margin-top: 5px;
  }
}
.acc-label {
  color: #808191;
  font-weight: 500;
  margin: 10px 0;
  text-align: left;
  font-size: 14px;
}
.acc-leag {
  margin: 0;
  width: 130px; height: 36px;
  line-height: 36px;
  text-align: left;
  color: #808191;
  font-weight: bold;
}
</style>