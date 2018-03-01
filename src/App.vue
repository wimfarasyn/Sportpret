<template>
  <div id="app" class="m-0 p-0">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    if (this.$storage.hasKey('state')) {
      this.$root.$data.state = JSON.parse(this.$storage.get('state'))
    }
  }
}

</script>

<style>
</style>
