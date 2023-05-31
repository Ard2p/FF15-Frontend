import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
import i18n from './../../i18n'

export const state = {
  profile: {},
  inLoading: true,
  selectedGame: 'lol',
  rolesThrottler: null,
}

export const getters = {
  accs(state) {
    if (state.profile) {
      return state.profile.accounts
    } else {
      return []
    }
  },
  activeAcc(state, getters) {
    if (state.profile && Array.isArray(getters.accs)) {
      let needle = getters.accs.find(acc => acc.active === 1)
      return needle || null
    } else {
      return null
    }
  },
  accsWithoutActive(state, getters) {
    if (getters.activeAcc) {
      return getters.accs.filter(acc => acc.active !== 1)
    } else {
      return []
    }
  }
}

export const mutations = {
  deleteAcc(state, accId) {
    let updatedAccs = []
    state.profile.accounts.forEach(acc => {
      if (acc.id !== accId) {
        updatedAccs.push(acc)
      }
    })

    Vue.set(state.profile, 'accounts', updatedAccs)
  },
  setActiveAcc(state, accId) {
    let updatedAccs = state.profile.accounts
    updatedAccs.forEach(acc => {
      if (acc.id === accId) {
        acc.active = 1
      } else {
        acc.active = 0
      }
    })

    Vue.set(state.profile, 'accounts', updatedAccs)
  },
  setGame(state, game) {
    state.selectedGame = game
  },
  setProfile(state, data) {
    // console.log('%c asdasd', 'color: blue; background: orange;', Object.keys(state.profile))
    // console.log('%c asdasd', 'color: blue; background: orange;', Object.keys(data))
    // if (!state.profile) {
    //   Vue.set(state, 'profile', data)
    // } else {
    //   Object.keys(data).forEach(key => {
    //     Vue.set(state.profile, key, data[key])
    //   })
    //   Vue.set(state, 'profile', data)
    // }
    Vue.set(state, 'profile', data)
    state.inLoading = false
  },
  swapRoles(state, {dragged, dragovered}) {
    let tmp = state.profile.roles[dragged]
    let tmp2 = state.profile.roles[dragovered]
    Vue.set(state.profile.roles, dragged, tmp2)
    Vue.set(state.profile.roles, dragovered, tmp)
  }
}

export const actions = {
  deleteAcc(context, accId) {
    state.inLoading = true
    axiosInstance
      .delete('/api/profile/accounts/' + accId)
      .then(() => {
        context.commit('deleteAcc', accId)
        state.inLoading = false
      })
  },
  swapRoles(context, vars) {
    context.commit('swapRoles', vars)
    if (context.state.rolesThrottler) {
      clearTimeout(context.state.rolesThrottler)
    }
    context.state.rolesThrottler = setTimeout(() => {
      axiosInstance
        .put('/api/profile', {
          update: 'roles',
          roles: state.profile.roles
        })

    }, 2000)
  },
  setActive(context, accId) {
    state.inLoading = true
    axiosInstance
      .put('/api/profile/accounts/' + accId)
      .then(() => {
        context.commit('setActiveAcc', accId)
        state.inLoading = false
      })
  },
  async profileRefill(context) {
    // if (context.rootState.auth.tried_auth) {
    const response = await axiosInstance
      .get('/api/profile', [])
      .catch(err => {
        console.log('error y at auth/tryAuth' + err)
      })
    if (response && response.data) {
      let user = response.data
      context.commit('auth/tryAuth', user, { root: true })
    }
    // }
  },
  async profileRefillForSettings(context) {
    const response = await axiosInstance
      .get('/api/profile?page=settings', [])
      .catch(err => console.log('error z at auth/tryAuth' + err))
    if (response && response.data) {
      let user = response.data
      context.commit('auth/tryAuth', user, { root: true })
    }
  },
  async renewData(context) {
    const response = await axiosInstance
      .post('/api/auth/profile', [])
      .catch(err => {
        console.log('error x at auth/tryAuth' + err)
      })
    let user = null
    if (response && response.data.status === 'success') {
      user = response.data.data
      context.commit('auth/tryAuth', user, { root: true })
      context.commit('auth/authCheck', null,{ root: true })
      context.dispatch('requestAccs')
    } else {
      localStorage.removeItem("email")
      localStorage.removeItem("id")
      context.commit('auth/authCheck', null,{ root: true })
    }
  },
  setGame(context, game) {
    context.commit('setGame', game)
  },
  requestAccs(context) {
    axiosInstance
      .get('/api/profile/accounts')
      .then(response => {
        if (response.data) {
          context.commit('setProfile', response.data)
        } else {
          context.commit('setProfile', null)
        }
        
      })
      .catch(err => {
        Vue.notify({
          group: 'n',
          text: i18n.t(err)
        })
      })
  }
}
