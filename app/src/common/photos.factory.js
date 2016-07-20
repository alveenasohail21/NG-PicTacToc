/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('photosFactory', photosFactory);

  function photosFactory($rootScope, $localStorage, $q, restFactory){

    /* Return Functions */
    return {
      getPhotos: getPhotos,
      uploadPhotos: uploadPhotos,
      mapPhotos: mapPhotos
    };


    /* Define Fuctions */

    function mapPhotos(photos){
      var arr = [];
      console.log(photos);
      for(var key in photos){
        arr.push(photos[key]);
      }
      return arr;
    }

    function getPhotos(queryParams) {
      var deffered = $q.defer();
      var data = queryParams || {
        from: 0,
        size: 12,
        dimension: '100x100'
      };
      console.log("Photos");
      restFactory.photos.getPhotos(data)
        .then(function(resp){
          console.log(resp);
          if(resp.success){
            resp.data['photos'] = mapPhotos(resp.data.photos);
            deffered.resolve(resp.data);
          }
          else{
            // TODO
            deffered.reject(resp);
          }
        }, function(err){
          // TODO
          deffered.reject(err);
        });
      return deffered.promise;
    }

    function uploadPhotos() {

    }

  }

}());