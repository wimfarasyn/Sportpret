<template>
  <b-form>
    <div class="input-group mb-3 no-gutters" v-if="auth.sportpret">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Organisatie</span>
      </div>
      <b-form-select v-model="form.organisatie" :options="orgsForm" :class="{ 'input-group--error': $v.form.organisatie.$invalid }"
        @change="$v.form.organisatie.$touch()" :disabled="isDisabled">
        <template slot="first">
          <option :value="null" disabled>Selecteer een organisatie</option>
        </template>
      </b-form-select>
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Voornaam</span>
      </div>
      <input type="text" v-model.trim="form.voornaam" class="form-control" :class="{ 'input-group--error': $v.form.voornaam.$error }"
        placeholder="Voornaam" @input="$v.form.voornaam.$touch()" :disabled="isDisabled">
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Naam</span>
      </div>
      <input type="text" v-model.trim="form.naam" class="form-control" :class="{ 'input-group--error': $v.form.naam.$error }" placeholder="Naam"
        @input="$v.form.naam.$touch()" :disabled="isDisabled">
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Geboortedatum</span>
      </div>
      <b-form-input type="date" v-model="form.gdatum" :class="{ 'input-group--error' : $v.form.gdatum.$error }" @change="$v.form.gdatum.$touch()"
        :disabled="isDisabled"></b-form-input>
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters" @dblclick="toggle">
      <div class="input-group-prepend col-3">
        <span class="input-group-text w-100 bg-warning">Groep</span>
      </div>
      <b-form-select v-model.trim="form.groep" :options="groepen" :class="{ 'input-group--error': $v.form.groep.$error }" @change="$v.form.groep.$touch()"
        :disabled="isDisabled"></b-form-select>
      <div class="input-group-append" v-b-popover.hover="`
            De groep wordt bepaald door de klas waarin het kind zit, NIET de leeftijd. Kinderen die 6 of ouder zijn, maar nog in de kleuterklas zitten, moeten in de leeftijdsgroep 'Kleuter' ingeschreven worden`">
        <span class="input-group-text">
          <strong class="text-dark">?</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">GSM Ouders</span>
      </div>
      <input type="text" v-model.trim="form.gsm" class="form-control" :class="{ 'input-group--error': $v.form.gsm.$error }" placeholder="04xx/xxxxxx"
        @input="$v.form.gsm.$touch()" :disabled="isDisabled">
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Postcode</span>
      </div>
      <input type="text" v-model.trim="form.postcode" class="form-control" :class="{ 'input-group--error': $v.form.postcode.$error }"
        placeholder="xxxx" @input="$v.form.postcode.$touch()" :disabled="isDisabled">
      <div class="input-group-append">
        <span class="input-group-text">
          <strong class="text-danger">!</strong>
        </span>
      </div>
    </div>
    <div class="input-group mb-3 no-gutters">
      <div class="input-group-prepend col-3" @dblclick="toggle">
        <span class="input-group-text w-100 bg-warning">Opmerking</span>
      </div>
      <input type="text" v-model="form.opmerking" class="form-control" placeholder="(vb. allergie, speciale zorg, ...)" :disabled="isDisabled">
    </div>
    <div v-if="mode == 'New' && !key">
      <b-button type="reset" variant="warning" @click.prevent="onReset">Terug</b-button>
      <b-button type="submit" variant="warning" @click.prevent="onSubmit">Bevestig</b-button>
    </div>
    <div v-if="mode == 'Display' && !isDisabled" class="float-right">
      <b-button type="submit" variant="warning" @click.prevent="update">Update</b-button>
    </div>
  </b-form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import bus from '../eventBus.js'
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()
const GROEPEN = [ { value: null, text: 'Selecteer een groep' }, { value: 'Kleuters', text: 'Kleuter (3-6 jaar)' }, { value: 'Leerlingen', text: 'Lagere School (6-9 jaar)' } ]

export default {
  name: 'InschrijfFormulier',
  props: {
    inschrijvingKey: { type: String, default: '' },
    mode: { type: String, default: 'New' }
  },
  data () {
    return {
      groepen: GROEPEN,
      form: { organisatie: null, naam: '', voornaam: '', gdatum: '', groep: null, gsm: '', postcode: '', opmerking: '' },
      isDisabled: false,
      key: ''
    }
  },
  firebase: { orgs: db.ref('Organisaties'), inschrijvingen: db.ref('Inschrijvingen')
  },
  validations: {
    form: { naam: { required },
      voornaam: { required },
      gsm: { required },
      postcode: { required },
      groep: { required },
      organisatie: { required },
      gdatum: { required,
        leeftijd: val => {
          var geboortedatum = new Date(val); var now = new Date()
          var leeftijd = now.getFullYear() - geboortedatum.getFullYear()
          return (leeftijd > 2 && leeftijd < 12)
        }}
    }
  },
  computed: {
    auth: function () { return { sportpret: (this.$root.$data.state.auth.organisatie === 'Sportpret') } },
    seizoen: function () { return this.$root.$data.state.seizoen },
    orgsForm: function () { return this.orgs.map((org) => { return { value: org['.key'], text: org['Naam'] } }) }
  },
  watch: {
    inschrijvingKey: function (newKey, oldKey) {
      this.populateForm(newKey)
      this.setDisabled()
    }
  },
  created () {
    bus.$on('modalShown', this.setDisabled)
    if (this.mode === 'New' && !this.auth.sportpret) { this.form.organisatie = this.$root.$data.state.auth.organisatie }
  },
  methods: {
    populateForm (newKey) {
      if (newKey === '') { this.onReset() } else {
        db.ref('Inschrijvingen').orderByKey().equalTo(newKey).once('value').then(r => {
          var rr = r.val()
          this.form = rr[newKey]
        })
      }
    },
    onSubmit () {
      if (this.form.organisatie !== null && this.form.naam !== '' && this.form.voornaam !== '' && this.form.gdatum !== '' && this.form.groep !== null && this.form.gsm !== '' && this.form.postcode !== '') {
        var ref = db.ref('Inschrijvingen').push()
        ref.set({
          'seizoen': this.seizoen['.key'],
          'organisatie': this.form.organisatie,
          'naam': this.form.naam,
          'voornaam': this.form.voornaam,
          'gdatum': this.form.gdatum,
          'groep': this.form.groep,
          'gsm': this.form.gsm,
          'postcode': this.form.postcode,
          'opmerking': this.form.opmerking
        })
        this.key = ref.key
        this.$emit('ingeschreven', this.key)
      } else { alert('Check Formulier') }
    },
    onReset () {
      this.form.naam = ''; this.form.voornaam = ''; this.form.gdatum = ''; this.form.groep = null; this.form.gsm = ''; this.form.postcode = ''; this.form.opmerking = ''; this.form.organisatie = null
      this.$v.$reset()
      this.$emit('wissen')
    },
    update () {
      if (this.form.organisatie !== null && this.form.naam !== '' && this.form.voornaam !== '' && this.form.gdatum !== '' && this.form.groep !== null && this.form.gsm !== '' && this.form.postcode !== '') {
        var updateObject = {
          seizoen: this.seizoen['.key'],
          organisatie: this.form.organisatie,
          naam: this.form.naam,
          voornaam: this.form.voornaam,
          gdatum: this.form.gdatum,
          groep: this.form.groep,
          gsm: this.form.gsm,
          postcode: this.form.postcode,
          opmerking: this.form.opmerking
        }
        db.ref('Inschrijvingen').child(this.inschrijvingKey).update(updateObject)
        this.$emit('geupdated', this.inschrijvingKey)
        this.setDisabled()
      } else { alert('Check Formulier') }
    },
    toggle () {
      this.isDisabled = !this.isDisabled
    },
    setDisabled () {
      this.isDisabled = true
    }
  }
}
</script>

<style scoped>
.input-group--error {
    border-color: red;
    background-color: rgb(229, 186, 186);
}

.input-group-prepend {
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
    user-select: none;
}
</style>
