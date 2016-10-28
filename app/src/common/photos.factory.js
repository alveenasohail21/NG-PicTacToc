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

  function photosFactory($rootScope, $q, restFactory, alertFactory, designTool, $timeout){

    var _data = {
      photos: [],
      totalCount: 0
    };
    var originalPhotosContainer = [];

    $rootScope.imageConstraints= {
      maxSize: '5MB',
      minPhotoForProduct: 1
    };
    var noOFOriginalImageToDownload =12;
    var defaultQueryParams = {
      from: 0,
      size: 6,
      dimension: '260x260'
    };

    /* Return Functions */
    return {
      getSpecificProject: getSpecificProject,
      mapPhotos: mapPhotos,
      deleteProjectPhotoOrProduct: deleteProjectPhotoOrProduct,
      copyProjectPhotoOrProduct: copyProjectPhotoOrProduct,
      mapSocialPhotos: mapSocialPhotos,
      getLocalPhotosIfPresent: getLocalPhotosIfPresent,
      getSelectedPhoto: getSelectedPhoto,
      getSelectedPhotoForLayout: getSelectedPhotoForLayout,
      addPhotoToLocal: addPhotoToLocal,
      removePhotosFromLocal: removePhotosFromLocal,
      _data: _data
    };

    /* Define Fuctions */

    function getLocalPhotosIfPresent(){
      return _data;
    }

    function addPhotoToLocal(photo){
      if(photo){
        $('.ptt-lightSlider').css('opacity', 0);
        _data.photos.push(photo);
        console.log('After Pushing: ',_data.photos);
      }
    }

    function removePhotosFromLocal(){
      console.log("removing local factory data ****************");
      _data.photos = [];
      _data.totalCount = 0;
      // console.log("REMOVED FROM FACTORY", _data);
    }

    function getSpecificProject() {
      var deffered = $q.defer();
      var queryParams = {
        // base64: true
      };
      // TODO: project id should be dynamic
      var projectId = $rootScope.sku;
      restFactory.projects.getSpecificProject(projectId, queryParams)
        .then(function(resp){
          if(resp.success){
            // merging photos and products
            if('photos' in resp.data && 'products' in resp.data){
              resp.data['photos'] = resp.data['photos'].concat(resp.data['products']);
            }
            // mapping
            console.log('AFTER MERGED: ',resp.data);
            resp.data['photos'] = mapPhotos(resp.data.photos);
            resp.data['photos'].forEach(function(elem, index){
              _data.photos.push(angular.copy(elem));
            });
            // console.log("DATA IN FACTORY AFTER FETCHING", _data);
            _data.totalCount = resp.data['totalCount'];
            deffered.resolve(resp.data);
          }
          else{
            // TODO
            alertFactory.error(null, resp.message);
            deffered.reject(resp);
          }
        }, function(err){
          // TODO
          deffered.reject(err);
        });
      return deffered.promise;
    }

    //delete selected photo/product in step 1
    function deleteProjectPhotoOrProduct(photoId) {
      var deferred = $q.defer();
      // Prints step 2
      $('.collapse-loader').css('display', 'block');
      // Prints step 1
      _data.photos[getPhotoIndexThroughId(photoId)].deleting = true;
      // TODO: project id should be dynamic
      var projectId = $rootScope.sku;
      restFactory.projects.deleteProjectPhotoOrProduct(projectId, photoId)
        .then(function(resp){
          if(resp.success){
            $timeout(function() {
              $('.ptt-lightSlider').css('opacity', 0);
              _data.photos.splice(getPhotoIndexThroughId(photoId), 1);
              _data.totalCount--;
              $('.collapse-loader').css('display', 'none');
            });
            alertFactory.success(null , resp.message);
            deferred.resolve(resp);
          }
          else{
            alertFactory.error(null, resp.message);
            _data.photos[getPhotoIndexThroughId(photoId)].deleting = false;
            $('.collapse-loader').css('display', 'none');
            deferred.reject(resp);
          }
        }, function(err){
          alertFactory.error(null, err.data.message);
          _data.photos[getPhotoIndexThroughId(photoId)].deleting = false;
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function copyProjectPhotoOrProduct(photoId) {
      console.log(getPhotoIndexThroughId(photoId));
      var deferred = $q.defer();
      // Prints step 2
      $('.collapse-loader').css('display', 'block');
      // Prints step 1
      _data.photos[getPhotoIndexThroughId(photoId)].copying = true;
      // TODO: project id should be dynamic
      var projectId = $rootScope.sku;
      restFactory.projects.copyProjectPhotoOrProduct(projectId, photoId)
        .then(function(resp){
          if(resp.success){
            _data.photos[getPhotoIndexThroughId(photoId)].copying = false;
            var newPhoto = resp.data;
            $timeout(function(){
              // add the new photo
              _data.photos.splice(getPhotoIndexThroughId(photoId), 0, newPhoto);
              _data.totalCount++;
              $('.collapse-loader').css('display', 'none');
            });
            alertFactory.success(null , resp.message);
            deferred.resolve(resp);
          }
          else{
            alertFactory.error(null, resp.message);
            _data.photos[getPhotoIndexThroughId(photoId)].copying = false;
            $('.collapse-loader').css('display', 'none');
            deferred.reject(resp);
          }
        }, function(err){
          alertFactory.error(null, err.data.message);
          _data.photos[getPhotoIndexThroughId(photoId)].deleting = false;
          deferred.reject(err);
        });
      return deferred.promise;
    }

    //get a photo selected
    // by user in original size in step 2
    function getSelectedPhoto(photoId, index) {
      var deferred = $q.defer();
      $('.global-loader').css('display', 'block');
      // TODO: project id should be dynamic
      var projectId = $rootScope.sku;
      restFactory.projects.getProjectSelectedPhotoOrProduct(projectId, photoId).then(function(resp){
        if(resp.success){
          removeHighResBase64AndCanvasJSONFromAllPhotos();
          if(resp.data.isProduct){
            // add data url in resp
            resp.data.canvasDataUrl = _data.photos[index].canvasDataUrl;
            // add canvasJSON in data
            _data.photos[index].canvasJSON = resp.data.canvasJSON;
            // add photos
            _data.photos[index].photos = resp.data.photos;
            // update url
            _data.photos[index].url = resp.data.url;
          }
          console.log(_data.photos);
          // replace the photo in local data
          // _data.photos[index] = resp.data;
          // originalPhotosContainer.push(resp.data);
          deferred.resolve(resp.data);
        }
        else{
          alertFactory.error(null, resp.message);
          deferred.reject(resp);
        }
        $('.global-loader').css('display', 'none');
      });
      designTool.checkLayoutSelection();
      return deferred.promise;
    }

    function getSelectedPhotoForLayout(photoId){
      var deferred = $q.defer();
      globalLoader.show();
      // TODO: project id should be dynamic
      var projectId = $rootScope.sku;
      restFactory.projects.getProjectSelectedPhotoOrProduct(projectId, photoId, {layout: true}).then(function(resp){
        if(resp.success){
          deferred.resolve(resp);
        }
        else{
          alertFactory.error(null, resp.message);
          deferred.reject(resp);
        }
        globalLoader.hide();
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
          photoObj.original  =  photo.media$group.media$content[0].url;
          photoObj.thumbnail =photo.media$group.media$thumbnail[0].url;
          photoObj.width =  photo.media$group.media$content[0].width;
          photoObj.height = photo.media$group.media$content[0].height;
          photoObj.platform = platform;
          break;
        case 'flickr':
          break;
      }
      return photoObj;
    }

    function mapPhotos(photos){
      var arr = [];
      // console.log(photos);
      for(var key in photos){
        arr.push(photos[key]);
      }
      return arr;
    }

    function getPhotoIndexThroughId(id){
      for(var i=0; i<_data.photos.length; i++){
        if(id == _data.photos[i]._id){
          return i;
        }
      }
    }

    function removeHighResBase64AndCanvasJSONFromAllPhotos(){
      for(var i=0; i<_data.photos.length; i++){
        if(_data.photos[i].hasOwnProperty('canvasJSON')){
          console.log('removed canvasJSON');
          delete _data.photos[i].canvasJSON;
        }
        else if(_data.photos[i].hasOwnProperty('highResBase64')){
          console.log('removed highResBase64');
          delete _data.photos[i].highResBase64;
        }
      }
    }

  }
}());
