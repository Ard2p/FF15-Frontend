import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
import i18n from './i18n'

Vue.use(VueI18n)

import Meta from 'vue-meta';

Vue.use(Meta);

Vue.config.productionTip = false

import VueYandexMetrika from 'vue-yandex-metrika'
const FF15 = location.hostname === 'ff15.ru'
Vue.use(VueYandexMetrika, {
	id: 68748787,
	router: router,
	env: FF15 ? 'production' : 'dev',
	options: {
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true
	}
})

import Notifications from 'vue-notification'
Vue.use(Notifications)

//check auth, inititally here, needs improvement, so login buttons dont jump
store.dispatch('auth/tryAuth', router)


Vue.directive('click-outside', {
	bind: function (el, binding, vnode) {
		el.clickOutsideEvent = function (event) {
			// here I check that click was outside the el and his children
			if (!(el == event.target || el.contains(event.target))) {
				// and if it did, call method provided in attribute value
				vnode.context[binding.expression](event);
			}
		};
		document.addEventListener('click', el.clickOutsideEvent)
	},
	unbind: function (el) {
		document.removeEventListener('click', el.clickOutsideEvent)
	}
})

Vue.mixin({
	methods: {
		can(perm) {
			const usr = store.state.auth.user
			if (!usr || !Number.isInteger(usr.id) || !store.state.auth.user.permissions) return false
			const perms = store.state.auth.user.permissions
			return perms.includes(perm)
		},
		canSelf(perm, who) {
			const usr = store.state.auth.user
			if (!usr || !Number.isInteger(usr.id) || !store.state.auth.user.permissions) return false
			const uid = usr.id
			const perms = usr.permissions
			return perms.includes(perm) && (who === uid)
		}
	}
})


new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app')
