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
        <li @click="setShape('color')" :class="{ selected: shape === 'color' }"><img src="./assets/varnish.png"></li>
        <li><img src="./assets/reply.png" /></li>
        <li><img src="./assets/redoo.png" /></li>
        <li onclick="dialog.showModal()" ><img src="./assets/icons8-save-50.png" /></li>
        <li><img src="./assets/icons8-image-file-50.png" /></li>
        <li @click="setShape('copy')" :class="{ selected: shape === 'copy' }"><img src="./assets/copying.png" /></li>
        <li @click="setShape('paste')" :class="{ selected: shape === 'paste' }"><img src="./assets/paste.png" /></li>
        <li @click="setShape('delete')" :class="{ selected: shape === 'delete' }"><img src="./assets/bin.png" /></li>
      </ul> 
    </div>
    <dialog id="dialog">
      <form method="dialog">
        <label for="save">Enter the name</label>
        <input type="text" name="save" id="save" v-model="fileName">
        <button @click="saveLayer()">Save</button>
        <button>Cansel</button>
      </form>
    </dialog>
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
import axios from 'axios';

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      paintPressed: false,
      fileName: '',
      shape: '',
      fill: '',
      copy: '',
      draw: false,
      stageSize: {
        width: width,
        height: height,
      },
      circles: [
      ],
      rectangles: [
      ],
      squares: [
      ],
      triangles: [
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

      if(shape === 'color') {
        this.paintPressed = true;
        this.shape = '';
        return 
      }
      if(this.shape === shape) {
        this.shape = ''
        return
      }
      this.shape = shape;
      this.paintPressed = false
        switch(this.shape) {
          case 'rect':
            this.draw = true;
            break;
          case 'square':
            this.draw = true;
            break;
          case 'circle':
            this.draw = true;
            break;
          case 'triangle':
            this.draw = true;
            break;
          case 'ellipse':
            this.draw = true;
            break;
          case 'paste':
            this.draw = true;
            break;
          default:
            this.draw = false;
            break;
        }
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

      console.log(`from transformer ${shape}`)
      // update the state
      shape.x = e.target.x();
      shape.y = e.target.y();
      shape.rotation = e.target.rotation();
      shape.scaleX = e.target.scaleX();
      shape.scaleY = e.target.scaleY();

      axios.get("http://localhost:8081/update",{
        params:{
          name: shape.name,
          x: parseInt(shape.x, 10),
          y: parseInt(shape.y, 10),
          rotation: `${shape.rotation}`,
          scaleX: `${shape.scaleX}`,
          scaleY: `${shape.scaleY}`
        }
      }).then(r => {
        console.log("Shape updated");
        console.log(r.data);
      });
      console.log(shape);
    },
    async handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if ((this.draw === true) && (e.target === e.target.getStage())) {
        let newShape = {};
        if(this.shape === "paste"){
          await this.pasteShape().then(r => newShape = r);
          this.shape = this.copy;
        }
        else await this.createNewShape().then((r)=>newShape=r);
        console.log(newShape);
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

        }
        this.paintPressed = false;
        this.selectedShapeID = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      if(e.target.getParent() === null){
        this.updateTransformer();
        return;
      }
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

      if(this.shape === "copy"){
        await this.copyShape();
      }

      if(this.shape === 'delete')
        this.delete();
      
      if(this.paintPressed === true){
        console.log("color");
        if (rect) {
          rect.fill = this.fill;
        } else if(square) {
          square.fill = this.fill;
        } else if(circle) {
          circle.fill = this.fill;
        } else if(ellipse) {
          ellipse.fill = this.fill;
        } else if(triangle) {
          triangle.fill = this.fill;
        }
      }
      this.draw = false;
      this.updateTransformer();
    },
    async createNewShape() {
      var newShape = {};
      console.log("Create Shape")
      await axios.get("http://localhost:8081/shape",{
        params:{
          x: this.position.x,
          y: this.position.y,
          type: this.shape
        }
      }).then((r)=> {
        console.log(r);
        newShape =r.data;});

      console.log(newShape);

      return newShape;
    },
    async pasteShape() {
      var newShape = {};
      console.log("from Paste")
      await axios.get("http://localhost:8081/paste",{
        params:{
          x: this.position.x,
          y: this.position.y
        }
      }).then((r)=> {
        console.log(r);
        newShape =r.data;});

      console.log(newShape);

      return newShape;
    },
    async copyShape() {

      console.log("from copy")
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
      
      if(rect)
        this.copy = 'rect';
      else if(square)
        this.copy = 'square';
      else if(circle) 
        this.copy = 'circle';
      else if(ellipse)
        this.copy = 'rect';
      else if(triangle)
        this.copy = 'triangle';

      console.log(this.selectedShapeID);
      if(this.selectedShapeID !== ''){
        await axios.get("http://localhost:8081/copy",{
          params:{
            name: this.selectedShapeID
          }
        }).then(console.log("Shape copied"));
      }
      this.shape = '';
    },
    delete(){
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
      
      if(rect){
        this.rectangles.splice(this.rectangles.findIndex(a => a.name === this.selectedShapeID) , 1);
      }else if(square){
        this.squares.splice(this.squares.findIndex(a => a.name === this.selectedShapeID) , 1);
        console.log(this.squares);
      }else if(circle){ 
        this.circles.splice(this.circles.findIndex(a => a.name === this.selectedShapeID) , 1);
        console.log(this.circles);
      }else if(ellipse){
        this.ellipses.splice(this.ellipses.findIndex(a => a.name === this.selectedShapeID) , 1);
        console.log(this.ellipses);
      }else if(triangle){
        this.triangles.splice(this.triangles.findIndex(a => a.name === this.selectedShapeID) , 1);
        console.log(this.triangles);
      }
      axios.get("http://localhost:8081/delete",{
        params:{
          name: this.selectedShapeID
        }
      }).then(console.log("Shape deleted"));
      this.selectedShapeID = '';
      this.updateTransformer();
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
    },
    saveLayer(){
      axios.get("http://localhost:8081/savejson",{
        params:{
          filepath: `json//${this.fileName}.json`
        }
      }).then(() =>{
        console.log('file save');
        this.fileName = '';
      });
    }
  },
  created: function () {
    window.addEventListener("mousemove", (e) => {
      this.position = { x: e.clientX, y: e.clientY };
    
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