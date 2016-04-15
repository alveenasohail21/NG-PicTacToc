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

  function authFactory($q, restFactory, alertFactory, $auth){

    /* Return Functions */
    return {
      login: login,
      signup:signup
    };

    /* Define Fuctions */
    function login(user){
      console.log('auth factory login', user);
      var defer = $q.defer();
      $auth.login(user)
        .then(function(resp){
          console.log(resp);
          if(resp.data.success){
            alertFactory.success('Success!',resp.data.message);
          }
          else{
            alertFactory.error('Error!',resp.data.message);
          }
          defer.resolve(resp);
        }, function(err){
          console.log(err);
          alertFactory.error('Error!',err.data.message);
          defer.reject(err);
        });
      return defer.promise;
    }

    function signup(user){
      console.log("auth factory signup",user);
      var defer = $q.defer();
      $auth.signup(user)
        .then(function(resp){
          console.log(resp);
          if(resp.data.success){
            alertFactory.success('Success!',resp.data.message);
          }
          else{
            alertFactory.error('Error!',resp.data.message);
          }
          defer.resolve(resp);
        }, function(err){
          console.log(err);
          alertFactory.error('Error!',err.data.message);
          defer.reject(err);
        });
      return defer.promise;
    }

  }

}());
