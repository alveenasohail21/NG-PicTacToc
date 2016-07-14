/**
 * @ngdoc controller
 * @name app.welcome.controller:Welcome
 * @description Welcome controller which typically is useless and you are going to delete it
 */

(function(){

  'use strict';

  angular.module('app.dashboard')
    .controller('webappStep1Ctrl', webappStep1Ctrl);

  /* @ngInject */
  function webappStep1Ctrl(API_URL, r_photos, $timeout, $localStorage, Upload, pttFBFactory, authFactory, userFactory, $location){

    var vm = this;

    /*
     * Debug mode
     * */
    vm.debug = false;

    /*
     * Variables
     * */
    vm.myPhotos = r_photos;
    vm.uploadCategory = 'device';
    // fb login confirm
    vm.fbLogin = false;
    // fb data
    vm.fb = {
      albums: [],
      currentAlbumIndex: ''
    };
    // files to upload
    vm.showAllUploadButton = true;
    vm.filesToUpload = [];              // Stack
    vm.uploadQueue = new Queue();       // Queue
    vm.uploadInProgress = false;
    vm.showAlbumImages = true;
    // uploaded files count for single category
    vm.filesUploadedCount = 0;

    /*
     * Functions
     * */
    vm.init = init;
    vm.changeUploadCategory = changeUploadCategory;
    vm.socialLogin = socialLogin;
    vm.chooseAlbum = chooseAlbum;
    vm.selectFiles = selectFiles;
    vm.addFilesToUploadQueue = addFilesToUploadQueue;
    vm.uploadFile = uploadFile;
    //vm.manipulateDOM = manipulateDOM;


    /*
     * Define Functions
     * */

    function init(){
      console.log(vm.showAlbumImages);
      console.log(vm.uploadCategory);
      manipulateDOM();
      if(location.href.indexOf('?platform=')!=-1){
        var platformInUrl = location.href.indexOf('?platform=');
        var offset = 10;
        changeUploadCategory(location.href.substr(platformInUrl+offset));
      }
    }

    // changing upload category
    function changeUploadCategory(uploadCategory){
      vm.uploadCategory = uploadCategory;
      vm.showAlbumImages = false;
      vm.filesUploadedCount = 0;
      // empty all data
      vm.filesToUpload = [];
      // update url
      updateHref();
      // switch
      switch(uploadCategory){
        case 'device':
          vm.showAlbumImages = true;
          break;
        case 'facebook':
          // check fb present
          if(userFactory.activeSocialProfiles().indexOf('facebook')>=0){
            // already linked fb account
            vm.fbLogin = true;
            // get albums
            getFBAlbums();
          }
      }
    }

    // update href
    function updateHref(){
      var currentHref = location.href.substr(0, (location.href.indexOf('?')!=-1)?location.href.indexOf('?'):location.href.length);
      currentHref+="?platform="+vm.uploadCategory;
      location.href=currentHref;
    }

    // social login
    function socialLogin(platform){
      authFactory.socialAuthenticate(platform)
        .then(function(resp) {
          if (resp) {
            // linked social account
            changeUploadCategory(platform);
          }
        });
    }


    /************************************* FACEBOOK *************************************/

    // get facebook albums
    function getFBAlbums(){
      pttFBFactory.getAlbums()
        .then(function(resp){
          vm.fb.albums = resp;
        })
    }

    // selecting a facebook album
    function chooseAlbum(index, getNext){
      vm.showAlbumImages = true;
      vm.fb.currentAlbumIndex = index;
      var nextCursor = null;
      // if getNext is true, pass the paging cursor
      if(getNext && vm.fb.albums.photosPagination.next){
        nextCursor = vm.fb.albums.photosPagination.next;
        console.log("next photos paging: ", vm.fb.albums.photosPagination.next);
      }
      else if(vm.fb.albums.photosPagination && !('next' in vm.fb.albums.photosPagination)){
        console.log("no next image");
        return;
      }
      pttFBFactory.getAlbumPhotos(vm.fb.albums[index].id, index, nextCursor)
        .then(function(resp){
          // resp = { data: [], paging:{} }
          console.log(resp);
          resp.data.forEach(function(elem, index){
            vm.filesToUpload.push(elem);
          });
          vm.fb.albums.photosPagination = resp.paging;
          if(resp.data.length>1){
            vm.showAllUploadButton = true;
          }
          manipulateDOM();
        })
    }


    /************************************* FILE UPLOADING STUFF *************************************/

    // Select files and add to local variable
    function selectFiles(files) {
      if(files.length>0){

        // first update category
        if(vm.uploadCategory!='device'){
          changeUploadCategory('device');
        }

        for(var i=0;i<files.length;i++){
          vm.filesToUpload.push(files[i]);
        }
        if(files.length>1 || vm.filesToUpload.length-1>vm.filesUploadedCount){
          console.log("> 1");
          vm.showAllUploadButton = true;
        }
      }
    }

    // add files to upload queue
    function addFilesToUploadQueue(index){
      // if single file
      if(index>=0 && !vm.filesToUpload[index].inProgress && !vm.filesToUpload[index].uploaded){
        vm.filesToUpload[index].inProgress = true;
        vm.filesToUpload[index].position = index;
        // push to queue
        vm.uploadQueue.enqueue(vm.filesToUpload[index]);
        console.log("added file to queue: ",vm.filesToUpload[index]);
      }
      // if all files
      else{
        vm.showAllUploadButton = false;
        // set inprogress for the upload bar
        for(var k=0;k<vm.filesToUpload.length;k++){
          // if file is not uploaded yet
          if(!vm.filesToUpload[k].uploaded && !vm.filesToUpload[k].inProgress){
            vm.filesToUpload[k].inProgress = true;
            vm.filesToUpload[k].position = k;
            // push to queue
            vm.uploadQueue.enqueue(vm.filesToUpload[k]);
            console.log("added file to queue: ",vm.filesToUpload[k]);
          }
        }
      }
      // initiate the transfer
      if(vm.uploadInProgress){
        // already initiated
        console.log("upload already in progress");
      }
      else{
        // initiating the transfer
        console.log("starting the upload");
        vm.uploadInProgress = true;
        vm.uploadFile();
      }
    }


    // upload single file from queue
    function uploadFile(){

      var file, url;
      // see if queue is not empty
      if(!vm.uploadQueue.isEmpty()){
        // get the first element in queue
        file = vm.uploadQueue.peek();
      }
      // set url on the basis of uploadCategory
      switch(vm.uploadCategory){
        case 'device':
          url = API_URL+'/photos/upload/device';
          break;
        case 'facebook':
          url = API_URL+'/photos/upload/social';
          break;
      }

      // uploading files
      console.log("uploading file from Queue: ",file);
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
            'token': 'Bearer {'+ $localStorage.token +'}'
          }
        }).then(function (response) {
          if(response){
            // set uploaded
            vm.filesToUpload[file.position].uploaded = true;
            // update uploaded file count for a single category
            vm.filesUploadedCount++;
            // loop it, but its length will always be zero
            for(var i=0;i<response.data.data.photos.length;i++){
              // update myPhotos
              vm.myPhotos.push(response.data.data.photos[i]);
            }
            // remove from queue
            vm.uploadQueue.dequeue();
            // showAllUploadButton
            if(vm.filesToUpload.length-1 <= vm.filesUploadedCount){
              vm.showAllUploadButton = false;
              console.log("< 1");
            }
            else{
              console.log("> 1");
              vm.showAllUploadButton = true;
            }
            // see if queue is not empty, call it self
            if(!vm.uploadQueue.isEmpty()){
              vm.uploadFile();
            }
            else{
              vm.uploadInProgress = false;
            }
          }
        }, function (response) {
          console.log(response);
          if (response.status > 0) {
            vm.errorMsg = response.status + ': ' + response.data;
          }
        }, function (evt) {
          // set progress for the upload bar
          vm.filesToUpload[file.position].progress = parseInt(100.0 * evt.loaded / evt.total).toString() + "%";
        });
      }

    }

    /************************************* MANIPULATE DOM *************************************/
    function manipulateDOM(){
      var uploadImagesDiv = angular.element('div.uploaded-images');
      console.log(uploadImagesDiv);
      uploadImagesDiv.off('scroll');
      uploadImagesDiv.scroll(function(){
        var offset = 50;
        var uploadImagesDivHeight = uploadImagesDiv.height();
        var scrollBottom = uploadImagesDiv.scrollTop() + uploadImagesDivHeight;
        var uploadImageDivScrollHeight = uploadImagesDiv[0].scrollHeight;
        //var elementHeight = angular.element('.results')[0].scrollHeight;
        console.log("scrollBottom: ",Math.floor(scrollBottom));
        console.log("uploadImagesDiv height: ",uploadImagesDivHeight);
        console.log("uploadImagesDiv scrollHeight: ",uploadImageDivScrollHeight );
        if(scrollBottom == uploadImageDivScrollHeight){
          console.log("fetching more images");
          chooseAlbum(vm.fb.currentAlbumIndex, true);
        }
        //console.log("elemHeight: ",Math.floor(elementHeight));
        //if((Math.floor(scrollBottom) >= Math.floor(elementHeight)-5 && Math.floor(scrollBottom) <= Math.floor(elementHeight)+5)){
        //console.log("mdom");
        //loading = true;
        //vm.loadMorePhotos();
        //}
      });
      angular.element('[data-toggle="tooltip"]').tooltip();
    }


    /*
     * Call Constructor
     * */
    vm.init();

  }

}());
