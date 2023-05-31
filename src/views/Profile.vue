<template>
  <InnerProfile
    :own="false"
    :user="user"
    :profile="profile"
    :statistics="(user && user.statistics) ? user.statistics : null"
    :activeAcc="activeAcc"
    :nickname="nickname"
    :roles="profile.roles"
    v-if="!inLoading"
  />
  <div v-else>
    <Loader style="position: absolute; top: 30vh; left: 50vw;"/>
  </div>
</template>


<script>
import axiosInstance from '@/store/axiosInstance.js'

import InnerProfile from '@/components/organisms/InnerProfile.vue'
import Loader from '@/components/atoms/Loader.vue'

export default {
  name: 'Profile',
  props: ['uid'],
  components: {
    InnerProfile, Loader
  },
  data: () => {
    return {
      userdata: null,
      inLoading: false
    }
  },
  computed: {
    activeAcc() {
      if (this.userdata && this.userdata.accounts && this.userdata.accounts.length) {
        return this.userdata.accounts.find(acc => acc.active === 1)
      } else {
        return null
      }
    },
    nickname() {
      if (this.activeAcc) return this.activeAcc.nickname
      else return null
    },
    user() {
      if (this.userdata) {
        return this.userdata
      } else {
        return {}
      }
    },
    profile() {
      if (this.userdata && this.userdata.profile) {
        return this.userdata.profile
      } else {
        return {}
      }
    }
  },
  methods: {
    fetchData(uuid) {
      this.userdata = {}
      this.inLoading = true
      console.log('111h', this.uid)
      console.log('112h', this.$route)
      axiosInstance
        .get('/api/profiles/' + (uuid || this.uid), null)
        .then(resp => {
          if ('data' in resp) {
            this.userdata = resp.data
          }
          this.inLoading = false
        })
        .catch(err => {
          this.$notify({
            group: 'n',
            text: err,
            duration: 1800,
            type: 'error'
          })
          this.inLoading = false
          this.$router.replace('/error404')
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params.uid)
    next()
  },
}
</script>