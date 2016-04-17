/**
 * @ngdoc overview
 * @name app.dashboard
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard', [])
    .config(configuration);

  /* @ngInject */
  function configuration($stateProvider){

    //add your state mappings here
    $stateProvider
      .state('Dashboard',{
          url:'/dashboard',
          title: "Dashboard - Pictaktoe",
          contentClass: "dashboard",
          header: true,
          footer: true,
          views: {
            "@": {
              templateUrl:'src/layouts/main.html'
            },
            "header@Dashboard": {
              templateUrl:'src/layouts/appHeader.html'
            },
            "content@Dashboard": {
              templateUrl:'src/dashboard/dashboard.html',
              controller: 'dashboardCtrl as vm'
            },
            "footer@Dashboard": {
              templateUrl:'src/layouts/footer.html'
            }
          }
        }
      );
  }

}());
