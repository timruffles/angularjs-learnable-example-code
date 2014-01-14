var app = angular.module("exercise",[]);

// we're missing a controller

app.controller("watcher",function($scope) {
  $scope.counter = {value: 0};
  $scope.increment = function() {
    $scope.counter.value += 1;
  };
  $scope.$watch("counter.value",function(val,old) {
    if(val === old) return console.log("initialization - equal values %d %d",val,old);
    console.log("counter now %d, was %d",val,old);
  });
  $scope.timedIncrement = function() {
    setTimeout(function() {
      $scope.$apply(function() {
        $scope.increment();
      });
    },250);
  };
});
