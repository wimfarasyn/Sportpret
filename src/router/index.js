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
    { path: '/', name: 'Landing', component: Landing },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/inschrijven', name: 'Inschrijven', component: Inschrijven, meta: { requiresAuth: true } },
    { path: '/overzicht', name: 'Overzicht', component: Overzicht, meta: { requiresAuth: true } },
    { path: '/organisatie', name: 'Organisatie', component: Organisatie, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } }
  ]
})
