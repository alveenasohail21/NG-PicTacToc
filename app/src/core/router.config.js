/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for routing
 */

(function(){

  'use strict';

  angular.module('app.core')
    .config(configuration)
    .run(routingEvents);

  /* @ngInject */
  function configuration($urlRouterProvider, $locationProvider){
//      $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
  }

  /* @ngInject */
  function routingEvents(FRONT_END_WEBSITE_DEV_URL, FRONT_END_WEBSITE_PROD_URL, $rootScope, $auth, Restangular, userFactory,
                         cartFactory, alertFactory, $state, $localStorage, photosFactory, $location){

    // var publicStates = ['Signup', 'Login', 'Landing'];
    var publicStates = ['Landing'];

    $rootScope.reload = false;

    //on routing error
    $rootScope.$on('$stateNotFound',   function(event, unfoundState, fromState, fromParams){
      //do some logging and toasting
    });

    //on routing success
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      //do some title setting
      $rootScope.stateUrl = toState.url;
      $rootScope.stateName = toState.name;
      $rootScope.appTitle = "Pictaktoe";
      $rootScope.pageTitle = toState.title || 'Pictaktoe';
      $rootScope.hasHeader = toState.header || false;
      $rootScope.hasFooter = toState.footer || false;
      $rootScope.contentClass = toState.contentClass || '';

      // hide loader
      globalLoader.hide();

    });

    //on routing start
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      // debugger;
      console.log(toParams);
      console.log($location);
      $('.modal').modal('hide');
      // show loader
      globalLoader.show();
      // debugger;

      // first check if sku is present in query param
      var isLocalhost = (window.location.origin.indexOf('localhost') >= 0);
      var isSku = false;
      var sku = null;
      if(isLocalhost){
        sku = toParams.sku;
        isSku = (sku)?true:false;
      }
      else{
        sku = getParameterByName('sku', $location.$$absUrl);
        isSku = (sku)?true:false;
      }

      var isToken = (toParams.tty)?true:false;
      var redirectLink = (isLocalhost)?FRONT_END_WEBSITE_DEV_URL:FRONT_END_WEBSITE_PROD_URL;

      // if sku is not present
      if(!isSku){
        console.log('!isSku');
        // redirect to website
        window.location = redirectLink;
      }
      if(isLocalhost && isToken){
        $localStorage.token = toParams.tty;
      }
      else if(isLocalhost && !isToken){
        if(!$localStorage.token){
          console.log('isLocalhost && !isToken');
          window.location = redirectLink;
        }
      }
      // Check if User is Auth
      if($auth.isAuthenticated()){
        console.log("Router: going to "+toState.name+" , Auth done");
        Restangular.setDefaultHeaders({'token': 'Bearer {'+$auth.getToken()+'}'});
        //Check if the data exists of user on rootScope
        if(!userFactory.getUserFromLocal()){
          event.preventDefault();

          console.log('Getting User Data from API');

          // if not present, get details from API
          userFactory.getUserDetails().then(function (response) {
            console.log('API User Data Received');
            // save in local data
            userFactory.createUserInLocal(response);
            console.log('User saved in local', $rootScope.cartProjects);

            if(!$rootScope.cartProjects){
              // if not get cartProjects
              cartFactory.getCartProjects().then(function (resp){
                  if(resp.success){
                    $rootScope.cartProjects = (resp.data)?resp.data:[];
                    console.log("PROJECTS: ", $rootScope.cartProjects);
                    // $state.go(toState.name);
                  }
                });
              // debugger;
            }
            else{
              // $state.go(toState.name);
            }
            // verify sku and acl check, and then route
            skuVerificationAndACLCheck();
          });
        }
        // if exists
        else{
          console.log('User Data Already Present');
          // verify sku and acl check, and then route
          skuVerificationAndACLCheck();
        }
      }
      // if the user is not authenticated and is going to a public state , let him go!
      else if(publicStates.indexOf(toState.name)>=0){
        console.log("Router: going to "+toState.name+" not authenticated and going to a public state, Valid");
        // The user is not authenticated and is going to a public state
        if(publicStates.indexOf('Login')>=0 && $rootScope.reload){
          event.preventDefault();
          // window.location = window.location.origin;
        }
        return;
      }
      // The user is not authenticated and is going to a private state , so take him to landing
      else{
        console.log("going to "+toState.name+" not authenticated and going to a private state, invalid");
        event.preventDefault();
        alertFactory.error('Not authorized: ', 'Please login first');
        window.location = redirectLink;
      }

      function skuVerificationAndACLCheck(){
        console.log('Verifying SKU and ACL Check');
        // sku already present, means its verified
        if($rootScope.sku == sku){
          console.log('SKU Present in RootScope');
          if(publicStates.indexOf(toState.name)>=0){
            console.log("Router: going to "+toState.name+" , going to public state after auth and user data found : Invalid");
            event.preventDefault();
            $state.go('Upload', toParams);
          }
          else{
            console.log("Router: going to "+toState.name+" , going to private state after auth and user data found : Valid");
            // let him go
          }
        }
        else{
          event.preventDefault();
          photosFactory.removePhotosFromLocal();
          // fire event first
          if(eventChannel.has('skuChanged')){
            eventChannel.fire('skuChanged');
          }
          // verify sku
          verifySku(sku, function(isVerified){
            if(!isVerified){
              console.log('SKU Unverified');
              // redirect to website
              window.location = redirectLink;
            }
            else{
              console.log('SKU Verified');
              // save sku
              $rootScope.sku = sku;
              // Check if the user is going to a public state , route it to Dashboard because its Authenticated and have user data on rootScope
              if(publicStates.indexOf(toState.name)>=0){
                console.log("Router: going to "+toState.name+" , going to public state after auth and user data found : Invalid");
                event.preventDefault();
                $state.go('Upload', toParams);
              }
              else{
                console.log("Router: going to "+toState.name+" , going to private state after auth and user data found : Valid");
                // route
                $state.go(toState.name, toParams);
              }
            }
          })
        }
      }


    });

    function verifySku(sku, cb){
      userFactory.verifySku(sku).then(function (resp) {
        // true
        if(resp){
          cb(resp);
        }
        // false
        else{
          cb(resp);
        }
      })
    }

    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

  }

}());
