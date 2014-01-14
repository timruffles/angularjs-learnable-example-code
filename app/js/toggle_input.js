(function() {

  var app = angular.module("toggleInput",[]);

  app.directive("toggleInput",function($document,$timeout) {
    return {
      scope: {
        toEdit: "=toggleInput"
      },
      transclude: "element",
      replace: true,
      template: [
        "<div class=toggle-wrap>",
        "  <div class=toggled-content ng-transclude ng-hide=editing></div>",
        "  <form>",
        "    <input class=toggled-input ng-model=toEdit ng-show=editing>",
        "  </form>",
        "</div>"
      ].join(""),
      link: function(scope,el,attrs) {
        var documentClickHandler;
        var input = el.find(".toggled-input");
        scope.editing = false;

        el.on("click",".toggled-content",function() {
          scope.$apply(function() {
            scope.editing = true;
          });
        });
        el.on("submit",function() {
          scope.$apply(function() {
            scope.editing = false;
          });
        });

        scope.$watch("editing",function(isEditing) {
          isEditing ? onEditing() : offEditing();
        });

        function offEditing() {
          if(!documentClickHandler) return;
          $document.off("click",documentClickHandler);
          documentClickHandler = false;
        };
        function onEditing() {
          // timeout to avoid the click that triggered the edit
          $timeout(function() {
            $document.on("click",documentClickHandler = function(event) {
              if(input.is(event.target)) {
                return;
              }
              scope.$apply(function() {
                scope.editing = false;
              });
            });
          });
        }
      }
    };
  });

})();
