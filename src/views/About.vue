<template>
  <div class="about">
    <h1>This is an about page</h1>
    <span @click="add('4', '5')">{{ number }}</span>
    <br>
    <router-link to="/about/child">To Child</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: 1
    }
  },
  methods: {
    add(num1, num2) {
      this.number = this.number + num1 + num2
    }
  },
}
</script>