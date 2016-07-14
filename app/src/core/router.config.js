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
    var appStates = [
      {
        parent: 'Dashboard.Prints',
        childStates: ['Dashboard.Prints.Upload','Dashboard.Prints.Design','Dashboard.Prints.Checkout']
      },
      {
        parent: 'Dashboard.Albums',
        childStates: ['Dashboard.Albums.Upload','Dashboard.Albums.Design','Dashboard.Albums.Checkout']
      },
      {
        parent: 'Dashboard.PhotoGifts',
        childStates: ['Dashboard.PhotoGifts.Upload','Dashboard.PhotoGifts.Design','Dashboard.PhotoGifts.Checkout']
      },
      {
        parent: 'Dashboard.PhotoBooks',
        childStates: ['Dashboard.PhotoBooks.Upload','Dashboard.PhotoBooks.Design','Dashboard.PhotoBooks.Checkout']
      }
    ];
    var appStateIndex = -1;

    //on routing error
    $rootScope.$on('$stateNotFound',   function(event, unfoundState, fromState, fromParams){
      //do some logging and toasting
    });

    //on routing success
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      //do some title setting
      $rootScope.stateUrl = toState.url;
      $rootScope.appTitle = "Pictaktoe";
      $rootScope.pageTitle = toState.title || 'Pictaktoe';
      $rootScope.hasHeader = toState.header || false;
      $rootScope.hasFooter = toState.footer || false;
      $rootScope.contentClass = toState.contentClass || '';
    });

    //on routing start
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      //
      // Check if User is Auth
      if($auth.isAuthenticated()){
        console.log("Router: going to "+toState.name+" , Auth done");
        Restangular.setDefaultHeaders({'token': 'Bearer {'+$auth.getToken()+'}'});
        //Check if the data exists of user on rootScope
        if(!userFactory.getUserFromLocal()){
          // if not present, get from token in localStorage through $auth factory
          var user = $auth.getPayload();
          userFactory.createUserInLocal(user);
          console.log("Router: user data found");
        }
        // Check if the user is going to a public state , route it to Dashboard because its Authenticated and have user data on rootScope
        if(publicStates.indexOf(toState.name)>=0){
          console.log("Router: going to "+toState.name+" , going to public state after auth and user data found : Invalid");
          event.preventDefault();
          $state.go('Dashboard');
        }
        else{
          console.log("Router: going to "+toState.name+" , going to private state after auth and user data found : Valid");
          //$state.go(toState.name, toParams);
        }
        // app configuration
        // search state in appState
        appStateIndex = -1;
        for(var i=0;i<appStates.length;i++){
          if(appStates[i].childStates.indexOf(toState.name)>=0){
            appStateIndex = i;
            break;
          }
        }
        // if found appState
        if(appStateIndex>=0){
          console.log("inside app");
          $rootScope.app.productState = appStates[appStateIndex].parent;
          $rootScope.app.productTitle = toState.title;
          $rootScope.app.isActive = true;
        }
        else{
          $rootScope.app.isActive = false;
        }
      }
      // if the user is not authenticated and is going to a public state , let him go!
      else if(publicStates.indexOf(toState.name)>=0){
        console.log("Router: going to "+toState.name+" not authenticated and going to a public state, Valid");
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
