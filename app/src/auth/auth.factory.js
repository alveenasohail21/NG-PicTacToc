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

  function authFactory($q, alertFactory, $auth, userFactory, $localStorage, $state){

    /*  */

    /* Return Functions */
    return {
      login: login,
      signup:signup,
      socialAuthenticate: socialAuthenticate,
      logout: logout
    };

    /* Define Fuctions */
    function login(user){
      console.log('auth factory login', user);
      var defer = $q.defer();
      $auth.login(user)
        .then(function(resp){
          console.log(resp);
          if(resp.data.success){
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            $auth.removeToken();
            $localStorage.token = resp.data.token;
            $auth.setToken($localStorage.token);
            userFactory.createUserInLocal(resp.data.data);
            alertFactory.success(null,resp.data.message);
            $state.go('Dashboard');
          }
          else{
            alertFactory.error(null,resp.data.message);
          }
          defer.resolve(resp);
        }, function(err){
          console.log(err);
          alertFactory.error(null,err.data.message);
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
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            $auth.removeToken();
            $localStorage.token = resp.data.token;
            $auth.setToken($localStorage.token);
            userFactory.createUserInLocal(resp.data.data);
            alertFactory.success(null,resp.data.message);
            $state.go('Dashboard');
          }
          else{
            alertFactory.error(null,resp.data.message);
          }
          defer.resolve(resp);
        }, function(err){
          console.log(err);
          alertFactory.error(null,err.data.message);
          defer.reject(err);
        });
      return defer.promise;
    }

    function socialAuthenticate(provider){
      console.log("auth factory social authenticate provider: ", provider);
      var defer = $q.defer();
      $auth.authenticate(provider)
        .then(function(resp){
          console.log(resp);
          if(resp.data.success){
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            $auth.removeToken();
            $localStorage.token = resp.data.token;
            $auth.setToken($localStorage.token);
            userFactory.createUserInLocal(resp.data.data);
            alertFactory.success(null,resp.data.message);
            $state.go('Dashboard');
          }
          else{
            alertFactory.error(null,resp.data.message);
          }
          defer.resolve(resp);
        }, function(err){
          console.log(err);
          alertFactory.error(null,err.data.message);
          defer.reject(err);
        });
      return defer.promise;
    }

    function logout(){
      console.log('logout clicked');
      $auth.removeToken();
      userFactory.removeUserFromLocal();
      $state.go('Login');
    }

  }

}());
