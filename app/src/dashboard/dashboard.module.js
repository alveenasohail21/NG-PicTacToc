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
              templateUrl:'src/layouts/appHeader.html',
              controller: 'appHeaderCtrl as vm'
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
      )
      .state('Dashboard.Prints',{
          url:'/prints',
          title: "Prints - Pictaktoe",
          contentClass: "prints",
          header: true,
          footer: true,
          views: {
            "content@Dashboard": {
              templateUrl:'src/dashboard/prints.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )
      .state('Dashboard.Albums',{
          url:'/albums',
          title: "Albums - Pictaktoe",
          contentClass: "albums",
          header: true,
          footer: true,
          views: {
            "content@Dashboard": {
              templateUrl:'src/dashboard/albums.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )
      .state('Dashboard.PhotoGifts',{
          url:'/photogifts',
          title: "Photo Gifts - Pictaktoe",
          contentClass: "photogifts",
          header: true,
          footer: true,
          views: {
            "content@Dashboard": {
              templateUrl:'src/dashboard/photogifts.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )
      .state('Dashboard.PhotoBooks',{
          url:'/photobooks',
          title: "Photo Books - Pictaktoe",
          contentClass: "photobooks",
          header: true,
          footer: true,
          views: {
            "content@Dashboard": {
              templateUrl:'src/dashboard/photobooks.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )




    ;
  }

}());
