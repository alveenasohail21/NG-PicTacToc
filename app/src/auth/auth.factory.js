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

  function authFactory($q, alertFactory, $auth, userFactory, $localStorage, $state, $timeout, Restangular, restFactory, $rootScope){
    // var socialLoader={
    //   facebook: false,
    //   google: false,
    //   flickr: false,
    //   instagram: false
    // };
    var socialLoader=[];
    /* Return Functions */
    return {
      login: login,
      signup:signup,
      socialAuthenticate: socialAuthenticate,
      logout: logout,
      forgotEmailSend: forgotEmailSend,
      socialDisconnect: socialDisconnect,
      socialLoader: socialLoader,
      loadLoader: loadLoader
    };

    /* Define Fuctions */
    function login(user){
      console.log('auth factory login', user);
      var defer = $q.defer();
      $auth.login(user)
        .then(function(resp){
          console.log("test"+resp);
          if(resp.data.success){
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            $auth.removeToken();
            $localStorage.token = resp.data.token;
            Restangular.setDefaultHeaders({'token': 'Bearer {'+ $localStorage.token +'}'});
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
            Restangular.setDefaultHeaders({'token': 'Bearer {'+ $localStorage.token +'}'});
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
          defer.reject(err);
        });
      return defer.promise;
    }
    function loadLoader(provider){
      socialLoader[provider]=true;
    }
    function socialAuthenticate(provider){
      $('#loader-social').css("display", "inline");
      $('.login-div').css("display", "none");

      console.log("auth factory social authenticate provider: ", provider);
      var defer = $q.defer();
      //console.log($auth.getToken().slice(1, $auth.getToken().length-1));
      $auth.authenticate(provider, ($auth.isAuthenticated()?{'token':$localStorage.token}:{}))
        .then(function(resp){
          if(resp.data.success){
            alertFactory.success(null,resp.data.message);
            // remove the token saved by $auth, as its throwing 'Uncaught Syntax error'
            $auth.removeToken();
            delete $localStorage.token;
            $localStorage.token = resp.data.token;
            $localStorage.savier = 'xyz';
            $timeout(function(){
              $localStorage.token = resp.data.token;
              $localStorage.savier = 'xyz';
            }, 1000);
            //$localStorage.$reset();
            // user signup through social provider
            if(!userFactory.getUserFromLocal()){
              console.log("User signup through social provider");
              console.log(resp.data.data);
              Restangular.setDefaultHeaders({'token': 'Bearer {'+ resp.data.token +'}'});
              userFactory.createUserInLocal(resp.data.data);
              $timeout(function(){
                $state.go('Dashboard');
              },2500);
            }
            // user linked social platform
            else{
              if($rootScope.user['activeSocialProfiles']){
                $rootScope.user['activeSocialProfiles'].push(provider);
              }
              else{
                $rootScope.user['activeSocialProfiles'] = [provider];
              }
              // event with social data
              $rootScope.$emit('socialAuthenticate', resp.data);
            }
          }
          else{
            alertFactory.error(null, resp.data.message);
          }
          defer.resolve(resp);
          $('#loader-social').css("display", "none");
          $('.login-div').css("display", "inline");

        }, function(err){
          defer.reject(err);
          $('#loader-social').css("display", "none");
          $('.login-div').css("display", "inline");

        });
      return defer.promise;
    }

    function logout(){
      $auth.removeToken();
      $rootScope.$emit('logout');
      $state.go('Login',{}, {reload: true});
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

    //disconnect social login in step 1
    function socialDisconnect(platform) {
      var deferred = $q.defer();
      restFactory.auth.socialDisconnect(platform).then(function(resp){
        if(resp.success){
          userFactory.removeSocialProfile(platform);
          alertFactory.success(null,resp.message);
        }
        deferred.resolve(resp);
      });
      return deferred.promise;
    }

  }

}());
