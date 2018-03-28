<template>
  <div>
    <p v-if="!isDisplayOnly">Selecteer maximum {{ maxInschrijvingenPerKind }} dagen waarop een activiteit georganiseerd wordt.</p>
    <v-calendar v-bind="calendarProps" :attributes="attributes" @dayclick="dayClicked" is-expanded></v-calendar>
    <div class="row mt-1 justify-content-center align-items-center">
      <div class="rounded-circle bg-warning" style="width: 20px; height: 20px;"></div>
      <div class="ml-1"> = Ingeschreven</div>
      <div class="ml-2" style="width: 20px; height: 20px; border-color: rgb(255, 193, 7); border-style: solid; border-radius: 50%; opacity: 1;"></div>
      <div class="ml-1"> = Vrij</div>
      <div class="rounded-circle ml-2" style="width: 20px; height: 20px; background-color: rgb(156, 156, 156);"></div>
      <div class="ml-1"> = Volzet</div>
    </div>
    <div class="row mt-3 justify-content-center">
      <b-btn class="btn-warning" v-if="!isDisplayOnly" @click="bevestig">Bevestig inschrijving</b-btn>
      <b-btn class="btn-warning" v-if="(($root.$data.state.auth.organisatie === 'Sportpret') && isDisplayOnly) || (!($root.$data.state.auth.organisatie === 'Sportpret') && !seizoenFix.Afgesloten && isDisplayOnly)" @click="toggle">Bewerken</b-btn>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

function myStrToDate (str) {
  if (str) {
    return new Date(Number(str.split('-')[0]), Number(str.split('-')[1]) - 1, Number(str.split('-')[2]))
  }
};

const INGESCHREVEN = { borderColor: '#ffc107', backgroundColor: '#ffc107', borderWidth: 1 }
const VOLZET = { borderColor: '#9c9c9c', backgroundColor: '#9c9c9c', borderWidth: 1 }
const VRIJ = { backgroundColor: '', borderColor: '#ffc107', borderWidth: 1 }

export default {
  name: 'InschrijfKalender',
  props: {
    inschrijvingKey: { type: String, required: true },
    displayOnly: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      isDisplayOnly: false
    }
  },
  computed: {
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
    seizoenData: function () { return this.seizoenLive.Data },
    maxInschrijvingenPerKind: function () { return this.seizoenLive.MaxPerKind },
    ingeschrevenData: function () { return this.inschrijving.Data },
    attributes: function () {
      if (this.seizoenData) {
        return Object.entries(this.seizoenData).map(d => {
          var rObj = {}
          rObj['key'] = d[0]
          var groep = this.inschrijving.groep
          var max = this.seizoenFix['Max' + groep]
          if (this.ingeschrevenData && this.ingeschrevenData.hasOwnProperty(d[0])) { rObj['highlight'] = INGESCHREVEN } else if (d[1][groep] >= max) { rObj['highlight'] = VOLZET } else { rObj['highlight'] = VRIJ }
          var aantalInschrijvingenKleuters = d[1]['Kleuters']
          var maxAantalKleuters = this.seizoenFix['MaxKleuters']
          var aantalInschrijvingenLeerlingen = d[1]['Leerlingen']
          var maxAantalLeerlingen = this.seizoenFix['MaxLeerlingen']
          rObj['popover'] = {
            label: 'Kleuters: ' + aantalInschrijvingenKleuters + '/' + maxAantalKleuters + ' || ' + 'Leerlingen: ' + aantalInschrijvingenLeerlingen + '/' + maxAantalLeerlingen,
            hideIndicator: true
          }
          rObj['dates'] = myStrToDate(d[0])
          rObj['customData'] = d
          return rObj
        })
      }
    }
  },
  created () {
    this.$bindAsObject('inschrijving', db.ref('Inschrijvingen').child(this.inschrijvingKey))
    if (this.displayOnly) (this.setDisplayOnly(true))
    this.$bindAsObject('seizoenLive', db.ref('Seizoenen').child(this.$root.$data.state.seizoen['.key']))
  },
  watch: {
    inschrijvingKey: function (newKey, oldKey) {
      this.$bindAsObject('inschrijving', db.ref('Inschrijvingen').child(newKey))
      this.setDisplayOnly(true)
    }
  },
  methods: {
    dayClicked (day) {
      if (day.attributes.length > 0 && !this.isDisplayOnly) {
        var groep = this.inschrijving.groep
        var max = this.seizoenFix['Max' + groep]
        // Check indien kind ingeschreven was op deze datum, zo ja, verwijder inschrijving en pas aantal inschrijvingen aan
        if (this.ingeschrevenData && this.ingeschrevenData.hasOwnProperty(day.attributes[0].key)) {
          this.$firebaseRefs.inschrijving.child('Data').child(day.attributes[0].key).remove()
          var aantalVerwijder = this.seizoenData[day.attributes[0].key][groep]
          var updateVerwijder = {}; updateVerwijder[groep] = aantalVerwijder - 1
          this.$firebaseRefs.seizoenLive.child('Data').child(day.attributes[0].key).update(updateVerwijder)
          return
        }
        // Check indien geklikt is op een datum die al volzet was - niets doen, dus gewoon return
        if (this.seizoenData[day.attributes[0].key][this.inschrijving.groep] >= max) { return }
        // Check indien niet boven max aantal inschrijvingen gegaan is
        if (this.ingeschrevenData && Object.keys(this.ingeschrevenData).length >= this.maxInschrijvingenPerKind) { return }
        // Kind inschrijven en aantal inschrijvingen updaten
        var updates = {}
        updates[day.attributes[0].key] = 'Ingeschreven'
        this.$firebaseRefs.inschrijving.child('Data').update(updates)
        var aantalToevoegen = this.seizoenData[day.attributes[0].key][groep]
        var updateToevoegen = {}; updateToevoegen[groep] = aantalToevoegen + 1
        this.$firebaseRefs.seizoenLive.child('Data').child(day.attributes[0].key).update(updateToevoegen)
      }
    },
    bevestig () {
      if (!this.inschrijving.Data) {
        alert('Geen data. Inschrijving wordt geannuleerd')
        this.$firebaseRefs.inschrijving.remove()
        this.$emit('verwijderd')
      }
      if (this.displayOnly) {
        this.setDisplayOnly(true)
      } else {
        if (this.$route.params.id2) {
          this.$router.push('/organisatie/' + this.$route.params.id2)
        } else {
          this.$router.push('/home')
        }
      }
    },
    toggle () {
      this.setDisplayOnly(!this.isDisplayOnly)
    },
    setDisplayOnly (s) {
      this.isDisplayOnly = s
    }
  }
}
</script>

<style scoped>
</style>
