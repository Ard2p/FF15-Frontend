<template>
  <div class="screen">
    <InnerProfile
      :own="true"
      :user="user"
      :profile="profile"
      :statistics="(profile && profile.statistics) ? profile.statistics : null"
      :activeAcc="activeAcc"
      :nickname="nickname"
      :roles="null"
    />

    <TeamControls v-bind="{user}" />
		<!-- v-if="can('team@edit-self')" -->

  </div>
</template>


<script>
import InnerProfile from '@/components/organisms/InnerProfile.vue'
import TeamControls from '@/components/organisms/TeamControls.vue'

export default {
  name: 'OwnProfile',
  components: {
    InnerProfile,
    TeamControls
  },
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.$store.dispatch('accounts/profileRefill')
      vm.$store.dispatch('team/teamFetch')
    })
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    profile() {
      return this.$store.state.accounts.profile
    },
    activeAcc() {
      return this.$store.getters['accounts/activeAcc']
    },
    nickname() {
      if (this.activeAcc) return this.activeAcc.nickname
      else return null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>