export const state = {
	typeSelected: null,
	end: null,
	start: null,
	status: null,
	ftypes: ['all', 'rtc', 'rtc_all', 'team_all']
}

export const getters = {
	getUrlString(state) {
		// const dateTransform = (date) => new Date(date).toISOString().substring(0,10).split('-').reverse().join('-').replaceAll('-','.')
		let str = ''
		// if (state.start)  str += '&start=' + dateTransform(state.start)
		// if (state.end)    str += '&end=' + dateTransform(state.end)
		if (state.status) str += '&status=' + state.status
		if (state.typeSelected && state.typeSelected !== 'all') str += '&type=' + state.typeSelected
		return str
	},
}

export const mutations = {
	getFromLocalStorage(state) {
		const filters = JSON.parse(localStorage.getItem('filters'))
		if (filters) {
			state.typeSelected = filters.typeSelected
			state.start = filters.start
			state.end = filters.end
			state.status = filters.status
		}
	},
	saveToLocalStorageAndReload(state) {
		localStorage.setItem('filters', JSON.stringify({ typeSelected: state.typeSelected, end: state.end, start: state.start, status: state.status }))
		this.dispatch('tournaments/getSomeTournaments', 1)
	},
	toggleStatus(state) {
		state.status = state.status !== 'end' ? 'end' : null
		this.commit('filters/saveToLocalStorageAndReload')
	},
	setType(state, ftyp) {
		state.typeSelected = ftyp
		this.commit('filters/saveToLocalStorageAndReload')
	},
	setDates(state, dates) {
		state.start = dates[0]
		state.end = dates[1]
		this.commit('filters/saveToLocalStorageAndReload')
	}
}

export const actions = {
	toggleStatus(context) {
		context.commit('toggleStatus')
	},
	setType(context, ftyp) {
		context.commit('setType', ftyp)
	},
	setDates(context, dates) {
		context.commit('setDates', dates)
	}
}
