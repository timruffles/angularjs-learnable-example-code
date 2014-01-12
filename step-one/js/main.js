var app = angular.module("littleSketcher",[]);

app.controller("drawingListCtrl",function($scope) {
  $scope.drawings = [
    {name: "drawing-1"},
    {name: "drawing-2"},
    {name: "drawing-3"}
  ];
  $scope.remove = function(drawing) {
    var index = $scope.drawings.indexOf(drawing);
    $scope.drawings.splice(index,1);
  };
  var drawingId = 4;
  $scope.addDrawing = function() {
    $scope.drawings.push({
      name: "drawing-" + drawingId
    });
    drawingId += 1;
  };
});