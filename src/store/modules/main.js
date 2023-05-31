import axiosInstance from './../axiosInstance.js'
import router from './../../router'


export const state = {
  theme: 'sun',
  ref: '',
  dpoint: 'profile',
  showLoginModal: false,
  connectModalOpen: false,
  showYesNoModal: false,
  showBanModal: false,
  showAvatarModal: false,
  yesNoModalText: 'Хотет?',
  yesNoModalOkAction: () => {},
  refreshTournamentsOn: true,
  showVerificationPopup: false,
  verifyResult: 'pending',
  showBannedPopup: false,
  showTeamInviteModal: false,
  teamInviteModalCode: null,
  roleToColor: {
    dev: 'yellowgreen',
    admin: '#007a79',
    moder: '#ffd37a',
    vip: 'dodgerblue',
    judge: 'pink',
    sword: '#ec5a89',
    user: '#808191',
    streamer: '#6441a5',
    abstract: 'transparent'
  },
  matchStatusColors: {		
		reserve: '',
    wait: 'yellow',
		lobby: 'white',
    ready: 'pink',
		pick: '#ff30c9',
    process: 'dodgerblue',
    end: 'purple',
    technical: 'orange',
    cancel: 'brown',
    error: 'red',
    success: 'green'    
  }
}

export const getters = {
}

export const mutations = {
  applyTheme(state) {
    if (state.theme === 'sun') {
      document.documentElement.style.cssText += `
        --primary-main: #6C5DD3;
        --secondary-main: #3F8CFF;
        --third-color: #5F75EE;
        --primary-opacity1: #fff;
        --primary-opactiy2: rgba(228, 228, 228, 0.5);
        --primary-opactiy3: rgba(228, 228, 228, 0.5);
        --opacity-bg1: #fff;
        --primary-decor1: #F0F3F6;
        --primary-decor2: #E4E4E4;
        --primary-decor3: rgba(0, 0, 0, 0.05);
        --primary-decor4: rgba(228, 228, 228, 0.3);
        --primary-decor5: #fff;
        --primary-text: #11142D;
        --primary-text1: #6C5DD3;
        --primary-text2: #808191;
        --shadow0: #bbb;
        --shadow1: rgba(227, 230, 236, 0.5);
        --shadow2: rgba(227, 230, 236, 0.6);
        --shadow3: rgba(227, 230, 236, 0.3);
        --shadow4: rgba(227, 230, 236, 0.6);
        --shadow5: rgba(0, 0, 0, 0.5);
        --shadow6: rgba(227, 230, 236, 0.85);
        --shadow7: #c0cdd9;
        --border-color1: #5F75EE;
        --notifications1: #FF754C;
        --notifications-text1: #fff;
        --gray-dropdown: #F7F7F7;
        --dd-border: #ddd;
        --third: rgba(228, 228, 228, 0.5);
        --card-glow: #F0F3F6;
        --disabled-link-text: #ccc;
        --grid-card: #bbb;

        --grid-header: #f5f5f8;
        --grid-header-x: #e0e1e3;
        --grid-header-border-x: #f5f5f8;
        --grid-team-number: #e0e1e3;
        --grid-round-text: #888B98;
        --grid-team-number-text: #888B98;
        --grid-outer-text: #B2B3B8;
        --grid-card-body: #EDEDEF;
        --grid-card-body-text: #3C3F4C;
        --grid-indicators-def: #E0E1E3;
        --grid-support-line: #D2D3D6;
        --grid-scroll: #D7D6DC;
      `
    } else if (state.theme === 'moon') {
      document.documentElement.style.cssText += `
        --primary-main: #6C5DD3;
        --secondary-main: #3F8CFF;
        --third-color: #fff;
        --primary-opacity1: #242731;
        --primary-opactiy2: #12141B;
        --primary-opactiy3: #335;
        --opacity-bg1: #1F2128;
        --primary-decor1: rgba(228, 228, 228, 0.1);
        --primary-decor2: rgba(228, 228, 228, 0.1);
        --primary-decor3: rgba(228, 228, 228, 0.1);
        --primary-decor4: rgba(228, 228, 228, 0.03);
        --primary-decor5: rgba(228, 228, 228, 0.04);
        --primary-text: #fff;
        --primary-text1: #fff;
        --primary-text2: #808191;
        --shadow0: #111;
        --shadow1: rgba(0, 0, 0, 0.1);
        --shadow2: rgba(0, 0, 0, 0.5);
        --shadow3: rgba(227, 230, 236, 0.6);
        --shadow4: rgba(0, 0, 0, 0.3);
        --shadow5: rgba(0, 0, 0, 0.5);
        --shadow6: rgba(0, 0, 0, 0.35);
        --shadow7: rgba(0, 0, 0, 0.5);
        --border-color1: #5F75EE;
        --notifications1: #FF754C;
        --notifications-text1: #fff;
        --gray-dropdown: #242731;
        --dd-border: #000;
        --third: rgba(228, 228, 228, 0.1);
        --card-glow: none;
        --disabled-link-text: #444;
        --grid-card: #111;

        --grid-header: #262A34;
        --grid-header-x: #262A34;
        --grid-header-border-x: #3b4051;
        --grid-team-number: #3b4051;
        --grid-round-text: #696C76;
        --grid-team-number-text: #626982;
        --grid-outer-text: #8289A3;
        --grid-card-body: #2D313E;
        --grid-card-body-text: #EDEDEF;
        --grid-indicators-def: #2C313D;
        --grid-support-line: #383E56;
        --grid-scroll: #181A20;
      `
    }
  },
  setLoginModal(state, val) {
    state.showLoginModal = val
  },
  setBannedPopup(state, val) {
    state.showBannedPopup = val
  },
  setBanModal(state, val) {
    state.showBanModal = val
  },
  setAvatarModal(state, val) {
    state.dpoint = 'profile'
    state.showAvatarModal = val
  },
  setTeamAvatarModal(state, val) {
    state.dpoint = 'teams'
    state.showAvatarModal = val
  },
  setYesNoModal(state, {val, text, action}) {
    state.showYesNoModal = val
    state.yesNoModalText = text
    if (action) {
      state.yesNoModalOkAction = action
    } else {
      state.yesNoModalOkAction = () => {}
    }
  },
  setTeamInviteModal(state, {val, code}) {
    state.showTeamInviteModal = val
    state.teamInviteModalCode = code
  },
  setTheme(state, themeName) {
    if (themeName === 'sun' || themeName === 'moon') {
      state.theme = themeName
    } else {
      state.theme = 'sun'
    }
    this.commit('main/applyTheme')
  },
  switchTheme(state) {
    if (state.theme === 'moon') {
      state.theme = 'sun'
    } else if (state.theme === 'sun') {
      state.theme = 'moon'
    }
    this.commit('main/applyTheme')
    localStorage.setItem("theme", state.theme)
  },
  saveRef(state, val) {
    state.ref = val
  },
  refreshToggle(state) {
    state.refreshTournamentsOn = !state.refreshTournamentsOn
  },
  setRefresh(state, val) {
    state.refreshTournamentsOn = val
  },
  setVerificationPopup(state, val) {
    state.showVerificationPopup = val
    if (val) {
      state.showLoginModal = false
    }
  },
  setVerifyResult(state, result) {
    state.verifyResult = result
  },


  setConnectModal(state, stat) {
    state.connectModalOpen = stat
  },
}

export const actions = {
  showConnectModal(context) {
    context.commit('setConnectModal', true)
  },
  closeCModal(context) {
    context.commit('setConnectModal', false)
    context.commit('auth/goToStep1', null, { root: true })
  },
  verify(context, {token, email}) {
    router.push({path: '/'})
    axiosInstance
      .post('/api/auth/verify', {token, email})
      .then(response => {
        if (response && response.data && response.data.success === true) {
          context.commit('setVerifyResult', 'success')
        } else {
          context.commit('setVerifyResult', 'error_' + response.data.code)
        }
        
      })
      .catch(err => {
        console.log('error at verify' + err)
        context.commit('setVerifyResult', 'error_unknown')
      })
  },
  setVerificationPopup(context, val) {
    context.commit('setVerificationPopup', val)
  },
  setRefreshVal(context, val) {
    context.commit('setRefresh', val)
  },
  refreshToggle(context) {
    context.commit('refreshToggle')
  },
  setTheme(context, themeName) {
    context.commit('setTheme', themeName)
  },
  switchTheme(context) {
    context.commit('switchTheme')
  },
  saveRef(context, val) {
    context.commit('saveRef', val)
  },
  setLoginModal(context, val) {
    context.commit('setLoginModal', val)
  },
  setYesNoModal(context, {val, text, action}) {
    context.commit('setYesNoModal', {val, text, action})
  },
  setTeamInviteModal(context, {val, code}) {
    context.commit('setTeamInviteModal', {val, code})
  },
  setBanModal(context, val) {
    context.commit('setBanModal', val)
  },
  setBannedPopup(context, val) {
    context.commit('setBannedPopup', val)
  },
  setAvatarModal(context, val) {
    context.commit('setAvatarModal', val)
  },
  setTeamAvatarModal (context, val) {
    context.commit('setTeamAvatarModal', val)
  }
}
