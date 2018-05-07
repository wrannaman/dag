"use strict";
/*
  Main DAG class
*/

class Graph {
  constructor(vertices, edges, numEdges) {
    this.vertices = vertices || [];
    this.edges = edges || [];
    this.numEdges = 0;
  }
  sanitize(v) {
    if (typeof v === 'object') v = JSON.stringify(v)
    return v
  }
  addVertex(vertex) {
    vertex = this.sanitize(vertex)
    this.vertices.push(vertex);
    this.edges[vertex] = [];
  }
  removeVertex(vertex) {
    vertex = this.sanitize(vertex)
    const index = this.vertices.indexOf(vertex);
    if (-index) { // if (-(index + 1))
      this.vertices.splice(index, 1)
    }
    while(this.edges[vertex].length) {
      const adjacentVertex = this.edges[vertex].pop()
      this.removeEdge(adjacentVertex, vertex)
    }
  }
  addEdge(v1, v2) {
    v1 = this.sanitize(v1)
    v2 = this.sanitize(v2)
    try {
      this.edges[v1].push(v2)
      this.edges[v2].push(v1)
      this.numEdges++
    } catch (e) {
      console.error("Add Edge failure ", e.message)
    }
  }
  removeEdge(v1, v2) {
    v1 = this.sanitize(v1)
    v2 = this.sanitize(v2)
    const index1 = this.edges[v1] ? this.edges[v1].indexOf(v2) : -1;
    const index2 = this.edges[v2] ? this.edges[v2].indexOf(v1) : -1;
    if (~index1) {
      this.edges[v1].splice(index1, 1)
      this.numEdges--
    }
    if (~index2) {
      this.edges[v2].splice(index2, 1)
    }
  }
  get size() {
    return this.vertices.length
  }
  get relations() {
    return this.numEdges;
  }
  traverseDFS(v, fn) {
    v = this.sanitize(v)
    if (!~this.vertices.indexOf(v)) {
      return ""; // console.log('Vertex not found ', v)
    }
    const visited = []
    this._traverseDFS(v, visited, fn);
  }
  _traverseDFS(vertex, visited, fn) {
    visited[vertex] = true;
    if (this.edges[vertex] !== undefined) {
      fn(vertex)
    }
    for (let i=0; i<this.edges[vertex].length; i++) {
      if (!visited[this.edges[vertex][i]]) {
        this._traverseDFS(this.edges[vertex][i], visited, fn)
      }
    }
  }
  traverseBFS(vertex, fn) {
    vertex = this.sanitize(vertex)
    if(!~this.vertices.indexOf(vertex)) {
      return ""; // console.log('Vertex not found');
    }
    var queue = [];
    queue.push(vertex);
    var visited = [];
    visited[vertex] = true;

    while(queue.length) {
      vertex = queue.shift()
      fn(vertex)
      for(let i=0; i < this.edges[vertex].length; i++) {
        if (!visited[this.edges[vertex][i]]) {
          visited[this.edges[vertex][i]] = true
          queue.push(this.edges[vertex][i])
        }
      }
    }
  }
  pathFromTo(vertexSource, vertexDestination) {
    vertexSource = this.sanitize(vertexSource)
    vertexDestination = this.sanitize(vertexDestination)

    if(!~this.vertices.indexOf(vertexSource)) {
      return ""; //console.log('Vertex not found')
    }
    const queue = [];
    queue.push(vertexSource);
    const visited = [];
    visited[vertexSource] = true;
    const paths = [];

    while(queue.length) {
      const vertex = queue.shift();
      for(let i = 0; i < this.edges[vertex].length; i++) {
        if(!visited[this.edges[vertex][i]]) {
          visited[this.edges[vertex][i]] = true;
          queue.push(this.edges[vertex][i]);
          paths[this.edges[vertex][i]] = vertex;
        }
      }
    }
    if(!visited[vertexDestination]) {
      return undefined;
    }

    const path = [];
    let j = 0;
    for(j = vertexDestination; j != vertexSource; j = paths[j]) {
      path.push(j);
    }
    path.push(j);
    return path.reverse().join('-');
  };
  print() {
    console.log(this.vertices.map(function(vertex) {
      if (typeof vertex !== 'string') vertex = JSON.stringify(vertex)
      return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
    }, this).join(' | '));
  };
  get string() {
    return this.vertices.map(function(vertex) {
      if (typeof vertex !== 'string') vertex = JSON.stringify(vertex)
      return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
    }, this).join(' | ');
  }
}
module.exports = Graph
