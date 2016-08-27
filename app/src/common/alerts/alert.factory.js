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
    var timeoutIds = [];

    $rootScope.alert = alert;

    /* Return Functions */
    return {
      success: success,
      error: error,
      warning: warning
    };


    /* Define Fuctions */
    function success(title, message, leaveOpen) {
      // if already opened remove immediately
      if($rootScope.alert.show){
        removeAlert(0, true);
      }
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
      // if already opened remove immediately
      if($rootScope.alert.show){
        removeAlert(0, true);
      }
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
      // if already opened remove immediately
      if($rootScope.alert.show){
        removeAlert(0, true);
      }
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
    function removeAlert(time, removeNow){
      if(removeNow){
        $('.alert.alert-dismissible').css('opacity', '0');
        $rootScope.alert.show = false;
        $rootScope.alert.class = '';
        // clear timeouts
        timeoutIds.forEach(function(timeoutId){
          $timeout.cancel(timeoutId);
        });
      }
      else{
        timeoutIds = [];
        var tId;
        tId = $timeout(function(){
          $('.alert.alert-dismissible').css('opacity', '0');
        }, time-500);
        timeoutIds.push(tId);
        tId = $timeout(function(){
          $rootScope.alert.show = false;
          $rootScope.alert.class = '';
        }, time);
        timeoutIds.push(tId);
      }
    }

  }

}());
