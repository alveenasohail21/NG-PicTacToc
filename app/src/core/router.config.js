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
  function configuration($urlRouterProvider){

    $urlRouterProvider.otherwise('/');

  }

  /* @ngInject */
  function routingEvents($rootScope, $auth, Restangular, userFactory, alertFactory, $state){

    var publicStates = ['Signup', 'Login', 'Landing'];

    //on routing error
    $rootScope.$on('$stateNotFound',   function(event, unfoundState, fromState, fromParams){
      //do some logging and toasting
    });

    //on routing success
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      //do some title setting
      $rootScope.stateUrl = toState.url;
      $rootScope.appTitle = "SIMPPLO";
      $rootScope.pageTitle = toState.title || 'Simpplo';
      $rootScope.hasHeader = toState.header || false;
      $rootScope.hasFooter = toState.footer || false;
      $rootScope.contentClass = toState.contentClass || '';
    });

    //on routing start
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      //
      // Check if User is Auth
      if($auth.isAuthenticated()){
        console.log("going to "+toState.name+" Auth done");
        //Restangular.setDefaultHeaders({'token': $auth.getToken()});
        //Check if the data exists of user on rootScope
        if(!userFactory.getUserFromLocal()){
          var user = $auth.getPayload();
          userFactory.createUserInLocal(user);
          console.log("going to "+toState.name+" user data found");
          //* Check if the user is going to a public state , route it to Dashboard because its Authenticated and have user data on rootScope
        }
        if(publicStates.indexOf(toState.name)>=0){
          console.log("going to "+toState.name+" going to public state after auth and user data found");
          event.preventDefault();
          $state.go('Dashboard');
        }
        else{
          //$state.go(toState.name, toParams);
        }
      }
      // if the user is not authenticated and is going to a public state , let him go!
      else if(publicStates.indexOf(toState.name)>=0){
        console.log("going to "+toState.name+" not authenticated and going to a public state, valid");
        // The user is not authenticated and is going to a public state
        return;
      }
      // The user is not authenticated and is going to a private state , so take him to landing
      else{
        console.log("going to "+toState.name+" not authenticated and going to a private state, invalid");
        event.preventDefault();
        alertFactory.error('Not authorized: ', 'Please login first');
        $state.go('Login');
      }
    });

  }

}());
