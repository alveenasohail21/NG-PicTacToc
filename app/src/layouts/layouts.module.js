/**
 * @ngdoc overview
 * @name app.layouts
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.layouts', [])
    .config(configuration);

  /* @ngInject */
  function configuration($stateProvider){

    //add your state mappings here
    $stateProvider
      .state('Landing', {
          url:'/',
          views:
          {
            "@": {
              templateUrl:'src/layouts/landing.html'
            }
          }
        }
      );
  }

}());
