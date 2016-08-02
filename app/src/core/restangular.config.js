/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for restangular
 */

(function(){

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration(RestangularProvider, API_URL, $httpProvider){



    RestangularProvider.setBaseUrl(API_URL);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

    ////Enable cross domain calls
    //$httpProvider.defaults.useXDomain = true;
    ////Remove the header used to identify ajax call  that would prevent CORS from working
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";


  }

}());
