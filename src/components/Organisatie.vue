<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-2">
      <b-col cols='4'>
        <v-calendar v-bind='calendarProps' :attributes='attributes' @dayclick='dayClicked' class='mt-3'></v-calendar>
        <b-row class='mt-4'>
          <b-col cols='6'>
            <h5>Kleuters</h5>
            <div><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalKleuters }}</b-badge> Inschrijvingen</div>
            <div><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalLaatsteKleuters }}</b-badge> Laatste deelname</div>
          </b-col>
          <b-col cols='6'>
            <h5>Leerlingen</h5>
            <div><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalLeerlingen }}</b-badge> Inschrijvingen</div>
            <div><b-badge variant='light' class='text-warning' style='box-shadow: 2px 2px 1px grey'>{{ aantalLaatsteLeerlingen }}</b-badge> Laatste deelname</div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols='8'>
        <b-list-group class="pre-scrollable mt-3">
          <b-list-group-item v-for='(i, k) in inschrijvingenDag' :key='k'>
            <div class='w-100 m-0 p-0'>
              <b-form-checkbox class='align-middle m-0' :checked='i["Data"][selectedDate] === "Aanwezig"' @change='toggleAanwezigheid(i)'></b-form-checkbox>
              <span class='align-middle'>{{ i.voornaam }} {{ i.naam}}</span>
              <span v-if='i.opmerking'><icon class='m-0 p-0 text-danger align-middle' name='exclamation-triangle' v-b-popover.hover.bottom='i.opmerking'></icon></span>
              <b-btn variant="link" class="m-0 p-0 text-dark align-middle" @click="selecteerInschrijving(i['.key'])" v-b-modal.details><icon name="edit"></icon></b-btn>
              <b-btn v-if='i.groep === "Kleuters"' variant='outline-warning m-0 align-middle' size='sm' disabled><strong>3-6</strong></b-btn>
              <b-btn v-else variant='outline-warning m-0 align-middle' size='sm' disabled><strong>6-9</strong></b-btn>
              <b-btn v-if='selectedDate === Object.keys(i.Data).sort().slice(-1)[0]' variant='link' class='text-dark align-middle' size='sm'><icon name="graduation-cap"></icon></b-btn>
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-modal id="details" centered :hide-header="true" :hide-footer="true" @shown="openModal" return-focus="document.body">
          <appInschrijfFormulier :inschrijvingKey="geselecteerdeInschrijving" mode="Display" v-on:groepVeranderd="selecteer"></appInschrijfFormulier>
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'
import InschrijfFormulier from './InschrijfFormulier.vue'
import bus from '../eventBus.js'
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

const ACTIVITEIT = { borderColor: '#ffc107', backgroundColor: '', borderWidth: 1 }
const GESELECTEERD = { borderColor: '#ffc107', backgroundColor: '#ffc107', borderWidth: 1 }

function myStrToDate (str) {
  if (str) {
    return new Date(Number(str.split('-')[0]), Number(str.split('-')[1]) - 1, Number(str.split('-')[2]))
  }
};

export default {
  components: {
    appHeader: MyHeader,
    appInschrijfFormulier: InschrijfFormulier
  },
  data: function () {
    return {
      selectedDate: null,
      inschrijvingen: null,
      geselecteerdeInschrijving: ''
    }
  },
  computed: {
    auth: function () {
      return {
        user: this.$root.$data.state.auth.user,
        userID: this.$root.$data.state.auth.userID,
        sportpret: (this.$root.$data.state.auth.organisatie === 'Sportpret')
      }
    },
    seizoen: function () {
      return this.$root.$data.state.seizoen
    },
    seizoenFix: function () { return this.$root.$data.state.seizoen },
    seizoenFirstdate: function () { return Object.keys(this.seizoenFix.Data).sort()[0] },
    seizoenLastdate: function () { return Object.keys(this.seizoenFix.Data).sort().reverse()[0] },
    calendarProps: function () {
      return {
        fromPage: { month: Number(this.seizoenFirstdate.split('-')[1]), year: Number(this.seizoenFirstdate.split('-')[0]) },
        minPage: { month: Number(this.seizoenFirstdate.split('-')[1]), year: Number(this.seizoenFirstdate.split('-')[0]) },
        maxPage: { month: Number(this.seizoenLastdate.split('-')[1]), year: Number(this.seizoenLastdate.split('-')[0]) }
      }
    },
    attributes: function () {
      return Object.entries(this.seizoenFix.Data).map(d => {
        var rObj = {}
        rObj['key'] = d[0]
        if (d[0] === this.selectedDate) { rObj['highlight'] = GESELECTEERD } else { rObj['highlight'] = ACTIVITEIT }
        rObj['dates'] = myStrToDate(d[0])
        rObj['customData'] = d
        return rObj
      })
    },
    aantalKleuters: function () {
      if (this.selectedDate) { return this.seizoenLive.Data[this.selectedDate]['Kleuters'] }
    },
    aantalLaatsteKleuters: function () {
      if (this.selectedDate) { return this.inschrijvingen.filter(i => { if (i.groep === 'Kleuters' && this.selectedDate === Object.keys(i.Data).sort().slice(-1)[0]) return i }).length }
    },
    aantalLeerlingen: function () {
      if (this.selectedDate) { return this.seizoenLive.Data[this.selectedDate]['Leerlingen'] }
    },
    aantalLaatsteLeerlingen: function () {
      if (this.selectedDate) { return this.inschrijvingen.filter(i => { if (i.groep === 'Leerlingen' && this.selectedDate === Object.keys(i.Data).sort().slice(-1)[0]) return i }).length }
    },
    inschrijvingenDag: function () {
      if (this.selectedDate) {
        return this.inschrijvingen.filter(i => { if (i['Data'].hasOwnProperty(this.selectedDate)) return i }).sort(function (a, b) {
          var x = a['voornaam'].toLowerCase()
          var y = b['voornaam'].toLowerCase()
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        })
      }
    }
  },
  methods: {
    dayClicked: function (day) {
      this.selectedDate = day.attributes[0].key
    },
    selecteerInschrijving: function (key) {
      this.geselecteerdeInschrijving = key
    },
    openModal: function () {
      bus.$emit('modalShown')
    },
    selecteer: function (key) {
      this.selecteerInschrijving(key)
    },
    toggleAanwezigheid: function (i) {
      var uObj = {}
      if (i['Data'][this.selectedDate] === 'Ingeschreven') {
        console.log('aanwezig')
        uObj['/Data/' + this.selectedDate] = 'Aanwezig'
        this.$firebaseRefs.inschrijvingen.child(i['.key']).update(uObj)
        uObj = {}
      } else {
        console.log('afwezig')
        uObj['/Data/' + this.selectedDate] = 'Ingeschreven'
        this.$firebaseRefs.inschrijvingen.child(i['.key']).update(uObj)
        uObj = {}
      }
    }
  },
  created () {
    this.$bindAsObject('seizoenLive', db.ref('Seizoenen').child(this.seizoen['.key']))
    this.$bindAsArray('inschrijvingen', db.ref('Inschrijvingen').orderByChild('seizoen').equalTo(this.seizoen['.key']))
  }
}
</script>

<style>

</style>
