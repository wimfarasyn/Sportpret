<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row class="m-2" v-if="auth.sportpret">
      <b-form-select v-model="organisatie" :options="orgsForm">
        <template slot="first">
          <option :value="null" disabled>Selecteer een organisatie</option>
        </template>
      </b-form-select>
    </b-row>
    <div class="m-2" v-if="auth.sportpret">
      <hr>
    </div>
    <b-row class="m-2" v-if="organisatie">
      <b-col cols="4">
        <b-list-group class="pre-scrollable">
          <b-list-group-item class="noSelect m-0 p-0" v-for="(i, k) in gesorteerdeInschrijvingen" :key="k" @click="selecteerInschrijving(i['.key'])"
            :active="i['.key'] == geselecteerdeInschrijving">
            <div class="w-100 m-0 p-1">
              {{ i.voornaam }} {{i.naam }}
              <b-btn variant="link" class="pl-1 text-dark" @click="selecteerInschrijving(i['.key'])" v-b-modal.details>
                <icon class="align-middle" name="edit"></icon>
              </b-btn>
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-modal id="details" centered :hide-header="true" :hide-footer="true" @shown="openModal" return-focus="document.body">
          <appInschrijfFormulier :inschrijvingKey="geselecteerdeInschrijving" mode="Display" v-on:groepVeranderd="selecteer"></appInschrijfFormulier>
        </b-modal>
      </b-col>
      <b-col cols="2">
      </b-col>
      <b-col cols="6">
        <appInschrijfKalender v-if="geselecteerdeInschrijving" :inschrijvingKey="geselecteerdeInschrijving" :displayOnly="true" v-on:verwijderd="selecteerInschrijving('')"></appInschrijfKalender>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'
import InschrijfFormulier from './InschrijfFormulier.vue'
import InschrijfKalender from './InschrijfKalender.vue'
import bus from '../eventBus.js'
import firebaseApp from '../firebase/firebase'
const db = firebaseApp.database()

export default {
  components: {
    appHeader: MyHeader,
    appInschrijfFormulier: InschrijfFormulier,
    appInschrijfKalender: InschrijfKalender
  },
  data: function () {
    return {
      organisatie: null,
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
    orgsForm: function () {
      return this.orgs.map((org) => {
        return {
          value: org['.key'],
          text: org['Naam']
        }
      })
    },
    organisatieNaam: function () {
      if (this.organisatie && this.orgsForm.length) {
        return this.orgsForm.filter(org => (org.value === this.organisatie))[0]['text']
      }
    },
    gesorteerdeInschrijvingen: function () {
      if (this.inschrijvingen) {
        return this.inschrijvingen.slice(0).sort(function (a, b) {
          var x = a['voornaam'].toLowerCase()
          var y = b['voornaam'].toLowerCase()
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        })
      }
    }
  },
  firebase: {
    orgs: db.ref('Organisaties')
  },
  watch: {
    organisatie: function (newO, oldO) {
      this.selecteerInschrijving('')
      this.getInschrijvingen(newO)
    }
  },
  methods: {
    getInschrijvingen: function (org) {
      this.$bindAsArray('inschrijvingen', db.ref('Inschrijvingen').orderByChild('organisatie').equalTo(org))
    },
    selecteerInschrijving: function (key) {
      this.geselecteerdeInschrijving = key
    },
    openModal: function () {
      bus.$emit('modalShown')
    },
    selecteer: function (key) {
      this.selecteerInschrijving(key)
    }
  },
  mounted () {
    if (!this.auth.sportpret) {
      this.organisatie = this.$root.$data.state.auth.organisatie
    }
  }
}

</script>

<style scoped>
.list-group-item.active {
  background-color: #ffc107;
  border-bottom-color: #ffc107;
  border-top-color: #ffc107;
  border-left-color: #ffc107;
  border-right-color: #ffc107;
}

.noSelect {
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
    user-select: none;
}
</style>
