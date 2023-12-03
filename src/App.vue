<template>
  <div class="toolbar">
      <ul>
        <li @click="setShape('rect')"><img src="./assets/rectangular-shape-outline.png" /></li>
        <li @click="setShape('square')"><img src="./assets/square.png" /></li>
        <li @click="setShape('ellipse')"><img src="./assets/ellipse-outline-shape-variant.png" /></li>
        <li @click="setShape('circle')"><img src="./assets/dry-clean.png" /></li>
        <li @click="setShape('triangle')"><img src="./assets/triangle.png" /></li>
        <li><img src="./assets/varnish.png" /></li>
        <li><img src="./assets/reply.png" /></li>
        <li><img src="./assets/redoo.png" /></li>
        <li><img src="./assets/icons8-save-50.png" /></li>
        <li><img src="./assets/icons8-image-file-50.png" /></li>
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
        @transformend="handleTransformEnd"
      />
      <v-circle
        v-for="item in circles"
        :key="item.id"
        :config="item"
        @transformend="handleTransformEnd"
      />
      <v-regular-polygon
        v-for="item in squares"
        :key="item.id"
        :config="item"
        @transformend="handleTransformEnd"
      />
      <v-regular-polygon
        v-for="item in triangles"
        :key="item.id"
        :config="item"
        @transformend="handleTransformEnd"
      />
      <v-ellipse
        v-for="item in ellipses"
        :key="item.id"
        :config="item"
        @transformend="handleTransformEnd"
      />
      <v-transformer ref="transformer" />
    </v-layer>
  </v-stage>
</template>

<script>
//import Konva from 'konva';
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      shape: '',
      stageSize: {
        width: width,
        height: height,
      },
      circles: [
        {
          x: 20,
          y: 20,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      ],
      rectangles: [
        {
          rotation: 0,
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        },
        {
          rotation: 0,
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        },
      ],
      squares: [
      {
          rotation: 0,
          x: 300,
          y: 300,
          sides: 4,
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
        {
          rotation: 0,
          x: 600,
          y: 200,
          radiusX: 100,
          radiusY: 50,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
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
      if(rect)
        shape = rect
      else if(square)
        shape = square
      else if(circle) 
        shape = circle
      else if(ellipse)
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
      if (e.target === e.target.getStage()) {
        const newShape = this.createNewShape();
        switch(this.shape) {
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
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.rectangles.find((r) => r.name === name);
      const square = this.squares.find((r) => r.name === name);
      const circle = this.circles.find((r) => r.name === name);
      const ellipse = this.ellipses.find((r) => r.name === name);
      const triangle = this.triangles.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeID = name;
      } else if(square) {
        this.selectedShapeID = name;
      } else if(circle) {
        this.selectedShapeID = name;
      } else if(ellipse) {
        this.selectedShapeID = name;
      } else if(triangle) {
        this.selectedShapeID = name;
      } else {
        this.selectedShapeID = name;
      }
      this.updateTransformer();
    },
    createNewShape() {
      var newShape = {};
      if(this.shape == 'rect') {
        newShape = {
          rotation: 0,
          x: this.position.x,
          y: this.position.y,
          width: 100,
          height: 50,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      }
      else if(this.shape == 'square') {
        newShape = {
          rotation: 45,
          x: this.position.x,
          y: this.position.y,
          sides: 4,
          radius: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      }
      else if(this.shape == 'circle') {
        newShape = {
          rotation: 0,
          x: this.position.x,
          y: this.position.y,
          radius: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      }
      else if(this.shape == 'triangle') {
        newShape = {
          rotation: 0,
          x: this.position.x,
          y: this.position.y,
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
      }
      else if(this.shape == 'ellipse') {
        newShape = {
          rotation: 0,
          x: this.position.x,
          y: this.position.y,
          radiusX: 100,
          radiusY: 50,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 3,
          stroke: 'black',
          fill: '',
          name: this.generateRandomString(10),
          draggable: true,
        }
      }
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