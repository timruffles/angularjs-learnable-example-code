(function() {

  var app = angular.module("toggleInput",[]);

  app.directive("toggleInput",function() {
    return {
      scope: true,
      controller: function($scope) {
        $scope.input = {visible: false};
      },
      link: function(scope,el,attrs) {
        // bubbled submit events that are not
        // cancelled will cause input to toggle
        el.on("submit",function() {
          if(scope.input.visible) {
            scope.$apply(function() {
              scope.input.visible = false;
            });
          }
        });
      }
    };
  });
  app.directive("toggleTrigger",function() {
    return {
      require: "^toggleInput",
      link: function(scope,el,attrs) {
        el.on("click",function() {
          scope.$apply(function() {
            scope.input.visible = true;
          });
        });
        scope.$watch("input.visible",function(val) {
          el.toggleClass("off",val);
        });
      }
    };
  });
  app.directive("toggledInput",function($document,$timeout) {
    return {
      require: "^toggleInput",
      link: function(scope,el,attrs) {
        var handler;
        function off() {
          if(handler) $document.off("click",handler);
          handler = false;
        };
        scope.$watch("input.visible",function(val) {
          el.toggleClass("off",!val);
          if(!val) {
            off();
            return;
          }
          el.find("input").andSelf().focus();
          // ignore current event
          $timeout(function() {
            $document.on("click",handler = function(event) {
              if(el.has(event.target).length > 0 || el.is(event.target)) {
                return;
              }
              scope.$apply(function() {
                scope.input.visible = false;
              });
            });
          });
        });
      }
    };
  });

})();
