
"use strict";

var NODEPADDING = 40; // 20*2
var DRAGTHRESH = 20;

var panx = window.innerWidth/2;
var pany = window.innerHeight/2;
var dragOx = 0;
var dragOy = 0;
var dragClOx = 0;
var dragClOy = 0;
var dragTarget;
var dragMoved;
var masterTouch;

var connecting;
var connectingLabel;
var connectingOffset = 16;

var tickIntervalID = -1;
var tickInterval = 1000;

var nodes = [];


 function moveListen(e) {
  if (connecting) {
   connectingLabel.style.left = e.clientX + connectingOffset + 'px';
   connectingLabel.style.top = e.clientY + connectingOffset + 'px';
  }
  if (dragTarget) {
   var dx = e.clientX - dragClOx;
   var dy = e.clientY - dragClOy;
   dragMoved = dragMoved || Math.sqrt(dx*dx + dy*dy) > DRAGTHRESH;
   if (dragTarget == 'pan') {
    panx = e.clientX - dragOx;
    pany = e.clientY - dragOy;
    moveAll();
   } else {
    dragTarget.x = e.clientX - panx - dragOx;
    dragTarget.y = e.clientY - pany - dragOy;
    move(dragTarget);
   }
  }
 }
function downListen(e) {
    dragMoved = false;
    dragOx = e.clientX - panx;
    dragOy = e.clientY - pany;
    dragClOx = e.clientX;
    dragClOy = e.clientY;
    dragTarget = 'pan';
}
function upListen(e) {
    if (dragTarget && !dragMoved) {
        if (dragTarget != 'pan') {
            if (connecting) {
                if (nodes[connecting.origin] != dragTarget) {
                    if (machineAccepts(dragTarget.machine, connecting.resource)) {
                        connecting.path = addPath(nodes[connecting.origin], dragTarget, connecting.resource);
                        nodes[connecting.origin].machine.connectors[connecting.resource].push(createConnector(connecting.origin, connecting.resource));
                        updateNodeAppearance(nodes[connecting.origin]);
                    }
                }
                stopConnecting();
            }
        } else {
            if (connecting) {
                if (blueprints[connecting.resource] &&
                    nodes[connecting.origin].machine.buffer[connecting.resource] > 0) {
                    addNode(connecting.resource, e.clientX-panx, e.clientY-pany);
                    nodes[connecting.origin].machine.buffer[connecting.resource] -= 1;
                    updateNodeAppearance(nodes[connecting.origin]);
                }
                stopConnecting();
            }
        }
    }
    dragTarget = undefined;
}
function togglePause() {
    if (tickIntervalID == -1) {
        $('pauseButton').innerHTML = 'Pause';
        tickIntervalID = setInterval(updateAll, tickInterval);
    } else {
        $('pauseButton').innerHTML = 'Unpause';
        clearInterval(tickIntervalID);
        tickIntervalID = -1;
    }
}

window.addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
        togglePause();
    }
});
window.addEventListener('mousemove', function(e) {
  moveListen(e);
 });
window.addEventListener('touchmove', function(e) {
  e.preventDefault();
  var cts = e.changedTouches;
  for (var i = 0; i < cts.length; i++) {
   if (cts[i].identifier === masterTouch) {
    moveListen(cts[i]);
    break;
   }
  }
 });
window.addEventListener('mousedown', function(e) {
  if (e.button == 0) {
   downListen(e);
  }
 });
window.addEventListener('touchstart', function(e) {
  e.preventDefault();
  var cts = e.changedTouches;
  if (cts.length > 0 && masterTouch === undefined) {
   masterTouch = cts[0].identifier;
   downListen(cts[0]);
  }
 });

function AppControls() {
    var self = this;

    self.controls = document.createElement("DIV");
    self.controls.id = "controls";

    self.pauseButton = document.createElement("BUTTON");
    self.pauseButton.id = "pauseButton";

    self.saveButton = document.createElement("BUTTON");
    self.saveButton.id = "saveButton";
    self.saveButton.innerHTML = "Save";

    self.resetButton = document.createElement("BUTTON");
    self.resetButton.id = "resetButton";
    self.resetButton.innerHTML = "Reset";

    self.saveAction = function() {
        saveToNetwork(getCookie('saveID'));
    };

    self.resetAction = function() {
        $('nodes').innerHTML = "";
        nodes = [];
        addInitialNodes();
    };

    self.addDomElements = function() {
        self.controls.appendChild(self.pauseButton);
        self.controls.appendChild(self.saveButton);
        self.controls.appendChild(self.resetButton);
        document.body.appendChild(self.controls);
    };

    self.init = function() {
        self.pauseButton.addEventListener("click", togglePause);
        self.pauseButton.addEventListener("touchstart", togglePause);

        self.saveButton.addEventListener("click", self.saveAction);
        self.saveButton.addEventListener("touchstart", self.saveAction);

        self.resetButton.addEventListener("click", self.resetAction);
        self.resetButton.addEventListener("touchstart", self.resetAction);

        self.addDomElements();
    }();
}



window.addEventListener('mouseup', function(e) {
  upListen(e);
 });
window.addEventListener('touchend', function(e) {
  e.preventDefault();
  var cts = e.changedTouches;
  for (var i = 0; i < cts.length; i++) {
   if (cts[i].identifier === masterTouch) {
    masterTouch = undefined;
    upListen(cts[i]);
   }
  }
 });

 function machineAccepts(m, resource) {
  for (var i = 0; i < m.recipes.length; i++) {
   for (var input in m.recipes[i].inputs) {
    if (input == resource) {
     return true;
    }
   }
  }
  return false;
 }

 function resourceColor(res) {
  if (res in resources) {
   return resources[res];
  } else {
   return [40,40,40];
  }
 }

 function saveAllNodes() {
  var savedNodes = [];
  for (var i = 0; i < nodes.length; i++) {
   savedNodes.push(saveNode(nodes[i]));
  }
  //return encodeURIComponent(JSON.stringify(savedNodes));
  return JSON.stringify(savedNodes);
 }
 
 function saveNode(node) {
  return {x:node.x, y:node.y, m:saveMachine(node.machine)};
 }
 
 function saveMachine(machine) {
  var savedConnectors = {};
  for (var c in machine.connectors) {
   savedConnectors[c] = [];
   for (var i = 0; i < machine.connectors[c].length; i++) {
    if (machine.connectors[c][i].resource)
     savedConnectors[c].push(saveConnector(machine.connectors[c][i]));
   }
  }
  return {n:machine.name, s:machine.stored, b:machine.buffer,
          c:savedConnectors};
 }
 
 function saveConnector(connector) {
  return {o:connector.origin,
          p:savePath(connector.path)};
 }
 
 function savePath(path) {
  if (path !== undefined) {
   return path.target;
  } else {
   return undefined;
  }
 }
 
 function loadConnector(savedConnector, resource) {
  var lc = createConnector(savedConnector.o, resource);
  lc.path = savedConnector.p;
  return lc;
 }
 
 function loadAllNodes(saved) {
  //var savedNodes = JSON.parse(decodeURIComponent(saved));
  var savedNodes = JSON.parse(saved);
  for (var i = 0; i < savedNodes.length; i++) {
   var sn = savedNodes[i];
   var n = addNode(sn.m.n, sn.x, sn.y);
   n.machine.stored = sn.m.s;
   n.machine.buffer = sn.m.b;
   for (var p in sn.m.c) {
    n.machine.connectors[p] = [];
    var cs = sn.m.c[p];
    for (var j = 0; j < cs.length; j++) {
     n.machine.connectors[p].push(loadConnector(cs[j], p));
    }
   }
  }
  for (var i = 0; i < nodes.length; i++) {
   var n = nodes[i];
   for (var c in n.machine.connectors) {
    for (var j = 0; j < n.machine.connectors[c].length; j++) {
     if (n.machine.connectors[c][j].path !== undefined) {
      n.machine.connectors[c][j].path = addPath(n, nodes[n.machine.connectors[c][j].path], c);
     }
    }
   }
  }
 }

 function addInitialNodes() {
  addNode('Worker', 128, 0);
  addNode('Worker', -128, 0);
  addNode('Worker', 0, 0);
  addNode('Forest', 128, -128);
  addNode('Steppe', 0, -128);
  addNode('Cavern', -128, -128);
  addNode('Town Hall', 0, -256);
 }

 function loadFromNetwork(saveID) {
  var r = new XMLHttpRequest();
  r.addEventListener('load', function(e) {
   if (e.target.status == 200) {
    loadAllNodes(e.target.responseText);
   } else {
    console.log('Load error: request status '+e.target.status);
    addInitialNodes();
   }
  });
  r.open("GET", 'http://kbostrom.net/werk/saves/'+saveID);
  r.send();
 }

 function saveToNetwork(saveID) {
  var r = new XMLHttpRequest();
  r.open("POST", 'http://kbostrom.net/werk/save.php');
  r.addEventListener('load', function(e) {
   console.log(e.target.responseText);
  });
  var f = new FormData();
  f.append('saveID', saveID);
  f.append('data', saveAllNodes());
  r.send(f);
 }

 function addNode(blueprint, x, y) {
  var el = document.createElement('div');
  el.className = 'node';
  el.x = x;
  el.y = y;
  el.nodeIndex = nodes.length;
  el.machine = fabricate(blueprint);
  el.style.backgroundColor = rgbSolid(resourceColor(blueprint));
  el.inPaths = [];
  el.outPaths = [];
  el.innerHTML = blueprint;
  var elDownListen = function(e) {
   dragMoved = false;
   dragOx = e.clientX - el.x - panx;
   dragOy = e.clientY - el.y - pany;
   dragClOx = e.clientX;
   dragClOy = e.clientY;
   dragTarget = el;
   if (e.stopPropagation)
    e.stopPropagation();
  }
  el.addEventListener('mousedown', function(e) {
   if (e.button == 0) {
    elDownListen(e);
   }
  });
  el.addEventListener('touchstart', function(e) {
   e.preventDefault();
   e.stopPropagation();
   var cts = e.changedTouches;
   if (cts.length > 0 && masterTouch === undefined) {
    masterTouch = cts[0].identifier;
    elDownListen(cts[0]);
   }
  });
  el.info = document.createElement('div');
  el.info.className = 'info';
  el.info.storedSection = document.createElement('div');
  el.info.appendChild(el.info.storedSection);
  el.info.outputSection = document.createElement('div');
  el.info.appendChild(el.info.outputSection);
  el.appendChild(el.info);
  $('nodes').appendChild(el);
  nodes.push(el);
  move(el);
  updateNodeInternal(el);
  updateNodeAppearance(el);
  return el;
 }

 function move(el) {
  el.style.left = el.x + 'px';
  el.style.top = el.y + 'px';
  for (var i = 0; i < el.outPaths.length; i++) {
   movePath(el.outPaths[i]);
  }
  for (var i = 0; i < el.inPaths.length; i++) {
   movePath(el.inPaths[i]);
  }
 }

 function moveAll() {
  document.body.style.backgroundPosition = (panx%128) + 'px ' + (pany%128) + 'px';
  $('nodes').style.left = panx + 'px';
  $('nodes').style.top = pany + 'px';
 }

 function addPath(ela, elb, res) {
  var p = document.createElement('div');
  p.origin = ela.nodeIndex;
  p.target = elb.nodeIndex;
  p.resource = res;
  p.style.borderColor = rgbAlpha(resourceColor(res), 0.5);
  ela.outPaths.push(p);
  elb.inPaths.push(p);
  $('nodes').insertBefore(p, $('nodes').firstChild);
  movePath(p);
  return p;
 }
 function movePath(p) {
  var o = nodes[p.origin];
  var t = nodes[p.target];
  var ox = o.x + getWidth(o)/2;
  var oy = o.y + getHeight(o)/2;
  var tx = t.x + getWidth(t)/2;
  var ty = t.y + getHeight(t)/2;
  p.className = 'path ';
  if (oy < ty) {
   var y1 = oy; var y2 = ty;
   p.className += 'B';
  } else {
   var y1 = ty; var y2 = oy;
   p.className += 'T';
  }
  if (ox < tx) {
   var x1 = ox; var x2 = tx;
   p.className += 'L';
  } else {
   var x1 = tx; var x2 = ox;
   p.className += 'R';
  }
  p.style.left = x1 + 'px';
  p.style.top = y1 + 'px';
  p.style.width = (x2-x1) + 'px';
  p.style.height = (y2-y1) + 'px';
 }

 function fabricate(blueprint) {
  return {
   name: blueprint,
   stored: {},
   buffer: {},
   connectors: {},
   recipes: blueprints[blueprint]
  };
 }
 function updateNodeInternal(n) {
  var bufferedResiduals = {};
  for (var i = 0; i < n.machine.recipes.length; i++) {
   var recipe = n.machine.recipes[i];
   var ready = true;
   for (var input in recipe.inputs) {
    if (!n.machine.stored[input] ||
        n.machine.stored[input] < recipe.inputs[input]) {
     ready = false;
     break;
    }
   }
   if (ready) {
    for (var input in recipe.inputs) {
     n.machine.stored[input] -= recipe.inputs[input];
    }
    var outputs = recipe.outputs;
    if (outputs instanceof Array)
     outputs = outputs[Math.floor(Math.random()*outputs.length)];
    for (var output in outputs) {
     if (output == "UPGRADE") {
      var upgrade = outputs[output];
      n.machine.name = upgrade;
      n.machine.recipes = blueprints[upgrade];
      n.style.backgroundColor = rgbSolid(resourceColor(upgrade));
      n.innerHTML = upgrade;
      n.appendChild(n.info);
     } else {
      if (n.machine.buffer[output] !== undefined) {
       n.machine.buffer[output] += outputs[output];
      } else {
       n.machine.connectors[output] = [createConnector(n.nodeIndex, output)];
       n.machine.buffer[output] = outputs[output];
      }
     }
    }
    if (recipe.residual) {
     var residual = recipe.residual;
     if (residual instanceof Array)
      residual = residual[Math.floor(Math.random()*residual.length)];
     for (var res in recipe.residual) {
      if (bufferedResiduals[res] !== undefined) {
       bufferedResiduals[res] += residual[res];
      } else {
       bufferedResiduals[res] = residual[res];
      }
     }
    }
   }
  }
  for (var res in bufferedResiduals) {
   if (n.machine.stored[res] !== undefined) {
    n.machine.stored[res] += bufferedResiduals[res];
   } else {
    n.machine.stored[res] = bufferedResiduals[res];
   }
  }
 }
 function updateNodeExternal(n) {
  for (var b in n.machine.buffer) {
   var bf = n.machine.buffer[b];
   var connCount = 0;
   for (var i = 0; i < n.machine.connectors[b].length; i++) {
    if (n.machine.connectors[b][i].path !== undefined)
     connCount++;
   }
   for (var i = 0; i < n.machine.connectors[b].length; i++) {
    var p = n.machine.connectors[b][i].path;
    if (p !== undefined) {
     if (nodes[p.target].machine.stored[b] !== undefined) {
      nodes[p.target].machine.stored[b] += bf/connCount;
     } else {
      nodes[p.target].machine.stored[b] = bf/connCount;
     }
     n.machine.buffer[b] -= bf/connCount;
    }
   }
   if (b in discardables && connCount == 0) {
    n.machine.buffer[b] = 0;
   }
  }
 }
 function updateNodeAppearance(n) {
  var hasStored = false;
  n.info.storedSection.innerHTML = "";
  n.info.outputSection.innerHTML = "";
  for (var s in n.machine.stored) {
   if (n.machine.stored[s] > 0) {
    var line = document.createElement('div');
    line.appendChild(document.createTextNode(Math.floor(n.machine.stored[s])+' '));
    line.appendChild(createStorageLabel(n, s));
    n.info.storedSection.appendChild(line);
    hasStored = true;
   }
  }
  if (hasStored)
   n.info.storedSection.insertBefore(document.createTextNode('Input'), n.info.storedSection.firstChild);
  var hasBuffer = false;
  for (var b in n.machine.buffer) {
   var discard = b in discardables;
   for (var i = 0; i < n.machine.connectors[b].length; i++) {
    var line = document.createElement('div');
    if (n.machine.connectors[b][i].path === undefined) {
     if (i == 0 && !discard) {
      line.appendChild(document.createTextNode(Math.floor(n.machine.buffer[b])+' '));
     } else {
      line.appendChild(document.createTextNode('+'));
     }
    } else {
     line.appendChild(document.createTextNode('-'));
    }
    line.appendChild(n.machine.connectors[b][i]);
    n.info.outputSection.appendChild(line);
   }
   hasBuffer = true;
  }
  if (hasBuffer)
   n.info.outputSection.insertBefore(document.createTextNode('Output'), n.info.outputSection.firstChild);
  n.className = updateClass(n.className, 'max', hasBuffer || hasStored);
 }
 function updateAll() {
  for (var i = 0; i < nodes.length; i++) {
   updateNodeInternal(nodes[i]);
  }
  for (var i = 0; i < nodes.length; i++) {
   updateNodeExternal(nodes[i]);
  }
  for (var i = 0; i < nodes.length; i++) {
   updateNodeAppearance(nodes[i]);
  }
 }
 function updateClass(className, toToggle, newState) {
  if (className.includes(toToggle)) {
   if (newState) {
    return className;
   } else {
    return className.replace(' '+toToggle, '');
   }
  } else {
   if (newState) {
    return className+' '+toToggle;
   } else {
    return className;
   }
  }
 }

 function removePath(p) {
  var newConns = [];
  for (var i = 0; i < nodes[p.origin].machine.connectors[p.resource].length; i++) {
   var conn = nodes[p.origin].machine.connectors[p.resource][i];
   if (conn.path !== undefined) {
    if (conn.path == p) {
     conn.path = undefined;
    }
    newConns.push(conn);
   }
  }
  nodes[p.origin].machine.connectors[p.resource] = newConns;
  updateNodeAppearance(nodes[p.origin]);
  nodes[p.origin].outPaths.splice(nodes[p.origin].outPaths.indexOf(p), 1);
  nodes[p.target].inPaths.splice(nodes[p.target].inPaths.indexOf(p), 1);
  p.remove();
 }
 function createConnector(n, res) {
  var c = createResourceLabel(res);
  c.resource = res;
  c.origin = n;
  c.path = undefined;
  var cDownListen = function(e) {
   if (!connecting) {
    if (e.target.path) {
     nodes[e.target.path.target].className = updateClass(nodes[e.target.path.target].className, 'hl', false);
     removePath(e.target.path);
    } else {
     for (var i = 0; i < nodes.length; i++) {
      nodes[i].className = updateClass(nodes[i].className, 'hl', machineAccepts(nodes[i].machine, e.target.resource));
     }
     connecting = e.target;
     connectingLabel = createResourceLabel(e.target.resource);
     connectingLabel.style.position = 'fixed';
     connectingLabel.style.left = e.clientX + connectingOffset + 'px';
     connectingLabel.style.top = e.clientY + connectingOffset + 'px';
     $('nodes').appendChild(connectingLabel);
    }
    if (e.stopPropagation)
     e.stopPropagation();
   }
  }
  c.addEventListener('mousedown', function(e) {
   if (e.button == 0) {
    cDownListen(e);
   }
  });
  c.addEventListener('touchstart', function(e) {
   e.preventDefault();
   e.stopPropagation();
   var cts = e.changedTouches;
   if (cts.length > 0 && masterTouch === undefined) {
    masterTouch = cts[0].identifier;
    cDownListen(cts[0]);
   }
  });
  c.addEventListener('mouseover', function(e) {
   if (e.target.path)
    nodes[e.target.path.target].className = updateClass(nodes[e.target.path.target].className, 'hl', true);
  });
  c.addEventListener('mouseout', function(e) {
   if (e.target.path)
    nodes[e.target.path.target].className = updateClass(nodes[e.target.path.target].className, 'hl', false);
  });
  return c;
 }
 function createResourceLabel(res) {
  var l = document.createElement('div');
  l.className = 'connector';
  l.innerHTML = res;
  l.style.backgroundColor = rgbSolid(resourceColor(res));
  return l;
 }
 function createStorageLabel(n, res) {
  var s = createResourceLabel(res);
  s.resource = res;
  s.owner = n;
  function sDownListen(e) {
   if (!connecting) {
    var o = e.target.owner;
    var flushed = false;
    for (var i = 0; i < o.inPaths.length; i++) {
     var p = o.inPaths[i];
     if (p.resource == e.target.resource) {
      nodes[p.origin].machine.buffer[p.resource] += o.machine.stored[p.resource];
      removePath(p);
      updateNodeAppearance(nodes[p.origin]);
      flushed = true;
      break;
     }
    }
    if (flushed || !machineAccepts(o.machine, e.target.resource)) {
     delete o.machine.stored[e.target.resource];
     updateNodeAppearance(o);
    }
    if (e.stopPropagation)
     e.stopPropagation();
   }
  }
  s.addEventListener('mousedown', function(e) {
   if (e.button == 0) {
    sDownListen(e);
   }
  });
  s.addEventListener('touchstart', function(e) {
   e.preventDefault();
   e.stopPropagation();
   var cts = e.changedTouches;
   if (cts.length > 0 && masterTouch === undefined) {
    masterTouch = cts[0].identifier;
    sDownListen(cts[0]);
   }
  });
  return s;
 }
 function correctIndex(old, removed) {
  return old > removed ? old-1 : old;
 }
 function removeNode(ni) {
  var n = nodes[ni];
  nodes.splice(ni, 1);
  for (var i = 0; i < n.inPaths.length; i++) {
   var p = n.inPaths[i];
   nodes[p.origin].machine.buffer[p.resource] += n.machine.stored[p.resource];
   updateNodeAppearance(nodes[p.origin]);
   removePath(p);
  }
  for (var i = 0; i < n.outPaths.length; i++) {
   removePath(n.outPaths[i]);
  }
  for (var i = 0; i < nodes.length; i++) {
   nodes[i].nodeIndex = i;
   for (var j = 0; j < nodes[i].inPaths.length; j++) {
    var p = nodes[i].inPaths[j];
    p.origin = correctIndex(p.origin, ni);
    p.target = correctIndex(p.target, ni);
   }
  }
  n.remove();
 }
 function stopConnecting() {
  for (var i = 0; i < nodes.length; i++) {
   nodes[i].className = updateClass(nodes[i].className, 'hl', false);
  }
  connecting = undefined;
  connectingLabel.remove();
  connectingLabel = undefined;
 }


function startup() {
    moveAll();
    new AppControls();
    deleteCookie('save');
    if (!getCookie('saveID')) {
        setCookie('saveID', getTimestamp());
    }
    loadFromNetwork(getCookie('saveID'));
    updateAll();
    togglePause();
}
