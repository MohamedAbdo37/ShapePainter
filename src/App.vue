
<template>
  <Paint/>
</template>

<script>
import Paint from "./components/paintComponent.vue"
export default {
  name: 'App',
  components: {
    Paint
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
