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

  function authFactory($q, alertFactory, $auth, userFactory, $localStorage, $state, $timeout, Restangular, restFactory){

    /*  */

    /* Return Functions */
    return {
      login: login,
      signup:signup,
      socialAuthenticate: socialAuthenticate,
      logout: logout,
      forgotEmailSend: forgotEmailSend
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
            Restangular.setDefaultHeaders({'token': $localStorage.token});
            userFactory.createUserInLocal(resp.data.data);
            alertFactory.success(null,resp.data.message);
            $timeout(function(){
              $state.go('Dashboard');
            },1500);
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
            Restangular.setDefaultHeaders({'token': $localStorage.token});
            userFactory.createUserInLocal(resp.data.data);
            alertFactory.success(null,resp.data.message);
            $timeout(function(){
              $state.go('Dashboard');
            },1500);
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
      $auth.authenticate(provider, ($auth.isAuthenticated()?{'token':$auth.getToken().slice(1, $auth.getToken().length-1)}:{}))
        .then(function(resp){
          console.log(resp);
          if(resp.data.success){
            alertFactory.success(null,resp.data.message);
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            //$auth.removeToken();
            //$localStorage.$reset();
            localStorage.setItem('ptt_token','"'+resp.data.token+'"');
            if(!userFactory.getUserFromLocal()){
              userFactory.createUserInLocal(resp.data.data);
              $timeout(function(){
                $state.go('Dashboard');
              },1500);
            }
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

    function forgotEmailSend(email){
      console.log('auth factory forgotEmailSend ',email);
      var deffered = $q.defer();
      if(email){
        restFactory.auth.forgotEmailSend(email)
          .then(function (resp){
            if(resp.success){
              alertFactory.success(null,resp.message);
              deffered.resolve(resp);
            }
            else{
              alertFactory.error(null,resp.message);
              deffered.reject(resp);
            }
          }, function(err){
            alertFactory.error(null,err.data.message);
            deffered.reject(err);
          })
      }
      return deffered.promise;
    }

  }

}());
