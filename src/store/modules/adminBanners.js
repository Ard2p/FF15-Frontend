import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
// import i18n from './../../i18n'
import router from './../../router'

export const state = {
  bList: [],
  bCurrent: null, //currently edited
  inLoading: false
}

export const getters = {
  // 
}

export const mutations = {
  
  setBanner(state, resp) {
    Vue.set(state, 'bCurrent', resp)
  },
  populateList(state, banners) {
    Vue.set(state, 'bList', banners)
  },
  removeFromBList(state, bid) {
    const bidx = state.bList.findIndex(b => b.id === bid)
    state.bList.splice(bidx, 1)
  },
  setInLoading(state, val) {
    state.inLoading = val
  },
  new(state) {
    Vue.set(state, 'bCurrent', {
      img: '/img/banners/b7.png',
      btn_name: 'watch',
      btn_link: '#',
      game: 'lol',
      title: '',
      status: 'draft'
    })
  }
}

export const actions = {
  new(context) {
    context.commit('new')
  },
  delete(context, bid) {
    context.commit('setInLoading', true)
    axiosInstance
      .delete('/api/admin/banners/' + bid, [])
      .then(response => {
        if (response && response.data) {
          context.commit('removeFromBList', bid)
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
  editPrefetch(context, bid) {
    context.commit('setInLoading', true)
    axiosInstance
      .get('/api/admin/banners/' + bid, [])
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          context.commit('setBanner', resp)
          router.push('/admin/banners/' + bid)
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
  getList(context) {
    context.commit('setInLoading', true)
    const url = '/api/admin/banners'
    axiosInstance
      .get(url, [], {withCredentials: true})
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          context.commit('populateList', resp.data)
          

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
