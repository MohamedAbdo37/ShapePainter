<template>
  <div class="toolbar">
      <ul>
        <li @click="setShape('line')" :class="{ selected: shape === 'line' }"><img src="./assets/diagonal-line.png" /></li>
        <li @click="setShape('rect')" :class="{ selected: shape === 'rect' }"><img src="./assets/rectangular-shape-outline.png" /></li>
        <li @click="setShape('square')" :class="{ selected: shape === 'square' }"><img src="./assets/square.png" /></li>
        <li @click="setShape('ellipse')" :class="{ selected: shape === 'ellipse' }"><img src="./assets/ellipse-outline-shape-variant.png" /></li>
        <li @click="setShape('circle')" :class="{ selected: shape === 'circle' }"><img src="./assets/dry-clean.png" /></li>
        <li @click="setShape('triangle')" :class="{ selected: shape === 'triangle' }"><img src="./assets/triangle.png" /></li>
        <li @click="this.shape = ''">
          <input type="color"  class="color-input" v-model="fill"/>
        </li>
        <li><img src="./assets/reply.png" /></li>
        <li><img src="./assets/redoo.png" /></li>
        <li><img src="./assets/icons8-save-50.png" /></li>
        <li><img src="./assets/icons8-image-file-50.png" /></li>
        <li><img src="./assets/copying.png" /></li>
        <li><img src="./assets/paste.png" /></li>
        <li><img src="./assets/bin.png" /></li>
      </ul> 
    </div>
  <v-stage
    ref="stage"
    :config="stageSize"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer ref="layer">
      
      <v-rect 
      v-for="item in rectangles" 
      :key="item.id" 
      :config="item" 
      @transformend="handleTransformEnd" />
      
      <v-circle 
      v-for="item in circles" 
      :key="item.id" 
      :config="item" 
      @transformend="handleTransformEnd" />
      
      <v-regular-polygon 
      v-for="item in squares" 
      :key="item.id" 
      :config="item" 
      @transformend="handleTransformEnd" />
      
      <v-regular-polygon 
      v-for="item in triangles" 
      :key="item.id" 
      :config="item" 
      @transformend="handleTransformEnd" />

      <v-ellipse 
      v-for="item in ellipses" 
      :key="item.id" 
      :config="item" 
      @transformend="handleTransformEnd" />

      <v-transformer ref="transformer" />
    </v-layer>
  </v-stage>
</template>

<script>
import axios from 'axios';

//import Konva from 'konva';
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      shape: '',
      fill: '',
      stageSize: {
        width: width,
        height: height,
      },
      color: "#fff",
      circles: [

      ],
      rectangles: [
      ],
      squares: [
      ],
      triangles: [
      {
          rotation: 0,
          x: 500,
          y: 500,
          sides: 3,
          radius: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      ],
      ellipses: [
      ],
      selectedShapeID: '',
      position: {
        x: undefined,
        y: undefined
      },
    };
  },
  methods: {
    setShape(shape) {
      this.shape = shape;
    },
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.rectangles.find(
        (r) => r.name === this.selectedShapeID
      );
      const square = this.squares.find(
        (r) => r.name === this.selectedShapeID
      );
      const circle = this.circles.find(
        (r) => r.name === this.selectedShapeID
      );
      const ellipse = this.ellipses.find(
        (r) => r.name === this.selectedShapeID
      );
      const triangle = this.triangles.find(
        (r) => r.name === this.selectedShapeID
      );
      var shape;
      if (rect)
        shape = rect
      else if (square)
        shape = square
      else if (circle)
        shape = circle
      else if (ellipse)
        shape = ellipse
      else
        shape = triangle

      // update the state
      shape.x = e.target.x();
      shape.y = e.target.y();
      shape.rotation = e.target.rotation();
      shape.scaleX = e.target.scaleX();
      shape.scaleY = e.target.scaleY();

    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === this.$refs.stage.getStage()) {
        const newShape = this.createNewShape();
        switch (this.shape) {
          case 'rect':
            this.rectangles.push(newShape)
            break;
          case 'square':
            this.squares.push(newShape)
            break;
          case 'circle':
            this.circles.push(newShape)
            break;
          case 'triangle':
            this.triangles.push(newShape)
            break;
          case 'ellipse':
            this.ellipses.push(newShape)
            break;
          default:
            this.shape = "";
            break;
        }
        this.selectedShapeID = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target === this.$refs.transformer;
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name;
      const rect = this.rectangles.find((r) => r.name === name);
      const square = this.squares.find((r) => r.name === name);
      const circle = this.circles.find((r) => r.name === name);
      const ellipse = this.ellipses.find((r) => r.name === name);
      const triangle = this.triangles.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeID = name;
      } else if (square) {
        this.selectedShapeID = name;
      } else if (circle) {
        this.selectedShapeID = name;
      } else if (ellipse) {
        this.selectedShapeID = name;
      } else if (triangle) {
        this.selectedShapeID = name;
      } else {
        this.selectedShapeID = name;
      }
      this.updateTransformer();
    },
    createNewShape() {
      let newShape = undefined;
      let X1 = undefined;
      let Y1 = undefined;

      window.addEventListener("mousedown", () => {
        X1 = this.position.x;
        Y1 = this.position.y;
        axios.post("localhost:8081/set", {
          stroke: this.color,
          type: this.shape,
          name: this.generateRandomString(10)
        }).then(() => console.log("Create shape done"), () => console.log("Create shape faild"));

        console.log(`set p1(${X1}, ${Y1})`);
  
      });

      window.addEventListener("mousemove", ()=>{
        axios.get("localhost:8081/shape", {
          x1: X1,
          y1: Y1,
          x2: this.position.x,
          y2: this.position.y,
          name: this.generateRandomString(10)
        }).then((r) => newShape = r, () => console.log("Create shape faild"));

        console.log(`draw p2(${this.position.x} ,${this.position.y})`);
      });

      window.addEventListener("mouseup",()=>{
        window.removeEventListener("mousemove",this.createNewShape());
        console.log("done");
        window.removeEventListener("mouseup",this.createNewShape());
      });

    

      return newShape;
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeID } = this;

      const selectedNode = stage.findOne('.' + selectedShapeID);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
    generateRandomString(length) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  },
  created: function () {
    window.addEventListener("mousemove", (e) => {
      let offsetY = e.clientY - document.querySelector(".toolbar").offsetHeight;
      if (offsetY == "NaN") {
        console.log(document.querySelector(".toolbar").offsetHeight);
      }
      this.position = { x: e.clientX, y: offsetY };
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
.toolbar{
      margin: 0;
      position: relative;
      background-color: darkgray;
      display: flex;
      margin-left: auto;
      margin-right: auto;
      
    }
    .toolbar ul{
      list-style-type: none;
      margin: auto
    }
    .toolbar ul li{
      height: 50px;
      width: 50px;
      display: inline-block;
      margin-top: 0px;
      cursor: pointer;
    }
    .toolbar ul li img{
      height: 30px;
      width: auto;
      margin-top: 10px;
    }
    .toolbar ul li:hover{
      background-color: #e6e6e6;
    }
    .toolbar ul li.selected {
      background-color: #e6e6e6;
    }
    input[type="color"] {
      /*opacity: 0;*/
      /*display: block;*/
      margin: 0px;
      width: 44px;
      height: 44px;
      border: none;
    }
    .color-input{
      background-image:url("./assets/varnish.png");
      background-repeat:no-repeat;
    }
</style>