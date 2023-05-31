import axiosInstance from './../axiosInstance.js'
// import Vue from 'vue'
// import i18n from './../../i18n'
// import router from './../../router'

export const state = {
  tournaments: [],
  tournamentsPagination: {
    last_page: 1,
    current_page: 1,
    pages_to_render: [ 1 ]
  },
  in_loading: {
    tournaments: true,
    enter_specific: [false, false, false, false, false, false]
  },
  connectModalOpen: false,
  triedToJoinTid: -1,
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
  repopulateTournaments(state, tournaments) {
    state.tournaments = tournaments
    state.in_loading.tournaments = false
  },
  renewTournamentsPagination(state, {last, cur}) {
    state.tournamentsPagination.last_page = last
    state.tournamentsPagination.current_page = cur
  },
  start_in_loading(state, which) {
    state.in_loading[which] = true
  },
  stop_in_loading(state, which) {
    state.in_loading[which] = false
  },
  start_in_loading_specific(state, idx) {
    state.in_loading.enter_specific = {
      ...state.in_loading.enter_specific,
      [idx]: true
    }
  },
  stop_in_loading_specific(state, idx) {
    state.in_loading.enter_specific = {
      ...state.in_loading.enter_specific,
      [idx]: false
    }
  },
  setTriedToJoin(state, tid) {
    state.triedToJoinTid = tid
  }
}

export const actions = {
  getSomeTournaments(context, page) {
    if (!page) page = context.state.tournamentsPagination.current_page
    context.commit('start_in_loading', 'tournaments')
    const url = '/api/tournaments?page=' + page +
                context.rootGetters['filters/getUrlString']
    axiosInstance
      .get(url)
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          context.commit('repopulateTournaments', resp.data)
          //pagination
          context.commit('renewTournamentsPagination', {last: resp.last_page, cur: resp.current_page})
          // if (resp.current_page < resp.last_page) {

          // }
        }
      })
  }
}