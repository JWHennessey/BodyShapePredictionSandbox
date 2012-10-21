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
 *
 * Node.js server hosting the web app and dealing with AJAX reques
 */

//Require external pakages and files
var http = require('http');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var Bidirectionalgraph = require('./js/Bidirectionalgraph.js');

//Create verver
http.createServer(function (request, response) {

    //create file path
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    //Set up the content type depending on what file is being requested
    var extname = path.extname(filePath);
    var contentType = 'application/json';
    switch (extname) {
        case '.html':
            contentType = 'text/html';
            break
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.obj':
            contentType = 'text/plain';
            break;
        case '.png':
            contentType = 'text/plain';
            break;
        case '.ico':
            contentType = 'text/plain';
            break;
        case '.gif':
            contentType = 'text/plain';
            break;
        case '.dat':
            contentType = 'text/plain';
            break;
    }

    console.log(filePath);

    //If the content type isn't json serve a static file
    if(contentType  != 'application/json'){
      staticFile(request, response, filePath, contentType);
      console.log(request.url);
    //If content type is json make ajax call
    }else{
      console.log('AJAX REQUEST');
      request.content = '';
      request.addListener('data', function(data) {
        request.content += data;
      });

      if(filePath == './path'){
        request.addListener('end', function() {
          request.content = querystring.parse(request.content);
          shortestPath(request, response, request.content, contentType);
        });
      }
      else if(filePath == './euclidean'){
        request.addListener('end', function() {
         request.content = querystring.parse(request.content);
         euclideanDistance(request, response, request.content, contentType);
        });
      }
      else if(filePath == './savetofile'){
         request.addListener('end', function() {
         request.content = querystring.parse(request.content);
         saveToFile(request, response, request.content, contentType);
        });
      }
    }

}).listen(8000);


function saveToFile(request, response, content, contentType){
   var vertices = JSON.parse(content['vertices']);
   var filename = content['filename'];

  var text = "";
    for(var i=0; i<vertices.length-1; i++){
        text = text + vertices[i][0];
        text = text + " ";
        text = text + vertices[i][1];
        text = text + " ";
        text = text + vertices[i][2];
        text = text + " ";
        var temp = String(vertices[i][3]);
        text = text + temp.replace('\r', '') + '\n';
   }

   var stream = fs.createWriteStream("downloads/"+filename+".obj");
   stream.once('open', function(fd) {
      stream.write(text);
    });

  var body = "downloads/"+filename+".obj";
  console.log('working');

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end(JSON.stringify(body), 'utf-8');
}

function euclideanDistance(request, response, content, contentType){
    var vertices = JSON.parse(content['vertices']);
    var points = JSON.parse(content['points']);
    var dataset = content['dataset'];
    var dist = calculateDistance(vertices[points[0]-1],vertices[points[1]-1]);
    var body = Array(dist, Array(points[0], points[1])+"");
        response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(JSON.stringify(body), 'utf-8');
}

//Method to run dijkstra's algorithm to find the shortest path and return the results
function shortestPath(request, response, content, contentType){

    console.log('PATH');
    var vertices = JSON.parse(content['vertices']);
    var points = JSON.parse(content['points']);
    var graph = createGraph(vertices);

    var totalDistance = 0;
    var totalPath = Array();

    if(points.length > 2){
      for(var i=0; i<points.length-1; i++){
        var allPaths = graph.getAllPaths(points[i], points[(i+1)]);
        totalDistance = totalDistance + allPaths[0];
        var path = graph.getPathTo(allPaths[1], points[(i+1)]);
        if(i>0)
          totalPath = totalPath + ',' + path;
        else
          totalPath = totalPath + path;
      }

    }else{
        var allPaths = graph.getAllPaths(points[0], points[1]);
        totalDistance = allPaths[0];
        var path = graph.getPathTo(allPaths[1], points[1]);
        totalPath = path + ""; 

    }

    console.log(totalPath);
    console.log(vertices[points[0]-1]);
    console.log(vertices[points[1]-1]);
    //Return An Array(Distance, Array(PATH of vertic indicies))
    var body = Array(totalDistance, totalPath);
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(JSON.stringify(body), 'utf-8');
}

//Method to serve a static file to the browser
function staticFile(request, response, filePath, contentType){
    path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else{
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

//Method to create the graph from the body mesh
function createGraph(vertices){ 
    var graph = new Bidirectionalgraph();
    //6449
    for(i=6449; i<vertices.length-1; i++){
       graph.addEdge(vertices[i][1], vertices[i][2], 
                   calculateDistance(
                     vertices[parseFloat(vertices[i][1])-1],
                     vertices[parseFloat(vertices[i][2])-1]
                    ));
       graph.addEdge(vertices[i][1], vertices[i][3].replace('\r', ''),
                    calculateDistance(
                     vertices[parseFloat(vertices[i][1])-1],
                     vertices[parseFloat(vertices[i][3].replace('\r', ''))-1]
                    ));

       graph.addEdge(vertices[i][2], vertices[i][3].replace('\r', ''),
                    calculateDistance(
                     vertices[parseFloat(vertices[i][2])-1],
                     vertices[parseFloat(vertices[i][3].replace('\r', ''))-1]
                    ));
    }
   
    return graph;
}

//Method to calculate the Euclidean distance
function calculateDistance(v1, v2){
    var distance = Math.sqrt(
        (Math.pow((v1[1] - v2[1]), 2))+
        (Math.pow((v1[2] - v2[2]), 2))+
        (Math.pow((v1[3] - v2[3]), 2))
    );
    return distance;
}


console.log('Server running at http://127.0.0.1:8000/');


