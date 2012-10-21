/**
Copyright (C) 2012  James Hennessey

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
 * 
 *
 *
 * Backbone MVC file for all front-end javascript. 
 */

(function($){
  //Overrides oersustebce storage wutg dummy function
  Backbone.sync = function(method, model, success, error){ 
    success();
  }

  var dataset = 'original'


  var PopupWindow = Backbone.View.extend({
    el: $('.modal-body'),

    events: {
      'click button#writeToFile': 'writeToFile'
    },

    initialize: function(){
      _.bindAll(this, 'writeToFile');
    },

    writeToFile: function(){
      console.log('write to file');
      morphableBody.writeToFile($('#filename').val());
    },

    displayData: function(filename){
      $('.download-file').html("<a href='http://127.0.0.1:8000/"+filename+"' target='_Blank'>Download</a> ");
    }

  });

  var SelectSecondModel = Backbone.View.extend({
    el: $('form#second-obj'),

    events: {
      'change .dropdown':'changeObj'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'original', 'all', 'male', 'female');
      this.render();
    },


    render: function(){
      $(this.el).find('.dropdown').append("<option value='mean'>Mean</option>");
      $(this.el).find('.dropdown').append("<option value='100'>100</option>");
      $(this.el).find('.dropdown').append("<option value='72'>72</option>");
      $(this.el).find('.dropdown').append("<option value='25'>25</option>");
    },

    original: function(){
      $(this.el).find('.dropdown').empty();
      $(this.el).find('.dropdown').append("<option value='mean'>Mean</option>");
      $(this.el).find('.dropdown').append("<option value='100'>100</option>");
      $(this.el).find('.dropdown').append("<option value='72'>72</option>");
      $(this.el).find('.dropdown').append("<option value='25'>25</option>");
    },

    all: function(){
      $(this.el).find('.dropdown').empty();
      $(this.el).find('.dropdown').append("<option value='mean'>Mean</option>");
      $(this.el).find('.dropdown').append("<option value='8'>8</option>");
      $(this.el).find('.dropdown').append("<option value='15'>15</option>");
      $(this.el).find('.dropdown').append("<option value='25'>25</option>");
      $(this.el).find('.dropdown').append("<option value='26'>26</option>");
      $(this.el).find('.dropdown').append("<option value='48'>48</option>");
      $(this.el).find('.dropdown').append("<option value='74'>74</option>");
      $(this.el).find('.dropdown').append("<option value='83'>83</option>");
      $(this.el).find('.dropdown').append("<option value='84'>84</option>");
      $(this.el).find('.dropdown').append("<option value='91'>91</option>");
      $(this.el).find('.dropdown').append("<option value='105'>105</option>");
      $(this.el).find('.dropdown').append("<option value='109'>109</option>");
      
    },

    male: function(){
      $(this.el).find('.dropdown').empty();
      $(this.el).find('.dropdown').append("<option value='mean'>Mean</option>");
      $(this.el).find('.dropdown').append("<option value='12'>12</option>");
      $(this.el).find('.dropdown').append("<option value='19'>19</option>");
      $(this.el).find('.dropdown').append("<option value='67'>67</option>");
      $(this.el).find('.dropdown').append("<option value='83'>83</option>");
      $(this.el).find('.dropdown').append("<option value='96'>96</option>");
    },

    female: function(){
      $(this.el).find('.dropdown').empty();
      $(this.el).find('.dropdown').append("<option value='mean'>Mean</option>");
      $(this.el).find('.dropdown').append("<option value='25'>25</option>");
      $(this.el).find('.dropdown').append("<option value='49'>49</option>");
      $(this.el).find('.dropdown').append("<option value='60'>60</option>");
      $(this.el).find('.dropdown').append("<option value='103'>103</option>");
      $(this.el).find('.dropdown').append("<option value='109'>109</option>");
    },

    changeObj: function(value){
       bodyShapeView.load('data/'+dataset+'/objs/'+value.srcElement.value+'.obj');
       if(value.srcElement.value == 'mean')
        $(this.el).prev().html('Mean Model');
       else
        $(this.el).prev().html('Model '+value.srcElement.value);
    }

  });

  var SelectData = Backbone.View.extend({
    el: $('div.navbar-inner'),

    events: {
      'click .dropdown-menu a' : 'menuChange'
    },

    initialize: function(){
      _.bindAll(this);
    },

    menuChange: function(option){
      var selected = option.currentTarget.innerHTML;
      $(this.el).find('h4').html('Data Set: <span>'+selected+'</span>')
    
      if(selected == 'Original'){
        dataset = 'original';
        selectSecondObj.original();
      }else if(selected == 'All'){
        dataset = 'all';
        selectSecondObj.all();
      }else if(selected == 'Male'){
        dataset = 'male';
        selectSecondObj.male();
      }else if(selected == 'Female'){
        dataset = 'female';
        selectSecondObj.female();
      }

      controlsView.empty();
      morphableBody.empty();
      bodyShapeView.empty();
      controlsView = new ControlsView();
      morphableBody = new MorphableBody({ el: "#morphable-body" });
      bodyShapeView = new BodyShapeView({ el: "#mean-body" });
    }

  });

  //View for a slider which morphs body
  var SliderView = Backbone.View.extend({
     tagName: 'div',
     value: 0,

     initialize: function(){
       _.bindAll(this, 'render');
      },

     render: function(id){

       var _this = this;

       //Create div and append items
       $(this.el).attr('id', 'id'+id).addClass('eigenvalue').html();
       $(this.el).append("<div class='slidername'>Eigenvector "+id+"</div>");
       $(this.el).append("<div class='slider'></div>");
       $(this.el).append("<div class='slider-result'>0</div>");

       //jQuery slider listener
       $(this.el).find('.slider').empty().slider({
			  animate: true,
        range: "min",
        value: 0,
        min: -5,
        max: 5,
			  step: 0.1,
			  //this gets a live reading of the value and prints it on the page
        slide: function( event, ui ) { 
         $(this).next('.slider-result').html( ui.value );
        },

        //Once a slider value had been changed call morphableBody.morph function
        change: function(event, ui) {
          _this.value = ui.value - _this.value;
          morphableBody.morph(id, _this.value);
        }
      });
      return this;
     }

  });

  //View from all of the sliter controls
  var ControlsView = Backbone.View.extend({
    el: $('div#controls'),

    events: {
      'click button#reset' : 'reset'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'reset');
      this.render();
    },

    //Append the five sliders with unique id
    render: function(){
      // $(this.el).append('<h4>Eigenvectors</h4>');
       $(this.el).append(new SliderView().render(1).el);
       $(this.el).append(new SliderView().render(2).el);
       $(this.el).append(new SliderView().render(3).el);
       $(this.el).append(new SliderView().render(4).el);
       $(this.el).append(new SliderView().render(5).el);
       $(this.el).append(new SliderView().render(6).el);
       $(this.el).append(new SliderView().render(7).el);
       $(this.el).append(new SliderView().render(8).el);
      // $(this.el).append(new SliderView().render(9).el);
      // $(this.el).append(new SliderView().render(10).el);
       $(this.el).append("<div class='eigenvalue'><button id='reset' class='btn btn-inverse'>Reset</button></div>");
    },

    //Method to reset all sliders and morphable body
    reset: function(){
      $(this.el).empty();
      morphableBody.reset();
      morphableBody.front();
      this.render();
    }, 

    empty: function(){
      $(this.el).empty();
    }

  });


  var SelectVertex = Backbone.View.extend({
    tagName: 'div',
    id: null,

    events: {
      'click .removeInput' : 'remove',
      'click .vertexInput' : 'selected',
      'change .vertexInput' : 'updateValue'
    },
  
    initialize: function(id){
      _.bindAll(this, 'render');
      this.id = id;
    }, 


    render: function(){
      console.log('Select Vertex');
      $(this.el).html();
      $(this.el).append("<h5>"+(this.id+1)+"</h5>");
      $(this.el).append("<input type='text' class='vertexInput' value='' name='"+this.id+"' id='"+this.id+"'>");
      if(this.id > 1)
        $(this.el).append("<i class='icon-remove-sign removeInput'></i>");

      return this;
    },

    selected: function(){
      morphableBody.setSelectedVertex(this.id, this);
    },

    remove: function(){
      morphableBody.removeVertex(this.id);
      $(this.el).remove();
    },

    updateValue: function(){
      $(this.el).find('.vertexInput').attr('value', $(this.el).find('.vertexInput').val());
      morphableBody.pushPointArray(this.id,  $(this.el).find('.vertexInput').val());
     },

    setValue: function(value){
      $(this.el).find('.vertexInput').attr('value', value);
    }

  });

  //View for the obj body viewer
  var BodyShapeView = Backbone.View.extend({
    thingiview: null,
    scene: null,
    renderer: null,
    model: null,
    rotate: false,
    point1: false,
    point2: false,
    height: 600,
    width: 345,
    controls: null,
    mousemove: false,
    from: null,
    to: null,
    fromConfirm: false,
    toConfirm: false,
    objText: null,
    objArray: null,
    wire: false,
    line: null,
    zoom: 17,
    pointCount: 0,
    selectedVertex: null,
    pointArray: Array(),
    facesArray: Array(),
    currVertexThis: null,
    measureType: 'euclidean',


    events:{
      'click button#front' : 'front',
      'click button#back' : 'back',
      'click button#left' : 'left',
      'click button#right' : 'right',
      'click button#cup' : 'moveUp',
      'click button#cdown' : 'moveDown',
      'click button#cleft' : 'moveLeft',
      'click button#cright' : 'moveRight',
      'click button#center' : 'center',
      'click button#middle' : 'middle',
      'click button#in' : 'zoomIn',
      'click button#out' : 'zoomOut',
      'click button#on' : 'rotateOn',
      'click button#off' : 'rotateOff',
      'click button#wireframeOn' : 'wireOn',
      'click button#wireframeOff' : 'wireOff',
      'click .obj' : 'mouseDown',
      'mouseover .obj' : 'mouseover',
      'mouseout .obj' : 'mouseout',
      'click input[type=radio]' : 'radio',
      'click button.calculate' : 'calculateDistance',
      'click button.clear' : 'clear',
      'click .addPoint' : 'addMeasureControls',
      'change .distance-dropdown' : 'measureType'

    },


    // initialize function to create scene, camera, lighing and load object
    initialize: function(name){
      _.bindAll(this, 'render', 'animate', 'mouseDown', 'getFaceIndex', 'path', 'getObjArray', 'addCamera', 'addControls', 'removeMeasureControls',
               'getVertices', 'ajaxRequest', 'addMeasureControls', 'load', 'euclideanDist', 'printHeight'
               );


        
        this.scene = new THREE.Scene();
        this.addCamera(0, -6, 1);

        var ambient = new THREE.AmbientLight(  0x202020 );
        this.scene.add( ambient );

        var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        directionalLight1.position.set(0 , 1, 0 );
        this.scene.add( directionalLight1 ); 

        var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight2.position.set(0, 0, 1 );
        this.scene.add( directionalLight2 ); 

        var pointLight = new THREE.PointLight( 0xffffff, 5, 29 );
        pointLight.position.set( 0, -24, 10 );
				this.scene.add( pointLight );

        xmlhttp=new XMLHttpRequest();
        xmlhttp.open('GET', '../data/'+dataset+'/meanModel.obj', false);
        xmlhttp.send(null);
        this.objText = xmlhttp.responseText;
        var loader = new THREE.OBJLoader();
        var object = loader.parse(this.objText);
        object.children[0].geometry.computeFaceNormals();
        var  geometry = object.children[0].geometry;
        THREE.GeometryUtils.center(geometry);
        geometry.dynamic = true;
        var material = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
        this.model = new THREE.Mesh(geometry, material);
        this.model.geometry.dynamic = true;
        this.scene.add( this.model );

        this.objArray = this.getObjArray(this.objText);

        console.log(this.model);
        console.log(this.camera);

        // RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height );
        $(this.el).find('.obj').append( this.renderer.domElement );


        this.addMeasureControls();
        this.addMeasureControls();
        this.printHeight();
        //var tempArray = [53,52,51,50,49,3886,3852,3850,3844,3817,3814,3805,3807,3782,3774,3774,3773,3737,3735,3729,3677,3675,21,20,19,18,17,15]
        //var tempArray = [714,712,54,674,669,635,633,627,598,596,591,40,37,35,34,33,32,31,30,29,28,27,3323,3677, 3677,23,460,474,484];
        //this.path(tempArray);
        this.animate();

    },

    //Method for selecting faces to measure distance between. 
    mouseDown: function(event){

     if(this.selectedVertex != null){


        var vector = new THREE.Vector3 (
          ((event.clientX - $(this.el).find('.obj').position().left + window.pageXOffset ) / this.width) * 2 - 1, 
          -((event.clientY - $(this.el).find('.obj').position().top + window.pageYOffset ) / this.height)*2+1, 
          0.5
        );

        var projector = new THREE.Projector();
        projector.unprojectVector(vector, this.camera);
        var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
        var intersects = ray.intersectObject(this.model);
        if (intersects.length > 0)
           {

              console.log(intersects[0]); 

             if(typeof this.pointArray[this.selectedVertex] != 'undefined')
               this.model.geometry.faces[this.facesArray[this.selectedVertex]].color = new THREE.Color(0xffffff);


              intersects[0].face.color = new THREE.Color(0x5311FA);
              //intersects[0].face.vertexColors.push(new THREE.Color(0x53FFFA));
              this.facesArray[this.selectedVertex] = this.getFaceIndex(this.model.geometry.faces, intersects[0].face);
              this.model.geometry.colorsNeedUpdate = true;
              this.pointArray[this.selectedVertex] = (intersects[0].face.a+1);


              this.currVertexThis.setValue(intersects[0].face.a);
              console.log(this.pointArray);

          }
       else{
         console.log('Error: Didn\'t click on model');
       }
      }
    },

    //Method to get the index of the selected face
    getFaceIndex: function(allFaces, face){
       for(i=0; i<allFaces.length; i++){
          if(
             allFaces[i].a == face.a &&
             allFaces[i].b == face.b &&
             allFaces[i].c == face.c
          )
            return i;
       }
       return null;
    },

    //Method to remove all measurement controls
    removeMeasureControls: function(){
       $(this.el).find('.control').find('.measure').empty();
       this.pointCount = 0;
       this.addMeasureControls();
       this.addMeasureControls();
       $(this.el).find('.control').find('.pResult').find('.distance').css('visibility', 'hidden');
       $(this.el).find('.control').find('.pResult').find('.result').css('visibility', 'hidden');

       $(this.el).find('.control').find('.clear').css('visibility', 'hidden');
       $(this.el).find('.control').find('.calculate').css('visibility', 'visible');
      $(this.el).find('.control').find('.calculate').css('margin-top', '0px');

    },

    //Method to clear markings on body
    clear: function(){
       this.removeMeasureControls();

       for(i=0; i<this.model.geometry.faces.length; i++){
            this.model.geometry.faces[i].color = new THREE.Color(0xffffff);;
       }

       this.model.geometry.colorsNeedUpdate = true;
       this.scene.remove(this.line);
    },

    //Mouse over function to allow you to click and drag body
    mouseover: function(event){
      if($(this.el).find('.control').find('trackball').checked == true){
         this.mousemove = true;
         this.controls = new THREE.TrackballControls( this.camera );
         this.scene.add(this.controls);
      }
    },

    //Rethod to remove controls when no lover over body
    mouseout: function(event){
      if($(this.el).find('.control').find('trackball').checked == true){
        this.mousemove = false;
        this.scene.remove(this.controls);
        this.controls = null;
      }
    },

    //Animate function which is always looping recursively
    animate: function(){
        requestAnimationFrame( this.animate );
        this.render();
        if(this.mousemove)
          this.controls.update();
    },

    //Render function which is again always looping
    render: function(){
        if(this.rotate){
            this.model.rotation.z += 0.025;
            if(this.line != null)
              this.line.rotation.z += 0.025;
        }

        this.camera.lookAt( this.scene.position );
        this.renderer.render( this.scene, this.camera );
    },

    //Method to identify when radio buttons are selected
    radio: function(){

      if($(this.el).find('.control').find('.clear').css('visibility')=='visible'){
        alert('You must clear before the next calcuation');
        $(this.el).find('.control').find('input#to').attr("checked", false);
        $(this.el).find('.control').find('input#from').attr("checked", false);

      }
      else if($(this.el).find('.control').find('input#to').attr("checked")=='checked'){
        this.point2 = true;
        this.point1 = false;
      }else if($(this.el).find('.control').find('input#from').attr("checked")=='checked'){
        this.point1 = true;
        this.point2 = false;
      }
    },

    //Add camera
    addCamera: function(x, y, z){
      this.camera = new THREE.PerspectiveCamera( 17, this.width / this.height, 1, 4000 );
      this.camera.position.x = x;
      this.camera.position.y = y;
      this.camera.position.z = z;
      this.scene.add( this.camera );
    },

    //Add trackball controls - making body dragable
    addControls: function(){
      this.controls = new THREE.TrackballControls( this.camera );
    },

    //Position body so it faces the front
    front: function(){
      this.scene.remove(this.camera);
      //this.scene.remove(this.controls);
      this.addCamera(0, -6, 1);
      //this.addControls();
      this.model.rotation.z = 0;
      this.camera.fov = this.zoom;
      this.camera.updateProjectionMatrix();
     },

    // view back of body
    back: function(){
      this.front();
      this.model.rotation.z = 3.2;
      this.line.rotation.z = 3.2;
    },

    // view left side of body
    left: function(){
      this.front();
      this.model.rotation.z = 4.8;
      this.line.rotation.z = 4.8;

    },

    //view right side of body
    right: function(){
      this.front();
      this.model.rotation.z = 1.6;
      this.line.rotation.z = 4.8;

    },

    //Move the camera up
    moveUp: function(){
      this.model.position.z -= 0.03;
      this.line.position.z -= 0.03;

    },

    //move the camera down
    moveDown: function(){
      this.model.position.z += 0.03;
      this.line.position.z += 0.03;
    },

    //move camera left
    moveLeft: function(){
      this.model.position.x += 0.03;
      this.line.position.x += 0.03;
    },

    //more camera right
    moveRight: function(){
      this.model.position.x -= 0.03;
      this.line.position.x -= 0.03;
    },

    //center the camera
    center: function(){
      this.model.position.x = 0;
      this.model.position.y = 0;
      this.model.position.z = 0;
      this.line.position.x = 0;
      this.line.position.y = 0;
      this.line.position.z = 0;
    },

    //Zoom in
    zoomIn: function(){
      this.camera.fov -= 1;
      this.camera.updateProjectionMatrix();
      this.zoom = this.camera.fov;
    },

    //Zoom out
    zoomOut: function(){
      this.camera.fov += 1;
      this.camera.updateProjectionMatrix();
      this.zoom = this.camera.fov;
    },

    //Reset Zoom
    middle: function(){
      this.camera.fov = 17;
      this.camera.updateProjectionMatrix();
      this.zoom = this.camera.fov;

    },

    //Rotation on
    rotateOn: function(){
      this.rotate = true;
    },

    //Rotation off
    rotateOff: function(){
       this.rotate = false;
    },

    //Wireframe on
    wireOn: function(){
      this.model.material.wireframe = true;
      this.model.material.wireframeLinewidth = 0.1;
      this.model.material.color = new THREE.Color( 0x6893DE  );
      this.wire = true;
    },

    //Wireframe Off
    wireOff: function(){
      this.model.material.wireframe = false;
      this.model.material.color = new THREE.Color(0xffffff);
      this.wire = false;
    },

    //Get vertices
    getVertices: function(){
      var text = "";
      //6449 not 8
      for(i=0; i<6449; i++){
          text = text + this.model.geometry.vertices[i].x + '\t';
          text = text + this.model.geometry.vertices[i].y + '\t';
          text = text + this.model.geometry.vertices[i].z + '\n';
      }
      return text;
    },

    measureType: function(value){
      this.measureType = value.srcElement.value;
    },

    //Start process to calculate distance and make ajax request
    calculateDistance: function(){

      console.log(this.pointArray);
      
      $(this.el).find('.control').find('.pResult').find('.distance').css('visibility', 'visible');
      $(this.el).find('.control').find('.pResult').find('.result').html("<img src='../img/ajax-loader.gif' class='gif'/>"); 
      $(this.el).find('.control').find('.pResult').find('.result').css('visibility', 'visible');
      $(this.el).find('.control').find('.calculate').css('visibility', 'hidden');
      $(this.el).find('.control').find('.calculate').css('margin-top', '-30px');
      this.selectedVertex = null;
      
      this.rotation = false;

     // if(this.measureType == 'dijkstra')
        this.ajaxRequest();
     // else
     //   this.euclideanDist();
    },


    euclideanDist: function(){

    },

    //ajaxRequest to find the shortest path
    ajaxRequest: function(){

      console.log(this.objArray);

      var text = JSON.stringify(this.objArray);
      var points = JSON.stringify(this.pointArray);

      var data = 'vertices='+text+'&points='+points+'&dataset='+dataset;

      var _this = this;

      if(this.measureType == 'dijkstra'){
        var path = '/path'
      }else{
        var path = '/euclidean'
      }

      $.ajax({
          url: path,
          dataType: "text",
          type: "POST",
          data: data,
          cache: false,
          success: function(data) {
            var newData = JSON.parse(data); 
            console.log($(_this.el).find('.control'));
            $(_this.el).find('.control').find('.pResult').find('.result').html(parseFloat(newData[0]).toFixed(7));//toFixed()
            $(_this.el).find('.control').find('.pResult').find('.result').css('visibility', 'visible');
            $(_this.el).find('.control').find('.clear').css('visibility', 'visible'); 
           
            _this.path(newData[1]);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
          }
      });
   },

   //Create an array from the text read from file
    getObjArray: function(text){
      var oArray = text.split("\n");
      //19343
       for (i=0; i<19343; i++){
          oArray[i] = oArray[i].split(" ");
       }
      return oArray;
    },

    //Draw path on body
    path: function(pathVertices){

      var vert = pathVertices.split(',');

      var pathVertices = Array();

      console.log(vert);

      for(i=0; i<vert.length; i++){
         pathVertices[i] = parseInt(vert[i])-1;   
      }

      console.log(pathVertices);

      var geometry = new THREE.Geometry();

      var material = new THREE.LineBasicMaterial({
        color: 0xF03232, linewidth: 4
      });

      for(i=0; i<pathVertices.length; i++){
        console.log(i);
        console.log(pathVertices[i]);
        console.log(this.model.geometry.vertices[pathVertices[i]]);
        geometry.vertices.push(new THREE.Vector3(
            this.model.geometry.vertices[pathVertices[i]].x,
            this.model.geometry.vertices[pathVertices[i]].y,
            this.model.geometry.vertices[pathVertices[i]].z
        ));
        console.log(pathVertices);
      }
      
      this.line = new THREE.Line(geometry, material);
      this.scene.add(this.line);
      this.line.rotation.z = this.model.rotation.z;
      this.line.position.z = this.model.position.z;
      this.line.position.x = this.model.position.x;


    },

    addMeasureControls: function(){
      console.log('addMeasureControls');
      var selectV = new SelectVertex(this.pointCount).render();
      console.log(selectV);
      $(this.el).find('.control').find('.measure').append(selectV.el);
      this.pointCount++;
    }, 

    setSelectedVertex: function(id, _this){
      this.selectedVertex = id;
      this.currVertexThis = _this;
    },

    removeSelectedVertex: function(){
      this.selectedVertex = null;
      alert('null');
    },

    removeVertex: function(id){
      this.model.geometry.faces[this.facesArray[this.selectedVertex]].color = new THREE.Color(0xffffff);
      this.model.geometry.colorsNeedUpdate = true;
    },

    pushPointArray: function(id, item){
      console.log(id + ' ' + item);
      this.pointArray[id] = parseInt(item)+1;
      console.log(this.pointArray);
    }, 

    empty: function(){
      $(this.el).find('.obj').empty();
      $(this.el).find('.measure').empty();
    },

    load: function(url){
        $(this.el).find('.obj').empty();
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open('GET', url, false);
        xmlhttp.send(null);
        this.objText = xmlhttp.responseText;
        var loader = new THREE.OBJLoader();
        var object = loader.parse(this.objText);
        object.children[0].geometry.computeFaceNormals();
        var  geometry = object.children[0].geometry;
        THREE.GeometryUtils.center(geometry);
        geometry.dynamic = true;
        var material = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
       
        this.scene.remove(this.model);
        this.model = new THREE.Mesh(geometry, material);
        this.model.geometry.dynamic = true;
        this.scene.add( this.model );

        this.objArray = this.getObjArray(this.objText);
        this.printHeight();
        // RENDERER  
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height );
        $(this.el).find('.obj').append( this.renderer.domElement );
    }, 

    printHeight: function(){
      $(this.el).find('.height').html((this.objArray[6402][3]-this.objArray[6448][3]).toFixed(7));

    }
  });

  //Morphable body view which extends the normal body view
  var MorphableBody = BodyShapeView.extend({
    xmlhttp: null,

     constructor: function(){
        this.events = _.extend( {}, BodyShapeView.prototype.events, this.events);
        console.debug( this.events );
        BodyShapeView.prototype.constructor.apply( this, arguments );
     },

     //Function to morph the body 
     morph: function(id, value){
      this.clear();
      this.xmlhttp=new XMLHttpRequest();
      var eigen = this.eigen(id);

      var count = 0;
      //6449
      for(i=0; i<6449; i++){
        
        this.objArray[i][1] = parseFloat(this.objArray[i][1]) + (value * parseFloat(eigen[count]));
        count++;
        this.objArray[i][2] = parseFloat(this.objArray[i][2]) + (value * parseFloat(eigen[count]));
        count++;
        this.objArray[i][3] = parseFloat(this.objArray[i][3]) + (value * parseFloat(eigen[count]));
        count++;
        if(i==8 || i==9)
          console.log(this.objArray[i]);
      }

      var morphedText = this.arrayToText(this.objArray);

      var rotation = this.model.rotation.z;
      var positionX = this.model.position.x;
      var positionZ = this.model.position.z;

      this.scene.remove(this.model);

      var loader = new THREE.OBJLoader();
      var object = loader.parse(morphedText);
      object.children[0].geometry.computeFaceNormals();
      var  geometry = object.children[0].geometry;
      THREE.GeometryUtils.center(geometry);
      geometry.dynamic = true;
      if(this.wire)
        var material = new THREE.MeshLambertMaterial({color: 0x86BED1, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, wireframe: true });
      else
        var material = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
      this.model = new THREE.Mesh(geometry, material);
      this.model.geometry.dynamic = true;
      this.scene.add( this.model );

      console.log(positionX);
      this.model.position.x = positionX;
      this.model.position.z = positionZ;

      this.model.rotation.z = rotation;
      this.camera.fov = this.zoom;
      this.camera.updateProjectionMatrix();
      this.printHeight();

     },

     //Function to return the body to original state
     reset: function(){
      this.scene.remove(this.model);

      var loader = new THREE.OBJLoader();
      var object = loader.parse(this.objText);
      object.children[0].geometry.computeFaceNormals();
      var  geometry = object.children[0].geometry;
      THREE.GeometryUtils.center(geometry);
      geometry.dynamic = true;
      var material = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
      this.model = new THREE.Mesh(geometry, material);
      this.model.geometry.dynamic = true;
      this.scene.add( this.model );

      this.objArray = this.getObjArray(this.objText);
      this.printHeight();



      this.zoom = 17;
      this.front();
      this.clear();

     },

     //Convert array to text
     arrayToText: function(aArray){
       var text = '';
       //19343
       for (i=0; i<19343; i++){
         text = text + aArray[i][0] + ' ';
         text = text + aArray[i][1] + ' ';
         text = text + aArray[i][2] + ' ';
         text = text + aArray[i][3] + '\n';
       }
       return text;
     },

     //Open and return contents of a specific eigen value
     eigen: function(id){
        this.xmlhttp=new XMLHttpRequest();
        this.xmlhttp.open('GET', 'data/'+dataset+'/eigen'+id+'.dat', false);
        this.xmlhttp.send(null);
        var e = this.xmlhttp.responseText.split('\n');
        return e
     },

     writeToFile: function(filename){
        var text = JSON.stringify(this.objArray);
        var data = 'vertices='+text+'&filename='+filename;
        var _this = this;
        var newData;
        
        $.ajax({
          url: '/savetofile',
          dataType: "text",
          type: "POST",
          data: data,
          cache: false,
          success: function(data) {
           var newData = JSON.parse(data);  
           popup.displayData(newData);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            alert( textStatus + " " + errorThrown);
            console.log(jqXHR);
          }
        });
     }

  });

  //Initialize views
  
  var selectData = new SelectData();
  var selectSecondObj = new SelectSecondModel();
  var controlsView = new ControlsView();
  var popup = new PopupWindow();
  var morphableBody = new MorphableBody({ el: "#morphable-body" });
  var bodyShapeView = new BodyShapeView({ el: "#mean-body" });

})(jQuery);




