import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from "./routes";

Vue.use(VueRouter)



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// router.beforeEach((to, from, next) => {
//   if (
//     to.path !== '/' &&
//     to.path !== '/verify' &&
//     to.path !== '/privacy' &&
//     to.path !== '/agreement'
//   ) {
//     if (store.getters['auth/isAuthed'] || (store.state.auth.user && ('id' in store.state.auth.user))) {
//       next()
//     } else {
//       next('/')
//     }
//   } else {
//     next()
//   }
// })

export default router
