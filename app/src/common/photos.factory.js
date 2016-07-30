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

    var _data = {
      photos: [],
      totalCount: 0
    };

    /* Return Functions */
    return {
      getPhotos: getPhotos,
      uploadPhotos: uploadPhotos,
      mapPhotos: mapPhotos,
      deletePhoto: deletePhoto,
      mapSocialPhotos: mapSocialPhotos,
      getLocalPhotosIfPresent: getLocalPhotosIfPresent,
      getSelectedPhoto: getSelectedPhoto
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

    function getLocalPhotosIfPresent(){
      return _data;
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
            resp.data['photos'].forEach(function(elem, index){
              _data.photos.push(angular.copy(elem));
            });
            _data.totalCount = resp.data['totalCount'];
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

    //delete selected photo in step 1
    function deletePhoto(id) {
      var deferred = $q.defer();
      restFactory.photos.deletePhoto(id).then(function(response){
        console.log(response);
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    //get a photo selected by user in original size in step 2
    function getSelectedPhoto(id) {
      var deferred = $q.defer();
      restFactory.photos.getSelectedPhoto(id)
        .then(function(resp){
              console.log(resp.data);
          if('imageBase64' in resp.data){
            resp.data.base64 = resp.data.imageBase64;
            delete resp.data.imageBase64;
          }
          deferred.resolve(resp.data);
        });
      return deferred.promise;
    }

    function mapSocialPhotos(photo, platform){
      var photoObj = {
        original: '',
        thumbnail: '',
        width: '',
        height: '',
        platform: ''
      };
      switch(platform){
        case 'facebook':
          photoObj.original = photo.source;
          photoObj.thumbnail = photo.picture;
          photoObj.width = photo.width;
          photoObj.height = photo.height;
          photoObj.platform = platform;
          break;
        case 'instagram':
          photoObj.original = photo.images.standard_resolution.url;
          photoObj.thumbnail = photo.images.thumbnail.url;
          photoObj.width = photo.images.standard_resolution.width;
          photoObj.height = photo.images.standard_resolution.height;
          photoObj.platform = platform;
          break;
        case 'google':
          break;
        case 'flickr':
          break;
      }

      return photoObj;
    }

  }
}());