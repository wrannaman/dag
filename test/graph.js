import test from 'ava'

import Graph from '../Graph'

test('Graph', t => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addVertex(5);
  graph.addVertex(6);
  t.is(graph.string, '1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->'); // 1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->
  graph.addEdge(1, 2);
  graph.addEdge(1, 5);
  graph.addEdge(2, 3);
  graph.addEdge(2, 5);
  graph.addEdge(3, 4);
  graph.addEdge(4, 5);
  graph.addEdge(4, 6);
  t.is(graph.string, '1 -> 2, 5 | 2 -> 1, 3, 5 | 3 -> 2, 4 | 4 -> 3, 5, 6 | 5 -> 1, 2, 4 | 6 -> 4'); // 1 -> 2, 5 | 2 -> 1, 3, 5 | 3 -> 2, 4 | 4 -> 3, 5, 6 | 5 -> 1, 2, 4 | 6 -> 4
  t.is(graph.size, 6)
  t.is(graph.relations, 7)

  let traverseString = ""
  graph.traverseDFS(1, (vertex) => { traverseString += vertex; }); // => 1 2 3 4 5 6
  t.is(traverseString, "123456")

  traverseString = ""
  graph.traverseBFS(1, (vertex) => { traverseString += vertex; }); // => 1 2 5 3 4 6
  t.is(traverseString, "125346")

  traverseString = ""
  graph.traverseDFS(0, (vertex) => { traverseString += vertex; }); // => 'Vertex not found'
  t.is(traverseString, "")

  traverseString = ""
  graph.traverseBFS(0, (vertex) => { traverseString += vertex; }); // => 'Vertex not found'
  t.is(traverseString, "")

  t.is(graph.pathFromTo(6, 1), "6-4-5-1")
  t.is(graph.pathFromTo(3, 5), "3-2-5")

  graph.removeEdge(1, 2);
  graph.removeEdge(4, 5);
  graph.removeEdge(10, 11);
  t.is(graph.relations, 5)
  t.is(graph.pathFromTo(6, 1), "6-4-3-2-5-1")

  graph.addEdge(1, 2);
  graph.addEdge(4, 5);
  t.is(graph.relations, 7)
  t.is(graph.pathFromTo(6, 1), "6-4-5-1")

  graph.removeVertex(5);
  t.is(graph.size, 5)
  t.is(graph.relations, 4)
  t.is(graph.pathFromTo(6, 1), "6-4-3-2-1")
});
