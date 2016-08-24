/**
 * @ngdoc service
 * @name app.common.alert
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('alertFactory', alertFactory);

  function alertFactory($rootScope, $timeout){

    /* Variables */
    var alert = {
      title: "Success!",
      message: "You are landed at the right spot.",
      show: false,
      class: "alert-success"
    };
    var defaultTimeout = 8000; // 8 seconds

    $rootScope.alert = alert;

    /* Return Functions */
    return {
      success: success,
      error: error,
      warning: warning
    };


    /* Define Fuctions */
    function success(title, message, leaveOpen) {
      $rootScope.alert.class = 'alert-success';
      $rootScope.alert.title = title || 'Success: ';
      $rootScope.alert.message = message;
      $rootScope.alert.show = true;
      $timeout(function(){
        $('.alert.alert-dismissible').css('opacity', '1');
      });
      if(!leaveOpen)
        removeAlert(defaultTimeout);
    }

    function error(title, message, leaveOpen) {
      $rootScope.alert.class = 'alert-danger';
      $rootScope.alert.title = title || 'Error: ';
      $rootScope.alert.message = message;
      $rootScope.alert.show = true;
      $timeout(function(){
        $('.alert.alert-dismissible').css('opacity', '1');
      });
      if(!leaveOpen)
        removeAlert(defaultTimeout);
    }
    function warning(title, message, leaveOpen) {
      $rootScope.alert.class = 'alert-warning';
      $rootScope.alert.title = title || 'Warning: ';
      $rootScope.alert.message = message;
      $rootScope.alert.show = true;
      $timeout(function(){
        $('.alert.alert-dismissible').css('opacity', '1');
      });
      if(!leaveOpen)
        removeAlert(defaultTimeout);
    }
    function removeAlert(time){
      $timeout(function(){
        $('.alert.alert-dismissible').css('opacity', '0');
      }, time-500);
      $timeout(function(){
        $rootScope.alert.show = false;
        $rootScope.alert.class = '';
      }, time)
    }

  }

}());
