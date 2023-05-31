import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
import i18n from './../../i18n'

export const state = {
  team: null,
  tempAva: null,
  teamBackendValidator: null,
  creationRequestLoading: false
}

export const getters = {
  team: state => state.team,
  tempAva: state => state.tempAva
}

export const mutations = {
  removeFromTeam: (state, pid) => {
    // console.log('cp ppppppid', state.team)
    // pid
    // const idx = state.team.members.findIndex(p => p.id === pid)
    state.team = { ...state.team, members: state.team.members.filter(p => p.id !== pid) }
  },
  setTeam: (state, team) => state.team = team,
  setTempAva: (state, val) => state.tempAva = val,
  refreshCode (state, val) {
    if (state.team) {
      Vue.set(state.team, 'code', val)
    } else {
      state.team = {code: val}
    }
  },
  setTeamBackendValidator: (state, newData) => state.teamBackendValidator = newData,
  changeLoading: (state, val) => state.creationRequestLoading = val
}

export const actions = {
  setTempAva (context, val) {
    context.commit('setTempAva', val)
  },
  async teamFetch (context) {
    const response = await axiosInstance
      .get('/api/profile?page=team')
      // .catch(err => console.log('error at auth/tryAuth' + err))
    if (response && response.data && !Array.isArray(response.data)) {
      context.commit('setTeam', response.data)
      // context.commit('auth/setTeam', response.data, { root: true })
    }
  },
  async requestUpdateTeam (context, { opts, id }) {
    context.commit('changeLoading', true)
    const resp = await axiosInstance
      .put(`/api/teams/${id}`, opts)
    
    context.commit('changeLoading', false)

    if (resp && resp.data && resp.data.success !== false) {
      // context.commit('setTeam', resp.data)
      // console.log('cp 43534xxxx', resp.data)
      // resp.data.team_id = resp.data.id
      // resp.data.member = "owner"
      // console.log('cp 34345', context.state.team)
      let ndata = context.state.team
      ndata.name = opts.name
      ndata.tag = opts.tag
      if (opts.path) {
        ndata.path = opts.path
      }
      context.commit('auth/setTeam', ndata, { root: true })
      Vue.notify({
        group: 'n',
        text: 'Команда изменена',
        duration: 1500,
      })
    } else {
      context.commit('setTeamBackendValidator', resp.data.validator)
      Vue.notify({
        group: 'n',
        text: 'Валидация данных на сервере не прошла',
        duration: 1500,
      })
    }
  },
  async requestNewTeam (context, opts) {
    context.commit('changeLoading', true)
    const resp = await axiosInstance
      .post(`/api/teams`, opts)

    context.commit('changeLoading', false)
    
    if (resp && resp.data && resp.data.success !== false) {
      context.commit('setTeam', resp.data)
      resp.data.team_id = resp.data.id
      resp.data.member = "owner"
      context.commit('auth/setTeam', resp.data, { root: true })
      Vue.notify({
        group: 'n',
        text: 'Команда создана',
        duration: 1500,
      })
    } else if (resp.data && resp.data.code === 'tournament.no_profile') {
      // context.commit('tournaments/setTriedToJoin', tid, { root: true })
      context.commit('auth/setStep', 3, { root: true })
      context.commit('auth/setGeneratedPic', -1, { root: true })
      context.commit('auth/setConnectStatus', 'Выберите лигу, приоритеты ролей и нажмите "Сохранить"', { root: true })
      context.commit('auth/setLeague', resp.data.league || {}, { root: true })
      context.commit('auth/setStartFrom3', true, { root: true })
      context.commit('main/setConnectModal', true, { root: true })
    } else if (
      (resp.data && resp.data.code === 'tournament.no_account') ||
      (resp.data && resp.data.code === 'tournament.no_account_active')
    ) {
      // context.commit('tournaments/setTriedToJoin', tid, { root: true })
      context.commit('auth/setStartFrom3', false, { root: true })
      context.commit('main/setConnectModal', true, { root: true })
    } else {
      context.commit('setTeamBackendValidator', resp.data.validator)
      Vue.notify({
        group: 'n',
        text: 'Валидация данных на сервере не прошла',
        duration: 1500,
      })
    }
  },
  async deleteTeam (context, teamId) {
    const resp = await axiosInstance
      .delete(`/api/teams/` + teamId)
      if (resp.data && resp.data.success !== false) {
        context.commit('setTeam', null)
        //context.commit('auth/setTeam', null, { root: true })
        Vue.notify({
          group: 'n',
          text: 'Команда удалена',
          duration: 1500,
        })
      } else if (resp.data && resp.data.success === false && resp.data.code) {
        Vue.notify({
          group: 'n',
          text: i18n.t('errors.' + resp.data.code),
          duration: 1500,
        })
      } else {
        Vue.notify({
          group: 'n',
          text: 'Привет, возникла ошибка',
          duration: 1500,
        })
      }
      
  },
  async refreshTeamCode (context, teamId) {
    const resp = await axiosInstance
      .post(`/api/teams/${teamId}/events`, {
        event: 'refresh_code'
      })
    if (resp && resp.data && resp.data.data && resp.data.data.code) {
      context.commit('refreshCode', resp.data.data.code)
    }
    Vue.notify({
      group: 'n',
      text: 'Код перегенерирован',
      duration: 1500,
    })
  },
  async leaveTeam (context, teamId) {
    const resp = await axiosInstance
      .post(`/api/teams/${teamId}/events`, {
        event: 'leave'
      })
    console.log(resp)
    if (resp && resp.data && resp.data.success) {
      Vue.notify({
        group: 'n',
        text: 'Вышел из команды',
        duration: 1500,
      })
      context.commit('setTeam', null)
      //context.commit('auth/setTeam', null, { root: true })
    } else {
      Vue.notify({
        group: 'n',
        text: 'По некоторым причнам, выйти не удалось',
        duration: 1500,
      })
    }
    
    
  },

  async kickPlayer (context, {teamId, playerId}) {
    const resp = await axiosInstance
      .post(`/api/teams/${teamId}/events`, {
        event: 'kick',
        user_id: playerId
      })
    console.log(resp)
    if (resp && resp.data && resp.data.success) {
      Vue.notify({
        group: 'n',
        text: 'Успех',
        duration: 1500,
      })
      context.commit('removeFromTeam', playerId)
    } else {
      Vue.notify({
        group: 'n',
        text: 'Не кикабельный чото, хз',
        duration: 1500,
      })
    }
      
  },

  async switchToPlayer (context, {teamId, playerId}) {
    const resp = await axiosInstance
      .post(`/api/teams/${teamId}/events`, {
        event: 'switch_owner',
        user_id: playerId
      })
    console.log(resp)
    if (resp && resp.data && resp.data.success) {
      Vue.notify({
        group: 'n',
        text: 'Успешно переназначен',
        duration: 1500,
      })
      // context.commit('setTeam', null)
      // TODO: change team in store - delete the kicked member on success
    } else {
      Vue.notify({
        group: 'n',
        text: 'У нас проблема',
        duration: 1500,
      })
    }
      
  }
}
