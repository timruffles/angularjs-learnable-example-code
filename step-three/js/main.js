var app = angular.module("littleSketcher",["ngResource","ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider.when("/",{
    templateUrl: "tpl/index.html",
    controller: "rootCtrl"
  })
  .when("/drawings",{
    templateUrl: "tpl/drawings.html",
    controller: "drawingListCtrl"
  })
  .when("/drawings/new",{
    templateUrl: "tpl/drawings_create.html",
    controller: "drawingCreateCtrl"
  })
  .when("/drawings/:id",{
    templateUrl: "tpl/drawings_create.html",
    controller: "drawingCreateCtrl"
  });
});

app.factory("DrawingResource",function($resource) {
  var DrawingResource = $resource("/api/drawings/:id",{id:"@id"});
  return DrawingResource;
});

app.directive("toggleInput",function($document) {
  return {
    scope: {
      toggledValue: "=toggleInput"
    },
    template: [
      "<div>",
      "  <div ng-transclude ng-hide=input.visible></div>",
      "  <form>",
      "    <input ng-model='toggledValue' ng-show=input.visible>",
      "  </form>",
      "</div>"
    ].join(""),
    // pull in DOM of whole element, not just contents
    transclude: "element",
    // replace whole element, not just contents
    replace: true,
    link: function link(scope,el,attrs) {
      
      scope.input = {
        visible: false
      };
      
      var input = el.find("input");
      var bodyClickHandler;
      
      el.find("[ng-transclude]").on("click",function() {
        scope.$apply(function() {
          scope.input.visible = true;
          setTimeout(on);
        });
      });
      
      function on() {
        $document.on("click",function(event){
          if($(event.target).is(input)) {
            return;
          }
          off();
        });
      }
      function off() {

      }
      
    }
  };
});

app.controller("drawingCreateCtrl",function($scope,$routeParams) {
  $scope.drawing = {
    name: "new drawing"
  };
});

app.controller("drawingListCtrl",function($scope,DrawingResource) {
  $scope.drawings = DrawingResource.query();
  $scope.remove = function(drawing) {
    var didRemove = drawing.$remove();
    didRemove.then(function() {
      var index = $scope.drawings.indexOf(drawing);
      $scope.drawings.splice(index,1);
    },function() {
      // TODO
      alert("Oh no, couldn't remove");
    })
  };
  $scope.addDrawing = function() {
    var newDrawing = new DrawingResource();
    newDrawing.$save();
    $scope.drawings.push(newDrawing);
  };
});