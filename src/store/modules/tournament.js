import axiosInstance from './../axiosInstance.js'
import Vue from 'vue'
import i18n from './../../i18n'
import router from './../../router'

export const state = {
  tournament: {
    players: [],
    in_loading: false,
    first_load: true
  },
  in_loading: {
    tournament: true,
    enter_leave: false
  },
  justDroppedDontRefresh: false,
  grid: {
    selected: null
  },
  current_battle: null,
  current_match: 0,
  selectedRound: null,
  nextRoundLoading: false
}

export const getters = {
  firstLoad(state) {
    return state.tournament.first_load
  },
  selectedBattle(state) {
    return state.current_battle || {team1 : null, team2: null}
  },
  selectedGrid(state) {
    return state.grid.selected
  },
  grids(state) {
    if (state && state.tournament && state.tournament.grids) {
      return state.tournament.grids.sort((a, b) => a.round - b.round)
    } else {
      return []
    }
  },
  rounds(state) {
    const roundsObject = {}
    if (state && state.tournament && state.tournament.grids) {
      const grids = state.tournament.grids
      grids.map(grid => {
        if (!roundsObject[grid.round]) {
          roundsObject[grid.round] = []
        }
        roundsObject[grid.round].push(grid)
      })
      return Object.values(roundsObject) //Array of rounds
    } else {
      return []
    }
  },
  teams(state) {
    return state.tournament.grids.teams
  },
  team1 (state) {
    if (state.tournament.type === 'rtc' && state.tournament.players && state.current_battle) {
      return state.tournament.players.filter(player => (
        player.team === state.current_battle.team1 &&
        player.round === state.current_battle.round
      ))
    } else if (state.tournament.type === 'rtc_se' && state.tournament.players && state.current_battle) {
      return state.tournament.players.filter(player => (
        player.team === state.current_battle.team1 && player.team
      ))
    } else if (
      ['team', 'team_de'].includes(state.tournament.type) &&
      state.tournament.teams &&
      state.current_battle
    ) {
      const effi = state.tournament.teams.find(tea => tea.team === state.current_battle.team1)
      if (effi && effi.members) {
        return effi.members
      } else {
        return []
      }
      
    } else {
      return []
    }
  },
  team2 (state) {
    if (state.tournament.type === 'rtc' && state.tournament.players && state.current_battle) {
      return state.tournament.players.filter(player => (
        player.team === state.current_battle.team2 &&
        player.round === state.current_battle.round
      ))
    } else if (state.tournament.type === 'rtc_se' && state.tournament.players && state.current_battle) {
      return state.tournament.players.filter(player => (
        player.team === state.current_battle.team2 && player.team
      ))
    } else if (
      ['team', 'team_de'].includes(state.tournament.type) &&
      state.tournament.teams &&
      state.current_battle
    ) {
      const effi = state.tournament.teams.find(tea => tea.team === state.current_battle.team2)
      if (effi && effi.members) {
        return effi.members
      } else {
        return []
      }
    } else return []
  },
  teamNull(state) {
    if (state.tournament.type === 'rtc_se') {
      if (state.tournament.players) {
        return state.tournament.players.filter(player => player.team === null)
      } else {
        return []
      }
    } else {
      if (state.tournament.players && state.current_battle)
        return state.tournament.players.filter(player => (player.team === null && player.round === state.current_battle.round))
      else if (state.tournament.players) {
        return state.tournament.players.filter(player => (player.round === state.selectedRound)) //state.tournament.round))
      } else return []
    }
  }
}

export const mutations = {
  changeMatchDataOnSelectedBattle (state, { mid, status, win }) {
    const match = state.current_battle.matches.find(m => m.id === mid)
    if (match) {
      match.status = status
      match.win = win
    }
    console.log(state.current_battle)
  },
  setMatch(state, match) {
    state.current_match = match
  },
  setBattle(state, battle) {
    if (state.tournament.type !== 'rtc') {
      if (battle && battle.matches) {
        state.current_match = 0
        const checkFirst = [
          'wait',
          'lobby',
          'ready',
          'pick',
          'process',
          'end'
        ]
        let i = battle.matches.length
        let try1 = -1
        while (i--) {
          const m = battle.matches[i]
          if (checkFirst.includes(m.status)) {
            try1 = i
            break;
          }
        }
        if (try1 > -1) {
          
          state.current_match = try1
        } else {
          const checkSecond = [
            'error',
            'success',
            'cancel',
            'technical',
          ]
          let i = battle.matches.length
          let try2 = -1
          while (i--) {
            const m = battle.matches[i]
            if (checkSecond.includes(m.status)) {
              try2 = i
              break;
            }
          }
          if (try2 > -1) {
            state.current_match = try2
          }
          // const try2 = battle.matches.findIndex(m => checkFirst.includes(m.status))
            //  else {
        //   state.current_match = 0
        // }
        }
      }
    }
    state.current_battle = battle
  },
  setGrid(state, gid) {
    state.grid.selected = gid
  },

  statusChange(state, newStatus) {
    state.tournament.status = newStatus
  },
  gridDisableToggle(state) {
    state.tournament.grid_disable = !state.tournament.grid_disable
  },
  leavelDisableToggle(state) {
    state.tournament.leave_disable = !state.tournament.leave_disable
  },
  start_in_loading(state, which) {
    state.in_loading[which] = true
  },
  stop_in_loading(state, which) {
    state.in_loading[which] = false
  },
  start_loading_detail(state) {
    state.tournament.in_loading = true
  },
  stop_loading_detail(state) {
    state.tournament.in_loading = false
  },
  untickJustDropped(state) {
    state.tournament.justDroppedDontRefresh = false
  },
  tickJustDropped(state) {
    state.tournament.justDroppedDontRefresh = true
  },
  movePlayer(state, {pid, team, role}) {
    let player = state.tournament.players.find(player => ((Number(player.user_id) === Number(pid)) && Number(player.round) === state.selectedRound))
    if (player) {
      player.team = team
      player.role = role
    } else {
      Vue.notify({
        group: 'n',
        text: 'Проблема с перемещением игрока, игрок не обнаружен('
      })
    }
  },
  swapPlayer(state, {pid1, pid2, /*inPlace*/}) {
    // let player1 = state.tournament.players.find(player => player.user_id == pid1)
    let player1 = state.tournament.players.find(player => ((Number(player.user_id) === Number(pid1)) && Number(player.round) === state.selectedRound))
    let player2 = state.tournament.players.find(player => ((Number(player.user_id) === Number(pid2)) && Number(player.round) === state.selectedRound))

    let tmp = {team: player1.team, role: player1.role}
    
    player1.team = player2.team
    player1.role = player2.role

    if (player2.team !== null) {
      player2.team = tmp.team
      player2.role = tmp.role
    }
  },
  playerKicked(state, user_id) {
    if (state.tournament.players) {
      const pidx = state.tournament.players.findIndex(p => p.user_id === user_id)
      if (pidx || pidx === 0) {
        state.tournament.players.splice(pidx, 1)
      }
    }
  },
  updateNote(state, {user_id, note}) {
    if (state.tournament.players) {
      const player = state.tournament.players.find(p => p.user_id === user_id)
      if (player) {
        player.note = note
      }
    }
  },


  changeRound(state, round) {
    state.selectedRound = round
  },
  setNextRoundLoading(state, val) {
    state.nextRoundLoading = val
  },



  
  repopulateOneTournament(state, tournamentData) {
    this.commit('tournament/refreshOneTournament', tournamentData)
    state.in_loading.tournament = false
    state.first_load = false
  },
  refreshOneTournament(state, tournamentData) {
    for (let key in tournamentData) {
      if (key === 'grids' && state.tournament.grids) {
        if (state.tournament.type === 'rtc') {
          let limbGrids = state.tournament.grids.filter(p => p.round !== tournamentData.round)
          limbGrids = limbGrids.concat(tournamentData.grids)
          Vue.set(state.tournament, 'grids', limbGrids)
        } else {
          state.tournament.grids = tournamentData.grids
        }

        // tournamentData.grids.forEach(incomingPiece => {
        //   let staleOneIndex = state.tournament.grids.findIndex(stalePiece => stalePiece.id === incomingPiece.id)
        //   if (staleOneIndex > -1) {
        //     Vue.set(state.tournament.grids, staleOneIndex, incomingPiece)
        //   } else {
        //     state.tournament.grids.push(incomingPiece)
        //   }
        // })
      } else if (key === 'players' && state.tournament.players) {
        // let limbPlayers = state.tournament.players.filter(p => p.round !== tournamentData.round)
        // limbPlayers = limbPlayers.concat(tournamentData.players)
        // Vue.set(state.tournament, 'players', limbPlayers)

        tournamentData.players.forEach(incomingPlayer => {
          let staleOneIndex = state.tournament.players.findIndex(stalePlayer => (stalePlayer.user_id === incomingPlayer.user_id && stalePlayer.round === incomingPlayer.round))
          if (staleOneIndex > -1) {
            Vue.set(state.tournament.players, staleOneIndex, incomingPlayer)
          } else {
            state.tournament.players.push(incomingPlayer)
          }
        })
        
        //deleting stale players
        state.tournament.players.forEach((pl, pidx) => {
          if (pl.round === tournamentData.round) {
            let staleOneIndex = tournamentData.players.findIndex(stalePlayer => (stalePlayer.user_id === pl.user_id && stalePlayer.round === pl.round))
            if (staleOneIndex === -1) {
              state.tournament.players.splice(pidx, 1)
            }
          }
        })
      } else if (key === 'selectedRound') {
        state.selectedRound = tournamentData.selectedRound
      } else {
        Vue.set(state.tournament, key, tournamentData[key])
      }
    }
  },
  resetTournament(state) {
    Vue.set(state, 'tournament', {
      players: [],
      in_loading: false,
      first_load: false
    })
  }

  // tournamentWrite(state, tournamentData) {},
}

export const actions = {
  changeMatchDataOnSelectedBattle (context, { mid, status, win }) {
    context.commit('changeMatchDataOnSelectedBattle', { mid, status, win })
  },
  deleteLastRound (context, tid) {
    context.commit('setNextRoundLoading', true)
    axiosInstance
      .post(`/api/tournaments/${tid}/events`, {
        event: 'delete_round'
      })
      .then(resp => {
        if (resp.data && resp.data.success === true) {
          Vue.notify({
            group: 'n',
            text: 'Раунд удален'
          })
        } else {
          Vue.notify({
            group: 'n',
            text: 'Ошибка удаления раунда('
          })
        }
        context.commit('setNextRoundLoading', false)
      })
      .catch(err => {
        console.log(err)
        context.commit('setNextRoundLoading', false)
        Vue.notify({
          group: 'n',
          text: 'Ошибка на сервере'
        })
      })
  },
  nextRound(context, tid) {
    context.commit('setNextRoundLoading', true)
    axiosInstance
      .post(`/api/tournaments/${tid}/events`, {
        event: 'new_round'
      })
      .then(resp => {
        if (resp.data && resp.data.success === true) {
          Vue.notify({
            group: 'n',
            text: 'Раунд добавлен'
          })
        } else {
          Vue.notify({
            group: 'n',
            text: 'Ошибка добавления раунда('
          })
        }
        context.commit('setNextRoundLoading', false)
      })
      .catch(err => {
        console.log(err)
        context.commit('setNextRoundLoading', false)
        Vue.notify({
          group: 'n',
          text: 'Ошибка на сервере'
        })
      })
  },
  initBattle(context, round) {
    //finding the battle, the player is in, or setting it to first one in the round
    let playerSelfProperRound = context.state.tournament.players
      .filter(p => p.round === round)
      .find(p => p.user_id === context.rootState.auth.user.id)
    
    let selectedBattle
    if (playerSelfProperRound) {
      let ownTeamId = playerSelfProperRound.team
      selectedBattle = context.state.tournament.grids
        .filter(m => m.round === round)
        .find(m => (m.team1 === ownTeamId || m.team2 === ownTeamId))
    }
    if (!selectedBattle) {
      selectedBattle = context.state.tournament.grids.filter(m => m.round === round)[0]
    }
    context.dispatch('setBattle', selectedBattle)
  },

  changeRound(context, round) {
    context.commit('changeRound', round)
    context.dispatch('initBattle', round)
  },
  playerKicked(context, user_id) {
    context.commit('playerKicked', user_id)
  },
  updateNote(context, {user_id, note}) {
    context.commit('updateNote', {user_id, note})
  },
  
  tryChangeStatus(context, {newStatus, tid}) {
    axiosInstance
      .post(
        '/api/tournaments/' + tid + '/events', //change this
        {
          event: 'status',
          status: newStatus
        },
        {withCredentials: true}
      )
      .then(r => {
        if (r && r.data && r.data.success) {
          // context.commit('statusChange', newStatus)
        } else {
          throw r.data.code
        }
      })
      .catch(err => {
        Vue.notify({
          group: 'n',
          text: i18n.t(err)
        })
      })
  },
  setMatch(context, match) {
    context.commit('setMatch', match)
  },
  setBattle(context, battle) {
    context.commit('setBattle', battle)
  },
  setGrid(context, gid) {
    context.commit('setGrid', gid)
  },
  movePlayer(context, opts) {
    context.commit('movePlayer', opts)
    axiosInstance
      .post(
        '/api/tournaments/' + context.state.tournament.id + '/events',
        {
          event: 'swap',
          user_id: opts.pid,
          team: opts.team,
          role: opts.role,
          round: context.state.selectedRound
        }
      )
      .then(resp => {
        if (resp.data && resp.data.success) {
          // 
        } else {
          Vue.notify({
            group: 'n',
            text: 'Не удалось передвинуть игрока'
          })
        }
      })
      .catch(err => {
        console.log('movePlayer', err)
        const code = err && err.data && err.data.code
          ? err.data.code
          : "no_code_error"
        Vue.notify({
          group: 'n',
          text: i18n.t(code),
          duration: 1800,
        })
      })
  },
  swapPlayer(context, opts) {
    context.commit('swapPlayer', opts)
    axiosInstance
      .post(
        '/api/tournaments/' + context.state.tournament.id + '/events',
        {
          event: 'swap',
          user_id: Number(opts.pid),
          team: opts.team,
          role: opts.role,
          round: context.state.selectedRound
        }
      )
      .then(resp => {
        if (resp.data && resp.data.success) {
          // 
        } else {
          Vue.notify({
            group: 'n',
            text: 'Неудалось передвинуть игрока'
          })
        }
      })
      .catch(err => {
        console.log('movePlayer', err)
        Vue.notify({
          group: 'n',
          text: i18n.t(err)
        })
      })
  },
  refreshTournamentOffscreen(context) {
    if (context.state.tournament && context.state.tournament.id) {
      axiosInstance
      .get('/api/tournaments/' + context.state.tournament.id, [])
      .then(response => {
        if (response && response.data) {
          const resp = response.data
          if (!context.state.tournament.justDroppedDontRefresh) {
            //if status is balanced and grid changed from nothing to smth
            //need to reselect different battle
            if (context.state.tournament.status !== resp.status) {
              Vue.notify({
                group: 'n',
                text: 'Игра перешла в фазу ' + resp.status,
                duration: 2500,
              })
            }
            if (
              resp.status === 'balance' &&
              (!context.state.tournament.grids || !context.state.tournament.grids.length) &&
              (resp.grids && resp.grids.length)
            ) {
              //смена фазы из другой в баланс
              context.commit('refreshOneTournament', resp)
              if (resp.grids && resp.grids.length) {
                // context.dispatch('setBattle', resp.grids[0])
                context.dispatch('initBattle', resp.round)
              }
            } else {
              context.commit('refreshOneTournament', resp)
            }
          } else {
            context.commit('untickJustDropped')
          }
        }
      })
    }
  },
  tickJustDropped(context) {
    context.commit('tickJustDropped')
  },
  enterTournament(context, {tid, idx}) {
    if (idx !== null) {
      context.commit('tournaments/start_in_loading_specific', idx, { root: true })
    } else {
      context.commit('start_loading_detail')
    }
    context.commit('start_in_loading', 'enter_leave')
    
    axiosInstance
      .post('/api/tournaments/' + tid + '/events', {'event': 'enter'})
      .then(response => {
        if (response.data.success === true) {
          context.commit('auth/changeActiveTournaments', response.data.tournaments_request, { root: true })
          context.dispatch('getTournamentDetails', tid)
          if (router.currentRoute.path !== '/tournaments/' + tid) {
            router.push('/tournaments/' + tid)
          }
        } else if (response.data.code === 'tournament.no_account' || response.data.code === 'tournament.no_account_active') {
          context.commit('tournaments/setTriedToJoin', tid, { root: true })
          context.commit('auth/setStartFrom3', false, { root: true })
          context.commit('main/setConnectModal', true, { root: true })
        } else if (response.data.code === 'tournament.no_profile') {
          context.commit('tournaments/setTriedToJoin', tid, { root: true })
          context.commit('auth/setStep', 3, { root: true })
          context.commit('auth/setGeneratedPic', -1, { root: true })
          context.commit('auth/setConnectStatus', 'Аккаунт подтвержден, выберите лигу, приоритеты ролей и нажмите "Сохранить"', { root: true })
          context.commit('auth/setLeague', response.data.league || {}, { root: true })
          context.commit('auth/setStartFrom3', true, { root: true })
          context.commit('main/setConnectModal', true, { root: true })
        } else {
          const code = response && response.data && response.data.code
            ? response.data.code
            : "no_code_error"
          Vue.notify({
            group: 'n',
            text: i18n.t(code),
            duration: 1800,
          })
          
        }
        if (idx !== null) {
          context.commit('tournaments/stop_in_loading_specific', idx, { root: true })
        } else {
          context.commit('start_loading_detail')
        }
        context.commit('stop_in_loading', 'enter_leave')
      })
      .catch(err => {
        context.commit('stop_in_loading', 'enter_leave')
        Vue.notify({
          group: 'n',
          text: i18n.t(err)
        })
        if (idx !== null) {
          context.commit('tournaments/stop_in_loading_specific', idx, { root: true })
        } else {
          context.commit('start_loading_detail')
        }
      })
  },
  leaveTournament(context, tid) {
    context.commit('start_in_loading', 'enter_leave')
    axiosInstance
      .post('/api/tournaments/' + tid + '/events', {'event': 'leave'}, {withCredentials: true})
      .then(response => {
        if (response.data.success == true) {
          context.commit('auth/changeActiveTournaments', response.data.tournaments_request, { root: true })
          context.dispatch('getTournamentDetails', tid)
        } else {
          Vue.notify({
            group: 'n',
            text: i18n.t(response.data.code),
            duration: 1800,
          })
        }
        context.commit('stop_in_loading', 'enter_leave')
      })
      .catch(err => {
        console.log('error at store/tournaments/leaveTournament', err)
        Vue.$notify({
          group: "n",
          text: i18n.t(err),
          duration: 1800,
          type: "error",
        });
        context.commit('stop_in_loading', 'enter_leave')
      })
  },
  
  leaveDisableToggle(context) {
    context.commit('tickJustDropped')
    context.commit('leavelDisableToggle')
    axiosInstance
      .put('/api/tournaments/' + context.state.tournament.id,
        {'leave_disable': context.state.tournament.leave_disable })
      // .then(() => {})
      .catch(err => {
        console.log('error at store/tournaments/leaveDisableToggle', err)
      })
  },
  gridDisableToggle(context) {
    context.commit('tickJustDropped')
    context.commit('gridDisableToggle')
    axiosInstance
      .put(
        '/api/tournaments/' + context.state.tournament.id,
        {'grid_disable': context.state.tournament.grid_disable },
      )
      // .then(() => {})
      .catch(err => {
        console.log('error at store/tournaments/gridDisableToggle', err)
      })
  },
  statusNext(context) {
    axiosInstance
      .post(
        '/api/tournaments/' + context.state.tournament.id + '/events',
        {'event': 'status_next'}
      )
      .then(response => {
        if (response.data.success == true) {
          context.statusChange('statusNext', response.data.status)
        } else {
          Vue.notify({
            group: 'n',
            text: i18n.t(response.data.code),
            duration: 1800,
          })
          console.log('fail at statusNext', response.data)
        }
      })
      .catch(err => {
        console.log('error at store/tournaments/statusNext', err)
      })
  },


// 
  getTournamentDetails(context, tid) {
    context.commit('start_in_loading', 'tournament')
    console.log('cppppp', context.state.tournament)
    let dontReset = (context.state.tournament.id && context.state.tournament.id === Number(tid))
    let url = '/api/tournaments/' + tid + (dontReset ? '' : '?round=all')
    axiosInstance
      .get(url, [])
      .then(response => {
        if (response && response.data) {
          let resp = response.data
          if (!dontReset) {
            context.commit('resetTournament')
          }
          resp.selectedRound = resp.round
          context.commit('repopulateOneTournament', resp)

          context.dispatch('initBattle', resp.round)
        }
      })
  },
}