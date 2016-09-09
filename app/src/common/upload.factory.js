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

  function uploadFactory(API_URL, Upload, $localStorage, photosFactory, restFactory){

    var _data = {
      // device list
      deviceFiles: [],
      // social list
      socialFiles: []
    };
    var uploadObjects = [];
    // var canceler=[];
    /* Return Functions */
    return {
      getFiles: getFiles,
      addFile: addFile,
      removeFiles: removeFiles,
      removeFile: removeFile,
      uploadFile: uploadFile,
      abortUploading: abortUploading,
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
      // console.log("removing files from upload factory  ****************");
      if(category == 'device'){
        _data.deviceFiles = [];
      }
      else{
        _data.socialFiles = [];
      }
      // console.log("REMOVED FROM FACTORY", _data);
    }

    function removeFile(index){
      // console.log("removing file from upload factory  ****************");
      _data.splice(index, 1);
      // console.log("REMOVED FROM FACTORY", _data);
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
        case 'google' :
          url = API_URL + '/photos/upload/social';
          file = _data.socialFiles[index];
          break;
      }
      // uploading files
      // console.log("uploading file from upload Factory: ", _data.deviceFiles[index]);
      // added here only for progress :/
      if (file) {
        var upload = Upload.upload({
          method: 'POST',
          url: url,
          data: {
            files: [file]
          },
          // timeout: canceler[index].promise,
          headers: {
            'Content-Type': 'application/json',
            'token': 'Bearer {' + $localStorage.token + '}'
          }
        });
        // push into uploadObjects, in case user wants to cancel
        uploadObjects.push({
          photoIndex: index,
          uploadObj: upload
        });
        // callbacks
        upload.then(success, error, progress);
      }
      function success(response){
        //console.log("Uploaded");
        if(response){
          // if it was a social upload and file was canceled at upload time
          if(file.uploadCanceled){
            // delete the uploaded file
            restFactory.photos.deletePhoto(response.data.data.photos[0].id);
          }
          else{
            // set uploaded
            file.uploaded = true;
            // loop it, but its length will always be zero
            for(var i=0;i<response.data.data.photos.length;i++){
              // update myPhotos
              // console.log("pushing to photos: ",response.data.data.photos[i]);
              // save photo in photoFactotry
              photosFactory.addPhotoToLocal(response.data.data.photos[i]);
            }
            // if error message was generated earlier
            file.error = false;
            file.errMessage = "";
          }
          // callback
          if(callback){
            callback(true, file);
          }
        }
      }

      function error(response){
        //console.log("UPLOAD ERROR: ", response);
        //alertFactory.error(null, "Unable to upload this photo, select a different photo");
        // set uploaded and inProgress to false
        file.uploaded = false;
        file.inProgress = false;
        file.progress = 0;
        file.error = true;
        file.errMessage = "Unable to upload this photo";

        if(callback){
          callback(false, file);
        }

      }
      function progress(evt){
        // set progress for the upload bar
        file.progress = parseInt(100.0 * evt.loaded / evt.total).toString() + "%";
      }
    }

    function abortUploading(index, uploadCategory){
      //console.log(index, uploadCategory);
      //console.log(uploadObjects);

      // ** There is a 80% chance that the social image is already uploaded
      // ** because for social image we are passing urls not the whole image
      // ** so we need to delete that social image manually
      // ** but for device we can cancel/abort the upload

      // remove if device
      if(uploadCategory == 'device'){
        for(var i=0; i<uploadObjects.length; i++){
          if(uploadObjects[i].photoIndex == index){
            //console.log("Canceling",uploadObjects[i].uploadObj);
            // abort
            uploadObjects[i].uploadObj.abort();
            // remove the uploadObj as well
            uploadObjects.splice(i, 1);
            break;
          }
        }
        _data.deviceFiles.splice(index, 1);
      }
      // just set default flags and uploadCanceled flag
      else if(uploadCategory != 'device'){
        var file = _data.socialFiles[index];
        file.uploaded = false;
        file.inProgress = false;
        file.progress = 0;
        file.uploadCanceled = true;
      }
    }

  }
}());
