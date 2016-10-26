/**
 * @ngdoc overview
 * @name app.common
 * @description Host of all the cross cutting source
 */

(function(){

  'use strict';

  angular.module('app.core')
       .constant('API_URL','http://localhost:8000')
     // .constant('API_URL','http://pictaktoeapi-dev.ap-northeast-2.elasticbeanstalk.com')
     .constant('FRONT_END_WEBSITE_DEV_URL','http://localhost:3000')
     .constant('FRONT_END_TOOL_DEV_URL','http://localhost:7030/#/upload')
     .constant('FRONT_END_WEBSITE_PROD_URL','http://pictaktoe.com')
     .constant('FRONT_END_TOOL_PROD_URL','http://pictaktoe.com/tool/#/upload')
    .constant('FRONT_END_MEDIA_DEV_URL','http://localhost:3010');

}());

