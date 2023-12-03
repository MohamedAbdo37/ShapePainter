<template>
    <div class="toolbar">
      <ul>
        <li><img src="../assets/rectangular-shape-outline.png" /></li>
        <li><img src="../assets/square.png" /></li>
        <li><img src="../assets/ellipse-outline-shape-variant.png" /></li>
        <li><img src="../assets/dry-clean.png" /></li>
        <li><img src="../assets/triangle.png" /></li>
        <li><img src="../assets/varnish.png" /></li>
        <li><img src="../assets/reply.png" /></li>
        <li><img src="../assets/redoo.png" /></li>
        <li><img src="../assets/icons8-save-50.png" /></li>
        <li><img src="../assets/icons8-image-file-50.png" /></li>
      </ul> 
  </div>
</template>

<script>
    export default {
        name: 'Paint',
        methods:{
          square(){

          }
        },
        props:['Position']
    }
</script>

<style>
    .toolbar{
      margin: 0;
      position: relative;
      background-color: darkgray;
      display: flex;
      margin-left: auto;
      margin-right: auto;
      width: 40%;
    }
    .toolbar ul{
      list-style-type: none;
    }
    .toolbar ul li{
      height: 50px;
      width: 50px;
      display: inline-block;
      margin-top: 0px;
    }
    .toolbar ul li img{
      height: 30px;
      width: auto;
      margin-top: 10px;
    }
    .toolbar ul li:hover{
      background-color: #e6e6e6;
    }
</style>