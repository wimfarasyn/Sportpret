<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col cols="12" class="m-3 text-center">
        <b-btn v-if='!(!auth.sportpret && seizoen.Afgesloten)' variant="warning" size="lg" @click="schrijfIn">SCHRIJF EEN KIND IN</b-btn>
        <div v-else>Het seizoen is afgesloten voor nieuwe inschrijvingen.</div>
      </b-col>
      <b-col cols="12" class="m-3 text-center">
        <b-btn variant="warning" size="lg" @click="overzicht" class='position-relative'>BEKIJK INSCHRIJVINGEN
          <div class='myBadges'>
              <div class='d-inline-flex m-0 p-0'><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalIngeschrevenKinderen }}</b-badge><small class='text-secondary pl-1'>Ingeschreven kinderen</small></div>
              <div class='d-inline-flex mt-1 p-0'><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalInschrijvingen }}</b-badge><small class='text-secondary pl-1'>Inschrijvingen</small></div>
          </div>
        </b-btn>
      </b-col>
      <b-col cols="12" class="m-3 text-center">
          <b-btn v-if="auth.sportpret" variant="warning" size="lg" @click="organisatie">ORGANISATIE</b-btn>
      </b-col>
      <b-col cols="12" class="m-3 text-center">
          <b-btn v-if="auth.sportpret" variant="warning" size="lg" @click="admin">ADMINISTRATIE</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

export default {
  name: 'home',
  components: {
    appHeader: MyHeader
  },
  beforeCreate () {
    document.body.className = ''
  },
  data () {
    return {}
  },
  computed: {
    auth: function () {
      return {
        user: this.$root.$data.state.auth.user,
        organisatie: this.$root.$data.state.auth.organisatie,
        userID: this.$root.$data.state.auth.userID,
        sportpret: this.$root.$data.state.auth.organisatie === 'Sportpret'
      }
    },
    seizoen: function () {
      return this.$root.$data.state.seizoen
    },
    aantalIngeschrevenKinderen: function () {
      return this.inschrijvingen.filter(i => { if (i.seizoen === this.seizoen['.key']) return i }).length
    },
    aantalInschrijvingen: function () {
      return this.inschrijvingen.filter(i => { if (i.seizoen === this.seizoen['.key']) return i }).map(i => { if (i.hasOwnProperty('Data')) { return Object.keys(i.Data).length } else { return 0 } }).reduce((a, b) => { return a + b }, 0)
    }
  },
  firebase: function () {
    if (this.auth.sportpret) {
      return {
        inschrijvingen: db.ref('Inschrijvingen')
      }
    } else {
      return {
        inschrijvingen: db.ref('Inschrijvingen').orderByChild('organisatie').equalTo(this.auth.organisatie)
      }
    }
  },
  methods: {
    schrijfIn () {
      this.$router.push('/inschrijven')
    },
    overzicht () {
      this.$router.push('/overzicht')
    },
    organisatie () {
      this.$router.push('/organisatie')
    },
    admin () {
      this.$router.push('/admin')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.myBadges {
  position: absolute;
  height: 100%;
  display: flex;
  flex-direction: column;
  vertical-align: middle;
  top: 1%;
  left: 97%;
  text-align: left;
}
</style>
