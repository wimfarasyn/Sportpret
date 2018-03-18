<template>
  <b-row class="my-header m-0">
    <b-col cols="12 p-0">
      <h3>SPORTPRET INSCHRIJVINGEN</h3>
    </b-col>
    <b-col cols="6 text-left p-0">
      <b-btn variant="link" href="" to="/home" class="pl-1 pr-0">
        <img src="../assets/home.png" height="20px">
      </b-btn>
      <b-btn id="logoutPopover" variant="link" href="#" class="p-0">
        <img src="../assets/user.png" height="20px">
      </b-btn>
      <b-popover target="logoutPopover" placement="bottom" title="Gebruikersmenu" triggers="click blur" variant="warning">
        <a href="#" @click="logout" class="">Uitloggen</a>
      </b-popover>
      Ingelogd als {{ auth.user.email }}
    </b-col>
    <b-col cols="6 text-right p-0">
      <div class="pr-2">
        Seizoen: {{ seizoen.Naam }}
      </div>
    </b-col>
  </b-row>
</template>

<script>
import firebaseApp from '../firebase/firebase'

export default {
  name: 'MyHeader',
  methods: {
    logout () {
      this.$root.$data.setUserID('')
      this.$root.$data.setUser('')
      this.$root.$data.setSeizoen({})
      this.$root.$data.setOrg('')
      firebaseApp.auth().signOut().then(() => {
        this.$router.push('/')
      })
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
    }
  }
}

</script>

<style scoped>
.my-header {
  /*top: 0;
  position: fixed;*/
  text-align: center;
  color: white;
  background-color: #ffc107;
}

a {
    color: #6c757d;
}

a:hover {
    color: #6c757d;
}
</style>
