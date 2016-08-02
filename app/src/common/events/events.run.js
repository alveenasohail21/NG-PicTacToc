/**
 * @ngdoc service
 * @name app.common.eventsFactory
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .run(events);

  function events($rootScope, photosFactory, userFactory, cropperFactory, pttInstagram, pttFBFactory, alertFactory){

    /* ALL $ROOTSCOPE EVENTS WILL BE CAPTURED HERE */

    // user log out
    $rootScope.$on('logout', function(){
      console.log("Angular Event: logout");
      // remove photos from local factory
      photosFactory.removePhotosFromLocal();
      // remove data and token
      userFactory.removeUserFromLocal();
    });

    // social authenticate
    $rootScope.$on('socialAuthenticate', function(event, args){
      console.log("Angular Event: socialAuthenticate");
      console.log("Angular Event Args: ", args);
      // set the data in respective factory
      switch(args.provider){
        case 'facebook':
          pttFBFactory.saveAuth(args);
          break;
        case 'instagram':
          pttInstagram.saveAuth(args);
          break;
        case 'google':
          break;
        case 'flickr':
          break;
      }
    })

  }
}());