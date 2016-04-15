/**
 * @ngdoc service
 * @name app.auth.auth
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.auth')
    .factory('authFactory', authFactory);

  function authFactory($q, restFactory, alertFactory){

    /* Return Functions */
    return {
      login: login,
      signup:signup
    };

    /* Define Fuctions */
    function login(user){
      console.log('auth factory login', user);
      var defer = $q.defer();
      restFactory.login(user)
        .then(function(resp){
          defer.resolve(resp);
        }, function(err){
          defer.reject(err);
        });
      return defer.promise;
    }

    function signup(user){
      console.log("factory signup",user);
    }

  }

}());