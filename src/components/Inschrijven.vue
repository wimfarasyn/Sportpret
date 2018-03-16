<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row v-if='!(!auth.sportpret && seizoen.Afgesloten)' align-h="center" class="m-2 p-2">
      <b-col align="center">
        <appInschrijfFormulier v-on:ingeschreven="volgendeStap" v-on:wissen="enkelFormulier" :inschrijvingKey="key" mode="New"></appInschrijfFormulier>
      </b-col>
      <b-col cols="1" align="center"></b-col>
      <b-col align="center">
        <appInschrijfKalender v-if="toonKalender" :inschrijvingKey="key"></appInschrijfKalender>
      </b-col>
    </b-row>
    <b-row v-else aligh-h='center' class='m-2 p-2'>
      <b-col align='center'>
        <div>Het seizoen is afgesloten voor nieuwe inschrijvingen.</div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'
import InschrijfFormulier from './InschrijfFormulier.vue'
import InschrijfKalender from './InschrijfKalender.vue'

export default {
  components: {
    appHeader: MyHeader,
    appInschrijfFormulier: InschrijfFormulier,
    appInschrijfKalender: InschrijfKalender
  },
  data () {
    return {
      toonKalender: false,
      key: ''
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
    seizoen: function () { return this.$root.$data.state.seizoen }
  },
  methods: {
    volgendeStap: function (key) {
      this.toonKalender = true
      this.key = key
    },
    enkelFormulier: function () {
      this.toonKalender = false
    }
  }
}
</script>

<style>

</style>
