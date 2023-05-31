import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
import i18n from './../../i18n'

export const state = {
  user: {},
  token: null,
  tried_auth: false,
  connect: {
    step: 1,
    loading: false,
    step1Status: '',
    generatedPic: -1,
    league: {},
    stepCurrentTip: 'Введите имя пользователя:',
    startFrom3: false
  }
}
export const getters = {
  isAuthed(state) {
    return (state.user && ('id' in state.user))
  },
  ofAdmins(state) {
    return (state.user && ('role' in state.user) && ['dev', 'admin', 'moder'].includes(state.user.role))
  }
}

export const mutations = {
  setNewAvatar(state, path) {
    state.user.avatar = path
  },
  setMail(state, email) {
    state.user.email = email
  },
  setUser(state, user) {
    user.tournaments_request = []
    if (!state.user) Vue.set(state, 'user', {})
    for (let key in user) {
      Vue.set(state.user, key, user[key])
    }
  },
  setTeam (state, team) {
    if (!state.user) Vue.set(state, 'user', {})
    Vue.set(state.user, 'team', team)
  },
  authCheck(state) {
    state.tried_auth = true
  },
  tryAuth(state, data) {
    // state.user = data
    for (let key in data) {
      Vue.set(state.user, key, data[key])
    }
    
    if (data && data.id)
      localStorage.setItem("id", data.id)
    else
      localStorage.removeItem("id")
  },
  setMailFromLocalStorage(state, email) {
    state.user = {}
    state.user.email = email
  },
  setIdFromLocalStorage(state, id) {
    state.user = {}
    state.user.id = id
  },
  logout(state) {
    Vue.delete(state, 'user')
  },
  changeActiveTournaments(state, newList) {
    state.user.tournaments_request = newList
  },
  setContactLoading(state, status) {
    state.connect.loading = status
  },
  setConnectStatus(state, msg) {
    state.connect.step1Status = msg
  },
  setStep(state, step) {
    state.connect.step = step
  },
  setGeneratedPic(state, picId) {
    state.connect.generatedPic = picId
  },
  setLeague(state, league) {
    state.connect.league = league
  },
  setStartFrom3(state, val) {
    state.connect.startFrom3 = val
  },
  goToStep1(state) {
    state.connect.step = 1
    state.connect.generatedPic = -1
    state.connect.step1Status = ''
    state.connect.stepCurrentTip = 'Введите имя пользователя:'
  },
  goToStep2(state, {pid, step1Status, stepCurrentTip}) {
    state.connect.step = 2
    state.connect.generatedPic = pid
    state.connect.step1Status = step1Status
    state.connect.stepCurrentTip = stepCurrentTip
  }
}

export const actions = {
  setMail(context, email) {
    context.commit('setMail', email)
  },
  setNewAvatar(context, path) {
    context.commit('setNewAvatar', path)
  },

  showFromStep1(context) {
    context.commit('goToStep1')
    context.commit('main/setConnectModal', true, { root: true })
  },
  setUser(context, user) {
    context.commit('authCheck')
    context.commit('setUser', user)
    context.dispatch('accounts/requestAccs', null, { root: true })
  },
  async fetchOauthUrl(ctx, { provider }) {
    const { data } = await axiosInstance.get(`/api/auth/${provider}`)  
    return data.url
  },
  async tryAuth(context, router) {
    let email = localStorage.getItem("email")
    let id = localStorage.getItem("id")
    
    if (email && email.length > 1)
      context.commit('setMailFromLocalStorage', email)
    if (id)
      context.commit('setIdFromLocalStorage', id)

    let url = '/api/auth/profile'
    const response = await axiosInstance
      .post(url, [])
      .catch(err => {
        console.log('error at auth/tryAuth' + err)
        context.commit('accounts/setProfile', null, { root: true })
      })
    let user = null
    if (response && response.data.status === 'success') {
      // if (router.currentRoute.path !== '/profile') {
        
      // }
      user = response.data.data
      context.commit('tryAuth', user)
      context.commit('authCheck')

      if (router.currentRoute.name === 'promo') {
        router.replace('/tournaments')
      }
      context.dispatch('accounts/requestAccs', null, { root: true })
    } else {
      localStorage.removeItem("email")
      localStorage.removeItem("id")
      context.commit('authCheck')
      // if (!['/', '/verify', '/privacy', '/agreement']
      //   .includes(router.currentRoute.path)
      // ) {
      //   router.push('/')
      // }
    }
    // return user
  },
  async logout(context, router) {
    let url = '/api/auth/logout'
    await axiosInstance
      .post(url, [])
      .catch(err => console.log('error at auth/logout' + err))
      localStorage.removeItem("email")
      localStorage.removeItem("id")
      context.commit('logout')
      if (router.history.current.path !== '/') {
        router.push('/')
      }
  },

  async doStepBack(context) {
    if (!context.state.connect.startFrom3) {
      context.commit('goToStep1')
    } else {
      context.commit('setStep', 3)
      context.commit('setGeneratedPic', -1)
      context.commit('setConnectStatus', 'Аккаунт подтвержден, выберите лигу, приоритеты ролей и нажмите "Сохранить"')
    }
    
  },

  async connectSave(context, {league, rang, division, game, roles}) {
    context.commit('setContactLoading', true)
    context.commit('setConnectStatus', '')
    let url = '/api/profile/accounts'
    await axiosInstance
      .post(url, { event: "set_data", league, rang, division, game, roles })
      .then(resp => {
        if (resp.data.success) {
          //closeModal
          context.commit('main/setConnectModal', false, { root: true })
          //try to join again
          let prevTid = context.rootState.tournaments.triedToJoinTid
          if (prevTid != -1) {
            //tryAgain
            //commit
            context.dispatch('tournament/enterTournament', { tid: prevTid }, { root: true })
            context.commit('tournaments/setTriedToJoin', -1, { root: true })
          }
          context.dispatch('accounts/requestAccs', null, { root: true })
          context.commit('setStep', 1)
        } else {
          context.commit('setConnectStatus', i18n.t('errors.' + resp.data.code))
          Vue.notify({
            group: 'n',
            text: i18n.t('errors.' + resp.data.code),
            duration: 1800,
          })
        }
        context.commit('setContactLoading', false)
      })
      .catch(err => {
        context.commit('setContactLoading', false)
        console.log('error at auth/connectSave: ' + err)
        context.commit('setConnectStatus', err)
        Vue.notify({
          group: 'n',
          text: err,
          duration: 1800,
        })
      })
  },

  async connectCheckAcc(context) {
    context.commit('setContactLoading', true)
    context.commit('setConnectStatus', '')
    const url = '/api/profile/accounts'
    const game = context.rootState.accounts.selectedGame
    await axiosInstance
      .post(url, { event: "check_account", game })
      .then(resp => {
        if (resp.data.success) {
          context.commit('setGeneratedPic', -1)
          if (context.rootState.accounts.profile && !isNaN(Number(context.rootState.accounts.profile.id))) {
            //we have a profile already
            context.commit('setStep', 1)
            context.dispatch('accounts/requestAccs', null, { root: true })
            context.commit('setContactLoading', false)
            context.commit('main/setConnectModal', false, { root: true })
            Vue.notify({
              group: 'n',
              text: 'Аккаунт добавлен',
              duration: 1800,
            })
          } else {
            //Do the third step
            context.commit('setStep', 3)
            context.commit('setConnectStatus', 'Аккаунт подтвержден, выберите лигу, приоритеты ролей и нажмите "Сохранить"')
            context.commit('setLeague', resp.data.league)
            Vue.notify({
              group: 'n',
              text: 'Аккаунт подтвержден, выберите лигу, приоритеты ролей и нажмите "Сохранить"',
              duration: 1800,
            })
          }
        } else {
          context.commit('setConnectStatus', 'Аватар не совпадает, для подтверждения принадлежности аккаунта, поставьте аватар как на картинке и нажмите "проверить"')
          Vue.notify({
            group: 'n',
            text: 'Аватар не совпадает, для подтверждения принадлежности аккаунта, поставьте аватар как на картинке и нажмите "проверить"', //
            duration: 1800,
          })
        }
        context.commit('setContactLoading', false)
      })
      .catch(err => {
        context.commit('setContactLoading', false)
        console.log('error at auth/connectCheckAcc: ' + err)
        context.commit('setConnectStatus', err)
        Vue.notify({
          group: 'n',
          text: err,
          duration: 1800,
        })
      })
  },

  async connectCheckName(context, {accName, game}) {
    context.commit('setContactLoading', true)
    await axiosInstance
      .post('/api/profile/accounts', { event: "get_account", summonername: accName, game })
      .then(resp => {
        if (resp.data.success) {
          let step1Status = resp.data.summoner_name + ', для подтверждения принадлежности аккаунта, поставьте аватар как на картинке и нажмите "проверить"'
          context.commit('goToStep2', { pid: resp.data.set_icon, step1Status, stepCurrentTip: 'Проверка автара'})
          
          Vue.notify({
            group: 'n',
            text: 'Имя существует, для подтверждения принадлежности аккаунта, поставьте аватар как на картинке и нажмите "проверить"',
            duration: 1800,
          })
        } else {
          context.commit('setConnectStatus', i18n.t('errors.' + resp.data.code))
          Vue.notify({
            group: 'n',
            text: i18n.t('errors.' + resp.data.code),
            duration: 1800,
          })
        }
        context.commit('setContactLoading', false)
      })
      .catch(err => {
        context.commit('setContactLoading', false)
        console.log('error at auth/connectCheckName: ' + err)
        context.commit('setConnectStatus', err)
        Vue.notify({
          group: 'n',
          text: err,
          duration: 1800,
        })
      })
  }
  
}