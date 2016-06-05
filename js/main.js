/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('sarahWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/engagemang", {templateUrl: "partials/engagemang.html", controller: "PageCtrl"})
    // pP
    .when("/portfolio", {templateUrl: "partials/portfolio.html", controller: "BlogCtrl"})
    .when("/portfolio_privat", {templateUrl: "partials/portfolio_privat.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

 
  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

angular.module('modalTest',['ui.bootstrap','dialogs'])
.controller('dialogServiceTest',function($scope,$rootScope,$timeout,$dialogs){

  
  $scope.launch = function(which){
    var dlg = null;
      // Notify Dialog
      if (which = 'notify')
      {
        dlg = $dialogs.notify('Something Happened!','Something happened that I need to tell you.');
      }

      else
      {console.log("Nothing happened")}

  };
})