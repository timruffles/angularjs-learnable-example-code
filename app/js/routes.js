app.config(function($locationProvider) {
  // $locationProvider.html5Mode(true); // only if we're running on a server
});
app.config(function($routeProvider) {
  $routeProvider
    .when("/",{
      templateUrl: "tpls/index.html",
      controller: "rootCtrl"
    })
    .when("/drawings",{
      templateUrl: "tpls/drawings_list.html",
      controller: "drawingsCtrl"
    })
    .when("/drawings/new",{
      templateUrl: "tpls/drawings_new.html",
      controller: "drawingCreateCtrl"
    })
    .when("/drawings/:id",{
      templateUrl: "tpls/drawings_new.html",
      controller: "drawingCreateCtrl"
    });
});
