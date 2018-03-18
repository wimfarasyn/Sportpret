import Vue from 'vue'
import Router from 'vue-router'
import Landing from '../components/Landing.vue'
import Home from '../components/Home.vue'
import Inschrijven from '../components/Inschrijven.vue'
import Overzicht from '../components/Overzicht.vue'
import Organisatie from '../components/Organisatie.vue'
import Admin from '../components/Admin.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Landing },
    { path: '/home', component: Home, meta: { requiresAuth: true } },
    { path: '/inschrijven', component: Inschrijven, meta: { requiresAuth: true } },
    { path: '/inschrijven/:id1/:id2', component: Inschrijven, meta: { requiresAuth: true } },
    { path: '/overzicht', component: Overzicht, meta: { requiresAuth: true } },
    { path: '/organisatie', component: Organisatie, meta: { requiresAuth: true } },
    { path: '/organisatie/:id', component: Organisatie, meta: { requiresAuth: true } },
    { path: '/admin', component: Admin, meta: { requiresAuth: true } }
  ]
})
