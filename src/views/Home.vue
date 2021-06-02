<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>This is Home Page.</h1>
    <button @click="add">Add Count</button>
    <button @click="asyncAdd" style="margin-left: 20px;">Async Add Count</button>
    <span style="margin-left: 20px;">{{ counter }}</span>
    <span style="margin-left: 20px;">{{ $store.getters.doubleCounter }}</span>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Home',
  computed: mapState(['counter']),
  methods: {
    ...mapMutations(['add']),
    ...mapActions({
      asyncAdd: 'add' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
</script>
