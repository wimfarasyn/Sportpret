<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-2">
      <b-col cols="12" class="m-3">
        <center>
          <b-btn variant="warning" size="lg" @click="schrijfIn">SCHRIJF EEN KIND IN</b-btn>
        </center>
      </b-col>
      <b-col cols="12" class="m-3">
        <center>
          <b-btn variant="warning" size="lg" @click="overzicht">BEKIJK INSCHRIJVINGEN</b-btn>
        </center>
      </b-col>
      <b-col cols="12" class="m-3">
        <center>
          <b-btn v-if="auth.sportpret" variant="warning" size="lg" @click="organisatie">ORGANISATIE</b-btn>
        </center>
      </b-col>
      <b-col cols="12" class="m-3">
        <center>
          <b-btn v-if="auth.sportpret" variant="warning" size="lg" @click="admin">ADMINISTRATIE</b-btn>
        </center>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'

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
        userID: this.$root.$data.state.auth.userID,
        sportpret: this.$root.$data.state.auth.organisatie === 'Sportpret'
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

</style>
