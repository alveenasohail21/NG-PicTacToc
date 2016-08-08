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
      // reload due to photoFactory bhand
      $rootScope.reload = true;
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
    });

    // social disconnect
    $rootScope.$on('socialDisconnect', function(event, args){
      console.log("Angular Event: socialDisconnect");
      console.log("Angular Event Args: ", args);
      // set the data in respective factory
      switch(args.provider){
        case 'facebook':
          pttFBFactory.disconnect();
          break;
        case 'instagram':
          pttInstagram.disconnect();
          break;
        case 'google':
          break;
        case 'flickr':
          break;
      }
    });

    // Upload Category Change
    $rootScope.$on('uploadCategoryChange', function(event, args){
      console.log("Angular Event: uploadCategoryChange");
      console.log("Angular Event Args: ", args);
      // clear the internal data from all social factory
      pttFBFactory.clearInternalData();
    });

    // sidemenu toggles
    $rootScope.$on('sidemenuToggles', function(event, args){
      console.log("Angular Event: sidemenuToggles");
      console.log("Angular Event Args: ", args);
      var cssElem = {
        filters: '.sidemenu-filters div.filter',
        stickers: '#gallery-container',
        layouts: '.sidemenu-layouts .empty-images img',
        texts: '.sidemenu-texts div.text'
      };

      // apply animation
      $(document).ready(function(){
        setTimeout(function () {
          // check for first time opening, then no previousTemplate
          if(args.previousTemplate != null)
            $(cssElem[args.previousTemplate]).css('opacity', 0);
          // check if its closing
          if(args.currentTemplate != null)
            $(cssElem[args.currentTemplate]).css('opacity', 1);
        }, 500);
      });

      // extra work
      switch(args.currentTemplate){
        case 'stickers':
          setTimeout(function () {
            $(function() {
              $('#gallery-container').snapGallery({
                maxCols: 2,
                margin: 5,
                minWidth: 100
              });
            });
          }, 500);
          break;
        default:
          break;
      }

    });

  }
}());