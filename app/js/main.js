var app = angular.module("littleSketcher",["ngRoute","ngResource","toggleInput"]);

app.controller("rootCtrl",function($scope,$rootScope) {
});


app.controller("drawingCreateCtrl",
  function($scope,$rootScope,DrawingRecord,$routeParams,errors,$location) {

  $scope.state = {
    undone: [],
    synced: true,
    loading: false
  };
  var state = $scope.state;
  var idNeedsUpdate = false;

  var drawing = $scope.drawing = new DrawingRecord();
  if($routeParams.id == null) {
    drawing.commands = [];
    idNeedsUpdate = true;
    watchName();
  } else {
    drawing.id = $routeParams.id;
    drawing.$get().then(function() {
      state.loading = false;
      watchName();
    });
    state.loading = true;
  }

  $scope.newStroke = function(command) {
    state.synced = false
    state.undone = [];
    drawing.commands.push(_.defaults({
      type: "path"
    },command))
    needsSync();
  };

  $scope.undo = function() {
    if(drawing.commands < 1) return;
    state.synced = false
    state.undone.push(drawing.commands.pop());
    needsSync();
  };

  $scope.redo = function() {
    if(state.undone.length < 1) return;
    state.synced = false
    drawing.commands.push(state.undone.pop());
    needsSync();
  };


  $scope.save = sync;

  // we don't want to save every time a character
  // is changed on the name, so use debounce to save
  // only after name stops changing
  var inputSync = _.debounce(needsSync,1000);

  function sync() {
    drawing.$save()
    .then(function() {
      state.synced = true;
      if(idNeedsUpdate) {
        $location.search("id",drawing.id);
        idNeedsUpdate = false;
      }
    })
    .catch(function(error) {
      state.synced = true;
      console.error(error);
      errors("There was a problem saving your drawing!");
    });
  };

  function needsSync() {
    state.synced = false;
    sync();
  }

  function watchName() {
    $scope.$watch("drawing.name",function(newName,oldName) {
      if(newName === oldName) return; // watch was being initialized
      inputSync();
    });
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
  var Drawing = $resource("/api/drawings/:id",{id: '@id'});
  Drawing.prototype.isNew = function() {
    return !!this.id;
  };
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



