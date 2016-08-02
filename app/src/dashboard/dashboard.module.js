/**
 * @ngdoc overview
 * @name app.dashboard
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard', [])
    .config(configuration)
    .run(run);

  /* @ngInject */
  function run($rootScope){
    // setup the app
    $rootScope.app = {
      isActive: false,     // will be active through router.config.js
      productState: '',
      productTitle: ''
    };
  }

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
              templateUrl:'src/dashboard/prints/prints.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )
      .state('Dashboard.Prints.Upload',{
          url:'/upload',
          title: "Uploads - Pictaktoe",
          contentClass: "prints",
          header: true,
          footer: true,
          resolve: {
            r_photos: function(photosFactory){
              if(photosFactory.getLocalPhotosIfPresent()['photos'].length>0){
                return photosFactory.getLocalPhotosIfPresent();
              }
              else{
                return photosFactory.getPhotos()
                  .then(function(resp){
                    return resp;
                  })
              }
            },
            r_activeSocialProfiles: function(userFactory, $rootScope){
              if($rootScope.user.activeSocialProfiles){
                return $rootScope.user.activeSocialProfiles;
              }
              else{
                return userFactory.activeSocialProfilesFromServer()
                  .then(function(resp){
                    console.log(resp);
                    return resp;
                  })
              }
            }
          },
          views: {
            "@": {
              templateUrl:'src/dashboard/upload/webapp-step1.html',
              controller: 'webappStep1Ctrl as vm'
            }
          }
        }
      )
      .state('Dashboard.Prints.Design',{
          url:'/design',
          title: "Design Product - Prints",
          contentClass: "prints",
          header: true,
          footer: true,
          resolve: {
            r_photos: function(photosFactory){
              if(photosFactory.getLocalPhotosIfPresent()['photos'].length>0){
                return photosFactory.getLocalPhotosIfPresent();
              }
              else{
                return photosFactory.getPhotos()
                  .then(function(resp){
                    return resp;
                  })
              }
            }
          },
          views: {
            "@": {
              templateUrl:'src/dashboard/prints/webapp-step2.html',
              controller: 'webappStep2Ctrl as vm'
            }
          }
        }
      )
      .state('Dashboard.Prints.Checkout',{
          url:'/checkout',
          title: "Checkout - Pictaktoe",
          contentClass: "prints",
          header: true,
          footer: true,
          params: {
            id: null,
            configs: null
          },
          resolve: {
            r_product: function(photosFactory, $stateParams){
              if($stateParams.id!=null && $stateParams.configs!=null){
                console.log("INSIDE IF");
                return photosFactory.sendEditedImage($stateParams.id, $stateParams.configs)
                  .then(function(resp){
                    console.log("r_editedPhoto: ", resp);
                    return resp.data;
                  });
              }
              else{
                return null;
              }
            }
          },
          views: {
            "@": {
              templateUrl:'src/dashboard/cart/webapp-step3.html',
              controller: 'webappStep3Ctrl as vm'
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
              templateUrl:'src/dashboard/albums/albums.html',
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
              templateUrl:'src/dashboard/photogifts/photogifts.html',
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
              templateUrl:'src/dashboard/photobooks/photobooks.html',
              controller: 'dashboardCtrl as vm'
            }
          }
        }
      )




    ;
  }

}());
