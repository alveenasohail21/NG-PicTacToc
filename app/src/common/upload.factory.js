/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('uploadFactory', uploadFactory);

  function uploadFactory(API_URL, $q, alertFactory, Upload, $localStorage, photosFactory){

    var _data = {
      // device list
      deviceFiles: [],
      // social list
      socialFiles: []
    };

    /* Return Functions */
    return {
      getFiles: getFiles,
      addFile: addFile,
      removeFiles: removeFiles,
      removeFile: removeFile,
      uploadFile: uploadFile,
      _data: _data
    };

    /* Define Functions */
    function getFiles(){
      return _data;
    }

    function addFile(file, category){
      if(file){
        if(category == 'device'){
          _data.deviceFiles.push(file);
        }
        else{
          _data.socialFiles.push(file);
        }
      }
    }

    function removeFiles(category){
      console.log("removing files from upload factory  ****************");
        if(category == 'device'){
          _data.deviceFiles = [];
        }
        else{
          _data.socialFiles = [];
        }
      console.log("REMOVED FROM FACTORY", _data);
    }

    function removeFile(index){
      console.log("removing file from upload factory  ****************");
      _data.splice(index, 1);
      console.log("REMOVED FROM FACTORY", _data);
    }

    function uploadFile(index, uploadCategory, callback){
      // set url on the basis of uploadCategory
      var url;
      var file;
      switch (uploadCategory) {
        case 'device':
          url = API_URL + '/photos/upload/device';
          file = _data.deviceFiles[index];
          break;
        case 'facebook':
        case 'instagram':
          url = API_URL + '/photos/upload/social';
          file = _data.socialFiles[index];
          break;
      }
      // uploading files
      console.log("uploading file from upload Factory: ", _data.deviceFiles[index]);
      // added here only for progress :/
      if (file) {

        Upload.upload({
          method: 'POST',
          url: url,
          data: {
            files: [file]
          },
          headers: {
            'Content-Type': 'application/json',
            'token': 'Bearer {' + $localStorage.token + '}'
          }
        }).then(success, error, progress);

      }

      function success(response){
        if(response){
          // set uploaded
          file.uploaded = true;
          // loop it, but its length will always be zero
          for(var i=0;i<response.data.data.photos.length;i++){
            // update myPhotos
            console.log("pushing to photos: ",response.data.data.photos[i]);
            // save photo in photoFactotry
            photosFactory.addPhotoToLocal(response.data.data.photos[i]);
          }

          if(callback){
            callback(true, file);
          }

        }
      }

      function error(response){
        console.log("UPLOAD ERROR: ", response);
        alertFactory.error(null, "Unable to upload this photo, select a different photo");
        // set uploaded and inProgress to false
        file.uploaded = false;
        file.inProgress = false;
        file.progress = 0;
        file.error = true;
        file.errMessage = "Unable to upload this photo, select a different photo";

        if(callback){
          callback(false, file);
        }

      }

      function progress(evt){
        // set progress for the upload bar
        file.progress = parseInt(100.0 * evt.loaded / evt.total).toString() + "%";
      }

    }

  }
}());
