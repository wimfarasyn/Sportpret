<template>
  <b-container fluid>
    <b-row align-h="center" class="m-1">
      <h1 class="display-1 landing">INSCHRIJVINGEN
        <br>SPORTDAGEN</h1>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col cols="12" v-for="(seizoen, idx) in seizoenen" :key="idx" class="p-2">
        <center>
          <div v-if="seizoen.Actief">
            <b-btn v-b-modal.login variant="secondary" @click="setSeizoen(seizoen, $event)">Log in voor {{ seizoen.Naam }}</b-btn>
          </div>
        </center>
      </b-col>
    </b-row>
    <div>
      <b-modal id="login" hide-header-close :hide-footer="true" header-bg-variant="warning" header-text-variant="light" header-border-variant="warning"
        body-bg-variant="warning" body-text-variant="light" footer-bg-variant="warning" footer-text-variant="light" footer-border-variant="warning">
        <div style="text-align: center" slot="modal-header" class="w-100">
          <h5>Login - {{ seizoen.Naam }}</h5>
        </div>
        <b-form>
          <b-input-group prepend="Email">
            <b-form-input placeholder="Email adres" v-model="email"></b-form-input>
          </b-input-group>
          <p></p>
          <b-input-group prepend="Paswoord">
            <b-form-input type="password" placeholder="Paswoord" v-model="password"></b-form-input>
          </b-input-group>
          <p></p>
          <b-btn type="submit" variant="secondary" @click.prevent="login">Log in</b-btn>
        </b-form>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

export default {
  name: 'landing',
  beforeCreate () {
    document.body.className = 'bg-warning'
  },
  firebase: {
    seizoenen: db.ref('Seizoenen').orderByChild('Sequence')
  },
  data () {
    return {
      seizoen: '',
      email: '',
      password: '',
      organisatie: ''
    }
  },
  methods: {
    setSeizoen: function (seizoenObject, event) {
      this.seizoen = seizoenObject
      this.$root.$data.setSeizoen(seizoenObject)
    },
    login () {
      firebaseApp.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
        this.email = ''
        this.organisatie = ''
        this.password = ''
        this.$root.$data.setUserID(user.uid)
        this.$root.$data.setUser(user)
        var u
        return db.ref('/Users/' + user.uid).once('value').then(result => {
          u = result.val()
          this.$root.$data.setOrg(u.Organisatie)
          this.$router.push('/home')
        })
      }, error => {
        alert('Login mislukt: ' + error)
        this.$router.replace('/')
      })
    }
  }
}
</script>

<style scoped>
.landing {
  color: white;
  text-align: center;
}
</style>
