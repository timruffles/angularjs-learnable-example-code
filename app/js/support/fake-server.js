function createFakeServer() {
  var xhr = sinon.useFakeXMLHttpRequest();
  xhr.onCreate = console.log.bind(console);
  var server = sinon.fakeServer.create();

  var drawings = new Storage(localStorage);


  server.respondWith("GET",  new RegExp('/api/drawings'),all);
  server.respondWith("GET",  new RegExp('/api/drawings/(\d+)'),get);
  server.respondWith("POST", new RegExp('/api/drawings'),create);
  server.respondWith("POST", new RegExp('/api/drawings/(\d+)'),update);
  server.respondWith("DELETE", new RegExp('/api/drawing'),remove);

  server.autoRespond = true;
  server.autoRespondAfter = 850;

  function all(xhr) {
    xhr.respond(200,{},drawings.all());
  }
  function get(xhr,id) {
    var img = drawings.get(id);
    if(!img) xhr.respond(404);
    xhr.respond(200,{},img);
  }
  function create(xhr) {
    var jsonDrawing = drawings.create(JSON.parse(xhr.requestBody));
    xhr.respond(200,{},jsonDrawing);
  }
  function update(xhr,id) {
    var img = drawing.get(id);
    if(!img) xhr.respond(404);
    drawing.update(JSON.parse(xhr.requestBody));
    xhr.respond(200,{},{});
  }
  function remove(xhr,drawing) {
    var resp = drawing.remove(drawing.id) ? 200 : 404;
    xhr.respond(resp,{},{});
  }
}

function Storage(ls) {
  this.ls = ls;
  this.ls.id = ls.id || 0;
}
Storage.prototype = {
  all: function() {
    var asJson = Object.keys(this.ls).filter(function(x) {
      return /^drawing-/.test(x);
    }).map(function(k) {
      return this.ls[k];
    },this);
    return "[" + asJson.join(",") + "]";
  },
  nextId: function() {
    var next = parseInt(this.ls.id) + 1;
    return this.ls.id = next;
  },
  get: function(id) {
    return this.ls["drawing-" + v.id];
  },
  create: function(v) {
    v.id = this.nextId();
    return this.ls["drawing-" + v.id] = JSON.stringify(v);
  },
  update: function(u) {
    var img = this.get(u.id)
    for(var p in u) {
      img[p] = u[p]
    }
    this.ls["drawing-" + u.id] = JSON.stringify(img);
  },
  remove: function(id) {
    if(!this.ls["drawing-" + id]) return false;
    delete this.ls["drawing-" + id];
  }
}

