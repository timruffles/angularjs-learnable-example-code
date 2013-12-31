(function() {

  var app = angular.module("toggleInput",[]);

  app.directive("toggleInput",function() {
    return {
      scope: true,
      controller: function($scope) {
        $scope.input = {visible: false};
      },
      link: function(scope,el,attrs) {
        var original = el;
        scope.$broadcast("inputDisplayed",false);
      }
    };
  });
  app.directive("toggleTrigger",function() {
    return {
      require: "^toggleInput",
      link: function(scope,el,attrs) {
        el.on("click",function() {
          scope.input.visible = true;
          scope.$apply();
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
          scope.input.visible = false;
          scope.$apply();
        };
        el.on("submit",function() {
          scope.$emit("toggleInput:commit");
          off();
        });
        scope.$watch("input.visible",function(val) {
          el.toggleClass("off",!val);
          if(!val) return;
          el[0].focus();
          // ignore current event
          $timeout(function() {
            $document.on("click",handler = function(event) {
              if(el.has(event.target).length > 0 || el.is(event.target)) return;
              off();
            });
          });
        });
      }
    };
  });

})();
