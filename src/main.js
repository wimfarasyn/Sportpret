import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueFire from 'vuefire'
import firebaseApp from './firebase/firebase'
import Vuelidate from 'vuelidate'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import Storage from 'vue-web-storage'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/graduation-cap'
import 'vue-awesome/icons/exclamation-triangle'
import 'vue-awesome/icons/file-excel-o'
import Icon from 'vue-awesome/components/Icon'
import JsonExcel from 'vue-json-excel'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueFire)
Vue.use(Vuelidate)
Vue.use(VCalendar, {
  firstDayOfWeek: 2,
  monthLabels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
  weekdayLabels: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  navVisibility: 'hidden'
})
Vue.use(Storage, {
  prefix: 'sportpret__'
})
Vue.component('icon', Icon)
Vue.component('downloadExcel', JsonExcel)

router.beforeEach((to, from, next) => {
  const currentUser = firebaseApp.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

var store = {
  state: {
    seizoen: {},
    auth: {
      userID: '',
      user: '',
      organisatie: ''
    }
  },
  saveState () {
    Vue.$storage.set('state', JSON.stringify(this.state))
  },
  setSeizoen (seizoenObject) {
    this.state.seizoen = seizoenObject
    this.saveState()
  },
  setUserID (newValue) {
    this.state.auth.userID = newValue
    this.saveState()
  },
  setUser (newValue) {
    this.state.auth.user = newValue
    this.saveState()
  },
  setOrg (newValue) {
    this.state.auth.organisatie = newValue
    this.saveState()
  }
}

firebaseApp.auth().onAuthStateChanged(function (user) {
// eslint-disable-next-line
  new Vue({
    data: store,
    router,
    el: '#app',
    firebase: {},
    render: h => h(App)
  })
})
