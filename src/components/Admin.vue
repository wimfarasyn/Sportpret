<template>
    <b-container fluid class="m-2">
        <b-row class="p-0">
          <b-col cols="12 m-0 p-0">
            <appHeader></appHeader>
          </b-col>
        </b-row>
        <h1>ADMIN</h1>
        <hr>
        <h2>Seizoenen</h2>
        <div class="row m-2">
            <div class="col-3">
                <div v-for="(seizoen, key) in seizoenen" v-bind:key="key">
                    <b-btn variant="link" href="" @click='setForm1(seizoen, $event)'>{{ seizoen.Naam }}</b-btn>
                </div>
            </div>
            <div class="col-9">
                <b-form @submit.prevent="submitSeizoen" @reset.prevent="resetSeizoen">
                    <b-form-group label="Firebase ID" horizontal><b-form-input v-model="seizoen.id" disabled>{{ this.seizoen.id }}</b-form-input></b-form-group>
                    <b-form-group label="Sequence" horizontal><b-form-input v-model="seizoen.Sequence"></b-form-input></b-form-group>
                    <b-form-group label="Naam" horizontal><b-form-input v-model="seizoen.Naam"></b-form-input></b-form-group>
                    <b-form-group label="Data" horizontal><b-form-input v-model="seizoen.Data"></b-form-input></b-form-group>
                    <b-form-group label="Actief" horizontal><b-form-checkbox v-model="seizoen.Actief"></b-form-checkbox></b-form-group>
                    <b-form-group label="Max Inschrijvingen per kind" horizontal><b-form-input v-model="seizoen.MaxPerKind"></b-form-input></b-form-group>
                    <b-form-group label="Max kleuters per dag" horizontal><b-form-input v-model="seizoen.MaxKleuters"></b-form-input></b-form-group>
                    <b-form-group label="Max leerlingen per dag" horizontal><b-form-input v-model="seizoen.MaxLeerlingen"></b-form-input></b-form-group>
                    <b-btn type="submit" class="m-1">Submit</b-btn><b-btn type="reset" class="m-1">Reset</b-btn>
                </b-form>
            </div>
        </div>
        <hr>
        <h2>Organisaties</h2>
        <div class="row m-2">
            <div class="col-3">
                <div v-for="(organisatie, key) in organisaties" v-bind:key="key">
                    <b-btn variant="link" href="" @click='setForm2(organisatie, $event)'>{{ organisatie.Naam }}</b-btn>
                </div>
            </div>
            <div class="col-9">
                <b-form @submit.prevent="submitOrganisatie" @reset.prevent="resetOrganisatie">
                    <b-form-group label="Firebase ID"><b-form-input v-model="organisatie.id" disabled>{{ this.organisatie.id }}</b-form-input></b-form-group>
                    <b-form-group label="Naam"><b-form-input v-model="organisatie.Naam"></b-form-input></b-form-group>
                    <b-btn type="submit" class="m-1">Submit</b-btn><b-btn type="reset" class="m-1">Reset</b-btn>
                </b-form>
            </div>
        </div>
        <hr>
        <h2>Gebruikers</h2>
        <div class="row m-2">
            <div class="col-3">
                <div v-for="(user, key) in users" v-bind:key="key">
                    <b-btn variant="link" href="" @click='setForm3(user, $event)'>{{ user.Naam }}</b-btn>
                </div>
            </div>
            <div class="col-9">
                <b-form @submit.prevent="submitUser" @reset.prevent="resetUser">
                    <b-form-group label="Firebase ID"><b-form-input v-model="user.id" disabled>{{ this.user.id }}</b-form-input></b-form-group>
                    <b-form-group label="Email"><b-form-input v-model="user.Email" disabled>{{ this.user.Email }}</b-form-input></b-form-group>
                    <b-form-group label="Naam"><b-form-input v-model="user.Naam" disabled></b-form-input></b-form-group>
                    <b-form-group label="Organisatie"><b-form-input v-model="user.Organisatie" disabled></b-form-input></b-form-group>
                    <b-btn type="reset" class="m-1">Reset</b-btn>
                </b-form>
            </div>
        </div>
    </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

export default {
  name: 'admin',
  components: {
    appHeader: MyHeader
  },
  data () {
    return {
      seizoen: {
        id: '',
        Sequence: '',
        Naam: '',
        Data: '',
        Actief: null,
        MaxPerKind: '',
        MaxKleuters: '',
        MaxLeerlingen: ''
      },
      organisatie: {
        id: '',
        Naam: ''
      },
      user: {
        id: '',
        Naam: '',
        Email: '',
        Organisatie: ''
      }
    }
  },
  firebase: {
    seizoenen: db.ref('Seizoenen').orderByChild('Sequence'),
    organisaties: db.ref('Organisaties'),
    users: db.ref('Users')
  },
  beforeCreate () {
    document.body.className = 'bg-warning'
  },
  methods: {
    submitSeizoen: function () {
      if (!this.seizoen.id.trim()) { // nieuw seizoen
        if (this.seizoen.Naam.trim() && this.seizoen.Data.length) {
          var dataArrayNew = this.seizoen.Data.split(',')
          var dataObjectNew = {}
          for (var i = 0; i < dataArrayNew.length; i++) {
            dataObjectNew[dataArrayNew[i]] = { Kleuters: 0, Leerlingen: 0 }
          }
          db.ref('Seizoenen').push({
            Naam: this.seizoen.Naam,
            Sequence: this.seizoen.Sequence,
            Data: dataObjectNew,
            Actief: this.seizoen.Actief,
            MaxPerKind: this.seizoen.MaxPerKind,
            MaxKleuters: this.seizoen.MaxKleuters,
            MaxLeerlingen: this.seizoen.MaxLeerlingen
          })
        }
        return
      } // update
      if (this.seizoen.Naam.trim() && this.seizoen.Data.length) {
        var dataArrayUpdate = this.seizoen.Data.split(',')
        var dataObjectUpdate = {}
        db.ref('Seizoenen').child(this.seizoen.id).child('Data').once('value').then((r) => {
          var rr = r.val()
          for (var i = 0; i < dataArrayUpdate.length; i++) {
            if (dataArrayUpdate[i] in rr) {
              dataObjectUpdate[dataArrayUpdate[i]] = {
                Kleuters: rr[dataArrayUpdate[i]]['Kleuters'],
                Leerlingen: rr[dataArrayUpdate[i]]['Leerlingen']
              }
            } else {
              dataObjectUpdate[dataArrayUpdate[i]] = {
                Kleuters: 0,
                Leerlingen: 0
              }
            }
          }
          db.ref('Seizoenen').child(this.seizoen.id).set({
            Naam: this.seizoen.Naam,
            Sequence: this.seizoen.Sequence,
            Data: dataObjectUpdate,
            Actief: this.seizoen.Actief,
            MaxPerKind: this.seizoen.MaxPerKind,
            MaxKleuters: this.seizoen.MaxKleuters,
            MaxLeerlingen: this.seizoen.MaxLeerlingen
          })
        })
      }
    },
    resetSeizoen: function (event) {
      this.seizoen.id = ''
      this.seizoen.Sequence = ''
      this.seizoen.Naam = ''
      this.seizoen.Data = ''
      this.seizoen.Actief = null
      this.seizoen.MaxPerKind = ''
      this.seizoen.MaxKleuters = ''
      this.seizoen.MaxLeerlingen = ''
    },
    setForm1: function (s, e) {
      this.seizoen.id = s['.key']
      this.seizoen.Sequence = s.Sequence
      this.seizoen.Naam = s.Naam
      this.seizoen.Data = Object.keys(s.Data).toString()
      this.seizoen.Actief = s.Actief
      this.seizoen.MaxPerKind = s.MaxPerKind
      this.seizoen.MaxKleuters = s.MaxKleuters
      this.seizoen.MaxLeerlingen = s.MaxLeerlingen
    },
    setForm2: function (o, e) {
      this.organisatie.id = o['.key']
      this.organisatie.Naam = o.Naam
    },
    resetOrganisatie: function (event) {
      this.organisatie.id = ''
      this.organisatie.Naam = ''
    },
    submitOrganisatie: function () {
      if (!this.organisatie.id.trim()) { // nieuwe org
        if (this.organisatie.Naam.trim()) {
          this.$firebaseRefs.organisaties.push({
            'Naam': this.organisatie.Naam
          })
        }
        return
      } // update
      if (this.organisatie.Naam.trim()) {
        db.ref('Organisaties').child(this.organisatie.id).set({
          'Naam': this.organisatie.Naam
        })
      }
    },
    setForm3: function (u, e) {
      this.user.id = u['.key']
      this.user.Email = u.Email
      this.user.Naam = u.Naam
      this.user.Organisatie = u.Organisatie
    },
    resetUser: function (event) {
      this.user.id = ''
      this.user.Email = ''
      this.user.Naam = ''
      this.user.Organisatie = ''
    }
  }
}
</script>

<style scoped>
.admin {
  color: red;
}
</style>
