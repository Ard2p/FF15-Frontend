import store from "../store";

import Home from "../views/Home";
import Tournaments from "../views/Tournaments";
import Ratings from "../views/Ratings";
import SeasonStats from "../views/SeasonStats";
import Tournament from "../views/Tournament";
import OwnProfile from "../views/OwnProfile";
import Settings from "../views/Settings";
import Profile from "../views/Profile";
import Error404 from "../views/Error404";
import Faq from "../views/Faq";
import Privacy from "../views/Privacy";
import Agreement from "../views/Agreement";
import ShopPage from "../views/ShopPage";

// import Contacts from '../views/Contacts.vue'
// import GridTestingPage from '../views/GridTestingPage.vue'

export const routes = [
  {
    name: 'promo',
    path: '/',
    alias: '/verify',
    component: Home,
    props: true,
    meta: {
      layout: 'div'
    },
    beforeEnter(to, from, next) {
      if (store.getters['auth/isAuthed']) {
        // next('/tournaments')
        const newPath = '/tournaments'
        next({
          path: newPath,
          query: {
            ...to.query
          }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/tournaments',
    component: Tournaments
  },
  {
    path: '/ratings',
    component: Ratings
  },
  {
    path: '/season-stats',
    component: SeasonStats
  },
  {
    name: 'tournament-detail',
    path: '/tournaments/:tid',
    component: Tournament,
    props: true
  },
  {
    path: '/profile',
    component: OwnProfile,
    props: true
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/profiles/:uid',
    component: Profile,
    props: true
  },
  {
    path: '/error404',
    component: Error404
  },
  {
    path: '/faq',
    component: Faq
  },
  {
    path: '/privacy',
    component: Privacy,
    meta: {
      layout: 'div'
    },
  },
  {
    path: '/agreement',
    component: Agreement,
    meta: {
      layout: 'div'
    },
  },
  {
    path: '/shop',
    component: ShopPage,
  },
  // {
  //   name: 'grid-test',
  //   path: '/grid-test',
  //   component: GridTestingPage,
  //   props: true
  // },
  // {
  //   path: '/contacts',
  //   component: Contacts
  // },

  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "other" */ '../views/admin/Home.vue'),
    meta: { layout: 'AdminLayout' },

    beforeEnter(to, from, next) {
      if (
        !store.state ||
        !store.state.auth ||
        !store.state.auth.user ||
        !store.state.auth.user.permissions ||
        !store.state.auth.user.permissions.includes('admin@view')
      ) {
        next('/tournaments')
      } else {
        next()
      }
    },

    children: [
      {
        path: 'tournaments',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/tournaments/List.vue'),
        meta: { layout: 'AdminLayout' }
      },
      {
        name: 'admin-tournaments-form',
        path: 'tournaments/new',
        alias: 'tournaments/:id',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/tournaments/Edit.vue'),
        meta: { layout: 'AdminLayout' },
        props: true
      },
      {
        path: 'banners',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/banners/List.vue'),
        meta: { layout: 'AdminLayout' }
      },
      {
        name: 'admin-banners-form',
        path: 'banners/:id',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/banners/Edit.vue'),
        meta: { layout: 'AdminLayout' }
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/users/List.vue'),
        meta: { layout: 'AdminLayout' }
      },
      {
        path: 'faq',
        component: () => import(/* webpackChunkName: "other" */ '../views/admin/faq/List.vue'),
        meta: { layout: 'AdminLayout' }
      },
    ]
  },
]