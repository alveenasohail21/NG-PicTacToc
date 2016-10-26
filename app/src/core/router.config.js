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
  function routingEvents(FRONT_END_WEBSITE_DEV_URL, FRONT_END_WEBSITE_PROD_URL, $rootScope, $auth, Restangular, userFactory, alertFactory, $state, $localStorage, photosFactory){

    // var publicStates = ['Signup', 'Login', 'Landing'];
    var publicStates = [];

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

      // show loader
      globalLoader.show();

      // first check if sku is present in query param
      var isSku = (toParams.sku)?true:false;
      var isToken = (toParams.tty)?true:false;
      var isLocalhost = (window.location.origin.indexOf('localhost') >= 0);
      var redirectLink = (isLocalhost)?FRONT_END_WEBSITE_DEV_URL:FRONT_END_WEBSITE_PROD_URL;

      // if sku is not present
      if(!isSku){
        // redirect to website
        window.location = redirectLink;
      }
      if(isLocalhost && isToken){
        $localStorage.token = toParams.tty;
      }
      else if(isLocalhost && !isToken){
        if(!$localStorage.token){
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
            // save in local data
            userFactory.createUserInLocal(response);
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
          window.location = window.location.origin;
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
        if($rootScope.sku == toParams.sku){
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
          verifySku(toParams.sku, function(isVerified){
            if(!isVerified){
              console.log('SKU Unverified');
              // redirect to website
              window.location = redirectLink;
            }
            else{
              console.log('SKU Verified');
              // save sku
              $rootScope.sku = toParams.sku;
              // Check if the user is going to a public state , route it to Dashboard because its Authenticated and have user data on rootScope
              if(publicStates.indexOf(toState.name)>=0){
                console.log("Router: going to "+toState.name+" , going to public state after auth and user data found : Invalid");
                event.preventDefault();
                $state.go('Dashboard.Prints.Upload', queryParams);
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

  }

}());
