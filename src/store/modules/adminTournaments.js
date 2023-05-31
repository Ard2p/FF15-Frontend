import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
// import i18n from './../../i18n'
import router from './../../router'

export const state = {
  tList: [],
  tCurrent: null, //currently edited
  inLoading: false,
  tournamentsPagination: {
    last_page: 1,
    current_page: 1,
    pages_to_render: [ 1 ]
  },
}

export const getters = {
  pages_to_render(state) {
    let result = []
    let furthest = Math.min(state.tournamentsPagination.current_page + 1, state.tournamentsPagination.last_page)
    for (let i = furthest - 2; i <= Math.max(furthest, Math.min(3, state.tournamentsPagination.last_page)); i++) {
      if (i > 0)
        result.push(i)
    }
    return result
  }
}

export const mutations = {

  renewAdminTournamentsPagination(state, {last, cur}) {
    state.tournamentsPagination.last_page = last
    state.tournamentsPagination.current_page = cur
  },
  
  setTournament(state, resp) {
    delete(resp.players)
    delete(resp.user_id)
    delete(resp.grids)
    delete(resp.grids)
    Vue.set(state, 'tCurrent', resp)
    // state.tCurrent = resp
  },
  populateList(state, tournaments) {
    Vue.set(state, 'tList', tournaments)
  },
  removeFromTList(state, tid) {
    const tidx = state.tList.findIndex(t => t.id === tid)
    state.tList.splice(tidx, 1)
  },
  setInLoading(state, val) {
    state.inLoading = val
  },
  new(state) {
    Vue.set(state, 'tCurrent', {
      name: '',
      img: '/img/storage/t2.png',
      desc: '',
      prize: `<div>1ое место:</div>
      <div style="margin-left: 20px">пендель</div>
      <div style="margin-left: 20px">крендель</div>
      <div style="margin-left: 20px">билеты на самолет</div>
      <div style="margin-top: 20px">2ое место:</div>
      <div style="margin-left: 20px">пендель</div>
      <div style="margin-left: 20px">крендель</div>
      <div style="margin-top: 20px">3ое место:</div>
      <div style="margin-left: 20px">медаль</div>`,
      twitch: '',
      discord: '',
      game: 'lol',
      type: 'rtc',
      level: 0,
      max_players: 0,
      leave_disable: false,
      grid_disable: false,
      start: '',
      status: 'open',
      id: null
    })
    console.log(state.tCurrent)
  }
}

export const actions = {
  new(context) {
    context.commit('new')
  },
  deleteTournament(context, tid) {
    context.commit('setInLoading', true)
    axiosInstance
      .delete('/api/admin/tournaments/' + tid, [])
      .then(response => {
        if (response && response.data) {
          console.log(response)
          context.commit('removeFromTList', tid)
        }
        context.commit('setInLoading', false)
      })
      .catch(err => {
        context.commit('setInLoading', false)
        Vue.notify({
          group: 'n',
          text: err
        })
      })
  },
  editTournamentPrefetch(context, tid) {
    context.commit('setInLoading', true)
    axiosInstance
      .get('/api/admin/tournaments/' + tid, [])
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          context.commit('setTournament', resp)
          router.push('/admin/tournaments/' + tid)
        }
        context.commit('setInLoading', false)
      })
      .catch(err => {
        context.commit('setInLoading', false)
        Vue.notify({
          group: 'n',
          text: err
        })
      })
  },
  getList(context, page) {
    context.commit('setInLoading', true)
    if (!page) page = context.state.tournamentsPagination.current_page
    const url = '/api/admin/tournaments?page=' + page// +
                //context.rootGetters['filters/getUrlString']
    axiosInstance
      .get(url, [], {withCredentials: true})
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          context.commit('populateList', resp.data)
          
          //pagination
          context.commit('renewAdminTournamentsPagination', {last: resp.last_page, cur: resp.current_page})
        } else {
          Vue.notify({
            group: 'n',
            text: 'Error retreiving admin tournament list'
          })
        }
        context.commit('setInLoading', false)
      })
      .catch(err => {
        Vue.notify({
          group: 'n',
          text: err
        })
        context.commit('setInLoading', false)
      })
  },
}
