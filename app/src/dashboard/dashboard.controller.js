/**
 * @ngdoc controller
 * @name app.dashboard.controller:Dashboard
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashboardCtrl', dashboardCtrl);

  /* @ngInject */
  function dashboardCtrl(authFactory, restFactory, $rootScope){
    var vm = this;

    vm.testFunction = testFunction;
    vm.socialAuthenticate = socialAuthenticate;
    vm.getSocialPhotos = getSocialPhotos;
    /////////////////////

    /**
     * @ngdoc method
     * @name testFunction
     * @param {number} num number is the number of the number
     * @methodOf app.dashboard.controller:Dashboard
     * @description
     * My Description rules
     */
    function testFunction(num){
      console.info('This is a test function');
    }

    function socialAuthenticate(provider){
      //
      authFactory.socialAuthenticate(provider);
    }

    function getSocialPhotos(provider){
      var url= "/812279648803406/photos?type=uploaded";
      console.log(url);
      FB.api(url, function (response) {
          console.log(response);
          if (response && !response.error) {
            console.log(response);
          }
        }
      );
      FB.api(url, function (response) {
          console.log(response);
          if (response && !response.error) {
            console.log(response);
          }
        }
      );

      //console.log($rootScope.user);
      //
      //restFactory.photos.getSocialPhotos(provider)
      //  .then(function(resp){
      //    console.log(resp);
      //  }, function(err){
      //    console.log(err);
      //  })
    }
  }

}());
