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
      .state('Upload',{
          url:'/upload/:sku/:tty',
        params: {
          sku: null,
          tty: null
        },
          title: "Upload",
          contentClass: "prints",
          header: true,
          footer: true,
          cache: false,
          resolve: {
            r_photos: function(photosFactory, $rootScope){
              if(photosFactory.getLocalPhotosIfPresent()['photos'].length>0){
                console.log("Local PHOTOS");
                return photosFactory.getLocalPhotosIfPresent();
              }
              else{
                console.log("Fetching PHOTOS", $rootScope.sku);
                return photosFactory.getSpecificProject().then(function(resp){
                  return resp;
                })
              }
            },
            r_activeSocialProfiles: function(userFactory, $rootScope){
              if($rootScope.user.activeSocialProfiles){
                return $rootScope.user.activeSocialProfiles;
              }
              else{
                return userFactory.activeSocialProfilesFromServer().then(function(resp){
                  return resp;
                })
              }
            }
          },
          views: {
            "@": {
              templateUrl: 'src/dashboard/upload/webapp-step1.html',
              controller: 'webappStep1Ctrl as vm'
            }
          }
        }
      )
      .state('Design',{
          url:'/design/:sku/:tty',
          params: {
            sku: null,
            tty: null
          },
          title: "Design Product",
          contentClass: "prints",
          header: true,
          footer: true,
          resolve: {
            r_photos: function(photosFactory, $rootScope){
              if(photosFactory.getLocalPhotosIfPresent()['photos'].length>0){
                console.log("Local PHOTOS");
                return photosFactory.getLocalPhotosIfPresent();
              }
              else{
                $('.global-loader').css('display', 'block');
                console.log("Fetching PHOTOS", $rootScope.sku);
                return photosFactory.getSpecificProject().then(function(resp){
                  $('.global-loader').css('display', 'none');
                  return resp;
                })
              }
            }
          },
          views: {
            "@": {
              templateUrl: 'src/dashboard/prints/webapp-step2.html',
              controller: 'webappStep2Ctrl as vm'
            }
          }
        }
      )
      .state('Checkout',{
          url:'/checkout/:sku/:tty',
          params: {
            sku: null,
            tty: null
          },
          title: "Checkout",
          contentClass: "prints",
          header: true,
          footer: true,
          resolve: {
            r_items: function(cartFactory, $rootScope){
              // remove old items
              cartFactory.removeProjectItems();
              // get items again
              return cartFactory.getSpecificProjectItems($rootScope.sku);
            }
          },
          views: {
            "@": {
              templateUrl: 'src/dashboard/cart/webapp-step3.html',
              controller: 'webappStep3Ctrl as vm'
            }
          }
        }
      );
  }



}());
