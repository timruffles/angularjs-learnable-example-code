function createFakeServer() {
  var server = sinon.fakeServer.create();

  var images = storage.all();

  server.respondWith("GET",  new RegExp('/api/images'),all);
  server.respondWith("GET",  new RegExp('/api/images/(\d+)'),get);
  server.respondWith("POST", new RegExp('/api/images'),create);
  server.respondWith("POST", new RegExp('/api/images/(\d+)'),update);

  function all(xhr) {
    xhr.respond(200,{},images.all());
  }
  function get(xhr,id) {
    var img = images.get(id);
    if(!img) xhr.respond(404);
    xhr.respond(200,{},img);
  }
  function create(xhr) {
    xhr.respond(200,{},img);
  }
  function update(xhr,id) {
    var img = image.get(id);
    if(!img) xhr.respond(404);
    image.update(JSON.parse(xhr.textBody));
    xhr.respond(200,{},{});
  }
}

function Storage(ls) {
  this.ls = ls;
  this.ls.id = ls.id || 1;
}
Storage.prototype = {
  all: function() {
    return Object.keys(this.ls).filter(function(x) {
      return /^image-/.test(x);
    }).map(function(k) {
      return JSON.parse(this.ls[k]);
    },this);
  },
  get: function(id) {
    return JSON.parse(this.ls["image-" + v.id]);
  },
  create: function(v) {
    v.id = this.ls.id;
    this.ls.id += 1;
    this.ls["image-" + v.id] = JSON.stringify(v);
  },
  update: function(u) {
    var img = this.get(u.id)
    for(var p in u) {
      img[p] = u[p]
    }
    this.ls["image-" + u.id] = JSON.stringify(img);
  }
}

