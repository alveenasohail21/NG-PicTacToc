/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('pttInstagram', pttInstagram);

  function pttInstagram($q, restFactory, $rootScope, $http, photosFactory, alertFactory){

    var platform = 'instagram';
    var authResponse = null;
    var instagramUrl = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";

    /* Return Functions */
    return {
      getPhotos: getPhotos,
      saveAuth: saveAuth,
      disconnect: disconnect
    };


    /* Define Fuctions */

    function saveAuth(data){
      console.log("Instagram Auth Response: ", data);
      authResponse = data;
    }

    function disconnect(){
      authResponse = null;
    }

    function getPhotos(pagingCursor){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        restFactory.users.socialDetails({platform: 'instagram'})
          .then(function(resp){
            console.log(resp);
            if(resp.success){
              console.log("Social DETAILS: ", resp.data);
              $rootScope.user.socialName = resp.data.social_name;
              authResponse = resp.data;
              _getPhotos();
            }
          })
      }
      // if authenticated and token is not expired, get albums
      else{
        console.log("Setting Instagram details on rootscope");
        $rootScope.user.socialName = authResponse.social_name;
        _getPhotos();
      }

      function _getPhotos(){
        // if authenticated, get album cover
        var url= instagramUrl+authResponse.access_token;
        // if pagingCursor is present
        if(pagingCursor != null){
          url = pagingCursor;
        }
        $http.get(url).then(
          function (resp) {
            console.log("Instagram Photos Response: ", resp);
            if (resp) {
              // resolve
              resp.data.data.forEach(function(elem, index){
                resp.data.data[index] = photosFactory.mapSocialPhotos(elem, platform);
              });
              deffered.resolve(resp.data);
            }
            else{
              alertFactory.error(null, "Unable to get Instagram photos, Please try later");
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;
    }

  }

}());
