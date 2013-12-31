function createFakeServer() {
  var server = sinon.fakeServer.create();

  var drawings = new Storage(localStorage);

  server.respondWith("GET",  new RegExp('/api/drawings'),all);
  server.respondWith("GET",  new RegExp('/api/drawings/(\d+)'),get);
  server.respondWith("POST", new RegExp('/api/drawings'),create);
  server.respondWith("POST", new RegExp('/api/drawings/(\d+)'),update);

  server.autoRespond = true;

  function all(xhr) {
    xhr.respond(200,{},drawings.all());
  }
  function get(xhr,id) {
    var img = drawings.get(id);
    if(!img) xhr.respond(404);
    xhr.respond(200,{},img);
  }
  function create(xhr) {
    var drawing = drawings.create(JSON.parse(xhr.requestBody));
    xhr.respond(200,{},JSON.stringify(drawing));
  }
  function update(xhr,id) {
    var img = image.get(id);
    if(!img) xhr.respond(404);
    image.update(JSON.parse(xhr.requestBody));
    xhr.respond(200,{},{});
  }
}

function Storage(ls) {
  this.ls = ls;
  this.ls.id = ls.id || 0;
}
Storage.prototype = {
  all: function() {
    var asJson = Object.keys(this.ls).filter(function(x) {
      return /^image-/.test(x);
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
    return this.ls["image-" + v.id];
  },
  create: function(v) {
    v.id = this.nextId();
    return this.ls["image-" + v.id] = JSON.stringify(v);
  },
  update: function(u) {
    var img = this.get(u.id)
    for(var p in u) {
      img[p] = u[p]
    }
    this.ls["image-" + u.id] = JSON.stringify(img);
  }
}

