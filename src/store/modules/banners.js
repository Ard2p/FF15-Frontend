import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
// import i18n from './../../i18n'
// import router from './../../router'


export const state = {
  inLoading: true,
  bList: [],
  bCurrent: {} //is this needed?
}

export const getters = {
}

export const mutations = {
  populateList(state, banners) {
    Vue.set(state, 'bList', banners)
  },
  setInLoading(state, val) {
    state.inLoading = val
  },
}

export const actions = {
  getBanners(context) {
    context.commit('setInLoading', true)
    const url = '/api/banners'
    axiosInstance
      .get(url, [], {withCredentials: true})
      .then(response => {
        
        if (response && response.data) {
          context.commit('populateList', response.data)
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
