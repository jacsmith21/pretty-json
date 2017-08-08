Pretty JSON
== 

Simple library to render/format two JS objects to an HTML view and compare them visually. Forked from [warfares/pretty-json](https://github.com/warfares/pretty-json)
<br/>

Here is a [demo](https://jacsmith21.github.io/pretty-json/)!

Download it [here](https://raw.githubusercontent.com/jacsmith21/pretty-json/master/build/pretty-json-min.js)!

Dependecies
--
* Backbone 1.1.2 (code structure) 
* Underscore 1.7.0 
* JQuery 1.11.1 (DOM manipulation)

Usage
--
```

//obj to render.
var obj1 = {
  name:'John Doe',
  age: 20,
  children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
  wife:{name:'Jane Doe', age:28 }
}

//obj to compare against
var obj2 = {
  name:'John Smith',
  age: 22,
  children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
  wife: null
}

//Passing in obj2 allows the renderer to add "different", "same", "new" & "missing" class tags
var node1 = new PrettyJSON.view.Node({
  el:$('#elem1'),
  data: obj1
  compareTo: obj2
});

//If you render two json objects you can "link" them using the counterpart property
var node2 = new PrettyJSON.view.Node({
  el:$('#elem2'),
  data: obj1
  compareTo: obj2,
  counterpart: node1
});
```

Properties.
--
<b>el</b>: DOM elem to append the JSON-HTML view.
<br/>
<b>data</b>: the JSON data.
<br/>
<b>compareTo</b>: the JSON data to compare against.
<br/>
<b>counterpart</b>: another Node object to link to (so they open/close at the same time)
<br/>
<b>dateFormat</b>: <em>(optional)</em> format date, ex: "DD/MM/YYYY HH24:MI:SS". 
  - YYYY : year
  - YY : year
  - MM : month
  - DD : day
  - HH24 : hour 24-format
  - HH : hours
  - MI : minutes
  - SS : seconds

Methods
--
Node
<br/>
<b>expandAll</b>: recursive open & render all nodes. (lazy render: the node will render only if it's expanded)
<br/>
<b>collapseAll</b>: close (Hide) all nodes.

Events
--
Node
<br/>
<b>collapse</b>: trigger when a node is show or hide. (event)
<br/>
<b>mouseover</b>: trigger when mouse over a node. (path)
<br/>
<b>mouseout</b>: trigger when mouse out the node (event)

* Note: "node" is an Obj or an Array.
* Note : only tested in Chrome & FireFox.

## Testing

Mocha and Chai are used to test this library. To run the tests:

1. Install the dependencies: `$ npm install jquery jsdom underscore backbone mocha chai sinon sinon-chai testem`
2. Run testem: `$ testem`
3. Go to the webpage!
