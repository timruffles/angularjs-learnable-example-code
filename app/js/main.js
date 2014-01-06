var app = angular.module("littleSketcher",["ngRoute","ngResource","toggleInput"]);

app.controller("rootCtrl",function($scope,$rootScope) {
});


app.controller("drawingCreateCtrl",
  function($scope,$rootScope,DrawingRecord,$routeParams,errors) {

  $scope.state = {
    undone: [],
    synced: true
  };
  var state = $scope.state;

  var record = $scope.record = new DrawingRecord();
  if($routeParams.id != null) {
    record._id = $routeParams.id;
    record.$get();
  } else {
    record.commands = [];
  }

  $scope.newStroke = function(command) {
    state.synced = false
    state.undone = [];
    record.commands.push(_.defaults({
      type: "path"
    },command))
    needsSync();
  };

  $scope.undo = function() {
    if(record.commands < 1) return;
    state.synced = false
    state.undone.push(record.commands.pop());
    needsSync();
  };

  $scope.redo = function() {
    if(state.undone.length < 1) return;
    state.synced = false
    record.commands.push(state.undone.pop());
    needsSync();
  };

  $scope.save = sync;

  function sync() {
    var verb = record.$isNew() ? "create" : "save"
    record["$" + verb]()
    .then(function() {
      state.synced = true;
    })
    .catch(function(error) {
      state.synced = true;
      errors("There was a problem saving your drawing!");
    });
  };

  function needsSync() {
    state.synced = false;
    sync();
  }

});

app.controller("drawingsCtrl",function($scope,DrawingRecord) {

  $scope.drawings = DrawingRecord.query();
  $scope.deleteDrawing = function(drawing) {
    drawing.$delete()
      .then(function() {
        $scope.$emit("notify:completed","Drawing deleted");
        _.spliceOut($scope.drawings,drawing)
      })
      .catch(function() {
        $scope.$emit("notify:error","Drawing could not be deleted");
      });
  };
});

app.controller("drawingListItem",function($scope) {

  $scope.$watch("drawing.name",$scope.updateDrawing);

  $scope.updateDrawing = function(drawing) {
    $scope.drawing.$update()
      .then(function() {
        $scope.$emit("notify:completed","Drawing updated");
      })
      .catch(function() {
        $scope.$emit("notify:error","Drawing could not be updated");
      });
  };
});

app.factory("DrawingRecord",function($resource) {
  var Drawing = $resource("/api/drawing/:id",{id: '@_id'},{
    'query':  {method:'GET', isArray:true, url: "/api/drawings"},
    'create':  {method:'POST', url: "/api/drawings"},
  });
  Drawing.prototype.$isNew = function() { return this._id == null };
  return Drawing;
});

app.factory("errors",function() {
  return function(msg) {
    alert(msg)
  };
})

_.mixin({
  spliceOut: function(arr,obj) {
    var index = _.indexOf(arr,obj);
    arr.splice(index,1);
  }
})



