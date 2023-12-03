
<template>
  <Paint Position="position" />
  <v-stage :config="configKonva" @contextmenu.prevent="handler">
    <v-layer>
    </v-layer>
  </v-stage>
</template>

<script>
import Paint from "./components/paintComponent.vue"
export default {
  name: 'App',
  data() {
    return {
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      position: {
        x: undefined,
        y: undefined
      }
    };
  },
  components: {
    Paint
  },
  methods: {
    handler() {

    }
  },
  created: function () {
    window.addEventListener("mousemove", (e) => {
      this.position = { x: e.clientX, y: e.clientY };
      console.log(this.position);
    });
  }
};

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
