/**
 * @ngdoc overview
 * @name app.common
 * @description Host of all the cross cutting source
 */

(function(){

  'use strict';

  angular.module('app.core')
      .constant('API_URL','http://localhost:8000');
    //.constant('API_URL','http://pictaktoeapi-dev.ap-northeast-2.elasticbeanstalk.com');

}());
