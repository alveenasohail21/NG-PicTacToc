/**
 * @ngdoc service
 * @name app.common.alert
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('$exceptionHandler', exceptionOverwrite)
    .factory('httpInterceptors', httpInterceptors)
    .config(configs);

  function exceptionOverwrite($log){
    return function myExceptionHandler(exception, cause) {
      $log.error("EXCEPTION HANDLER: CODE ERROR");
      $log.error(exception, cause);
    };
  }

  function httpInterceptors($q, $log, alertFactory){
    return {
      // response
      response: function(resp) {
        //$log.warn("HTTP INTERCEPTOR: RESPONSE");
        //$log.warn(resp);
        return resp;
      },
      // response error
      responseError: function responseError(rejection) {
        var errMsg = rejection.data.message || "There's something wrong, we are figuring it out.";
        $log.error("HTTP INTERCEPTOR: RESPONSE ERROR");
        alertFactory.error(null, errMsg);
        return $q.reject(rejection);
      }
    };
  }

  function configs($httpProvider){
    $httpProvider.interceptors.push('httpInterceptors');
  }

}());