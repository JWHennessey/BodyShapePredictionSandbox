/**
 * A Javascript Bidirectional data structure to calculate the shorest path using
 * dijkstra's algorithm and priority queue
 *
 * author: James Hennessey
 */

/**
 * Data Structure for a priority queue node
 */
var PriorityNode = function(data){
  this.next = null;
  this.prev = null;
  this.data = data;
}

/**
 * Constructor for the priority queue
 */
var PriorityQueue = function(){
  this.size = 0;
  this.tail = null;
  this.head = null;
}

/*
 * PriorityQueue menthod to add an new item to the queue. 
 */
PriorityQueue.prototype.add = function(x){
  //If list is empty
  if(this.head == null){
    this.head = new PriorityNode(x);
    this.tail = this.head;
    console.log('Insert at the head');
  }else{
    var newNode = new PriorityNode(x);
    var nodePointer = this.head;

    //Loop over nodes whose data value is smaller than the new node
    while(newNode.data[0] > nodePointer.data[0] && nodePointer.next != null){
        nodePointer = nodePointer.next;
        console.log('Node Pointer data');
        console.log(nodePointer.data[0]);
    }

    //Insert at the front of the list
    if(nodePointer == this.head && newNode.data[0] < nodePointer.data[0]){
      console.log('Insert at the front of the list');
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
        //Insert at the end of the list
    }else if(nodePointer.next == null){
      console.log('Insert at the end of the list');
       newNode.prev = nodePointer;
       nodePointer.next = newNode;
       this.tail = newNode;
    //General Insert
    }else{
       console.log('Insert in the middle');
       nodePointer.prev.next = newNode;
       newNode.prev = nodePointer.prev;
       newNode.next = nodePointer;
       nodePointer.prev = newNode;
    }
  }
  this.size++;
}

/*
 * PriorityQueue method to remove and return the queue head
 */
PriorityQueue.prototype.remove = function(){
  var x = this.head.data;
  this.size--;
  if(this.head == this.tail)
     this.tail=null;

  this.head = this.head.next;
  return x;
}

/**\
 * Method to clear the priority queue
 */ 
PriorityQueue.prototype.clear = function(){
  this.head=null;
  this.tail=null;
  this.size=0;
}




/*
 * Data structure for the end to be used in the graph
 */
var Edge = function(to, distance){
  this.to = to;
  this.distance = distance;
};

/*
 * Constructor for the Bidirectional graph
 */
var Bidirectionalgraph = function(){
  this.nodes = new Array();
  this.edges = new Array();
  this.pairs = new Array();
};

/*
 * Add edge to the Bidirectional graph
 */
Bidirectionalgraph.prototype.addEdge = function(from, to, distance){
    if(typeof this.nodes[from] == "undefined" ){
      this.nodes[from] = from;
      this.edges[from] = new Array();
    }if(typeof this.nodes[to] == "undefined" ){
      this.edges[to] = new Array();
      this.nodes[to] = to;
    }
    if(typeof this.pairs[from + '|' + to] == 'undefined'){
      this.pairs[from + '|' + to] = true;
      this.pairs[to + '|' + from] = true;
      this.edges[from].push(new Edge(to, distance));
      this.edges[to].push(new Edge(from, distance));
    }
}

/*
 * Method to find the shortest path between two vertices using dijkstra's algorithm
 */
Bidirectionalgraph.prototype.getAllPaths = function(from, to){

  var pred = {};

  var dists = {};
  dists[from] = 0;

var queue = new PriorityQueue();
queue.add(Array(0, from));
console.log(queue);


while(queue.size != 0){

      var closestNode = queue.remove();
      console.log(queue);


      console.log('closestNode');
      console.log(closestNode);
      console.log('closestNode');
      var u = closestNode[1];
      var distToU = closestNode[0];

      // Get nodes adjacent to u...
      var adjacentNodes = this.edges[u];

      console.log(adjacentNodes);

      for(var i=0; i<adjacentNodes.length; i++){

        var eDist = adjacentNodes[i].distance;

        var newDist = distToU + eDist;

        var distFromTo = dists[adjacentNodes[i].to];
        //If it is the first visit to this node or the distFromTo > totalDist
        if (first_visit = (typeof dists[adjacentNodes[i].to] === 'undefined') || distFromTo > newDist) {
          dists[adjacentNodes[i].to] = newDist;
          queue.add(Array(newDist, adjacentNodes[i].to));
          pred[adjacentNodes[i].to] = u;
        }

        /*
        // If a destination node was specified and we reached it, we're done.
        if (adjacentNodes[i].to === to) {
          queue.clear();
          console.log('BREAK EARLY');
          break;
        }
        */
      }
  }

  console.log('dists');
  console.log(dists);

  console.log('pred');
  console.log(pred);

  return Array(dists[to], pred);

}

/*
 * Method to find the shortest path to a sepecific vertex
 */ 
Bidirectionalgraph.prototype.getPathTo = function(pred, to){
  var nodes = Array();
  var u = to;
  while(u){
    nodes.push(u);
    var predecessor = pred[u];
    u = pred[u];
  }
  return nodes.reverse();
}


//node.js - allows you to require file
module.exports = Bidirectionalgraph;
