<template>
  <b-container fluid>
    <b-row class="p-0">
      <b-col cols="12 m-0 p-0">
        <appHeader></appHeader>
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-2">
      <div>Hier komt de component voor de organisatie</div>
    </b-row>
  </b-container>
</template>

<script>
import MyHeader from './MyHeader.vue'

export default {
  components: {
    appHeader: MyHeader
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
    }
  }
}

</script>

<style>

</style>
