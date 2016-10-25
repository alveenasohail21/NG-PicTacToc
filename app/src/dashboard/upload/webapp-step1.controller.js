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
  function webappStep1Ctrl($timeout, pttFBFactory, pttInstagram, pttGoogleFactory, authFactory, userFactory, photosFactory, $rootScope, uploadFactory, alertFactory, $state){

    var vm = this;

    /*
     * Debug mode
     * */
    vm.debug = false;

    /*
     * Variables
     * */

    // console.log("DATA FROM FACTORY: ", photosFactory._data.photos);
    vm.socialLoader = authFactory.socialLoader;
    vm.myPhotos = photosFactory._data.photos;
    vm.myPhotosTotalCount = photosFactory._data.totalCount;


    vm.myPhotosPagination = {
      from: 0,
      size: 6,
      dimension: '260x260'
    };
    vm.uploadCategory = 'device';
    // fb login confirm
    vm.fbLogin = false;
    // fb data
    vm.fb = {
      albums: [],
      currentAlbumIndex: ''
    };
    // instagram login confirm
    vm.instagramLogin = false;
    // instagram data
    vm.instagram = {
      photos: {
        pagination: null
      }
    };
    // google login confirm
    vm.googleLogin = false;
    // google data
    vm.google = {
      albums: [],
      currentAlbumIndex: ''
    };
    // files to upload
    uploadFactory.removeFiles('device');
    vm.filesToUpload = uploadFactory._data.deviceFiles;              // by default its device files
    // for device
    vm.showAllUploadButtonForDevice = true;
    vm.filesUploadedCountForDevice = 0;
    // for social
    vm.showAllUploadButtonForSocial = true;
    vm.filesUploadedCountForSocial = 0;
    //
    vm.noOfFilesUploading = 0;
    vm.showAlbumOrPhotos = true;

    // uploaded files count for single category

    // console.log('vm.filesToUpload: ',vm.filesToUpload);

    /*
     * Functions
     * */
    vm.init = init;
    vm.changeUploadCategory = changeUploadCategory;
    vm.socialLogin = socialLogin;
    vm.chooseAlbum = chooseAlbum;
    vm.chooseGoogleAlbum = chooseGoogleAlbum;
    vm.selectFiles = selectFiles;
    vm.addFilesToUploadQueue = addFilesToUploadQueue;
    vm.deletePhoto = deletePhoto;
    vm.socialDisconnect = socialDisconnect;
    vm.nextStep = nextStep;
    vm.abortUploading=abortUploading;


    /*
     * Define Functions
     * */

    function init(){
      // console.log(vm.showAlbumOrPhotos);
      // console.log(vm.uploadCategory);
      manipulateDOM();
      // loadMoreMyPhotos();
      if(location.href.indexOf('?platform=')!=-1){
        var platformInUrl = location.href.indexOf('?platform=');
        var offset = 10;
        changeUploadCategory(location.href.substr(platformInUrl+offset));
      }
    }

    // changing upload category
    function changeUploadCategory(uploadCategory,login){
      vm.uploadCategory = uploadCategory;
      // hide albums and photos at first
      vm.showAlbumOrPhotos = false;
      // update file upload count
      //vm.filesUploadedCount = 0;
      // empty all data - update-> don't discard upload files
      //vm.filesToUpload = [];
      // update url
      updateHref();
      // all login to false
      vm.fbLogin = false;
      vm.instagramLogin = false;
      vm.flickrLogin = false;
      vm.googleLogin = false;
      // clear all internal data of social factories
      $rootScope.$emit('uploadCategoryChange', {provider: uploadCategory});
      // switch
      switch(uploadCategory){
        case 'device':
          vm.showAlbumOrPhotos = true;
          vm.filesToUpload = uploadFactory._data.deviceFiles;
          break;
        case 'facebook':
          uploadFactory.removeFiles(uploadCategory);
          vm.filesToUpload = uploadFactory._data.socialFiles;
          vm.filesUploadedCountForSocial = 0;
          // clear controller's internal data
          vm.fb = {
            albums: [],
            currentAlbumIndex: ''
          };
          // check fb present
          if(userFactory.activeSocialProfiles().indexOf(uploadCategory)>=0){
            // already linked fb account
            vm.fbLogin = true;
            // get albums
            getFBAlbums();
          }
          break;
        case 'instagram':
          uploadFactory.removeFiles(uploadCategory);
          vm.filesToUpload = uploadFactory._data.socialFiles;
          vm.filesUploadedCountForSocial = 0;

          // clear controller's internal data
          vm.instagram = {
            photos: {
              pagination: null
            }
          };
          // check instagram present
          if(userFactory.activeSocialProfiles().indexOf(uploadCategory)>=0){
            // already linked instagram account
            vm.instagramLogin = true;
            // get instagram photos
            getInstagramPhotos();
          }
          break;
        case 'google':
          uploadFactory.removeFiles(uploadCategory);
          vm.filesToUpload = uploadFactory._data.socialFiles;
          vm.filesUploadedCountForSocial = 0;
          // clear controller's internal data
          vm.google = {
            albums: [],
            currentAlbumIndex: ''
          };
          // check google present
          if(userFactory.activeSocialProfiles().indexOf(uploadCategory)>=0){
            // already linked google account
            vm.googleLogin = true;
            // get google albums
            getGoogleAlbums(null,login);
          }
      }
    }



    // update href
    function updateHref(){
      var currentHref = location.href.substr(0, (location.href.indexOf('?')!=-1)?location.href.indexOf('?'):location.href.length);
      currentHref+="?platform="+vm.uploadCategory;
      location.href=currentHref;
    }

    /************************************* SOCIAL AUTH *************************************/

    // social login
    function socialLogin(platform){
      authFactory.loadLoader(platform);
      // console.log("at controller: ", vm.socialLoader);
      authFactory.socialAuthenticate(platform).then(function(resp) {
        if (resp) {
          // linked social account
          changeUploadCategory(platform,true);

        }
      });
    }


    //disconnect social login
    function socialDisconnect(platform){
      authFactory.socialDisconnect(platform)
        .then(function(resp){
          if(resp.success){
            vm.showAlbumOrPhotos = false;
            switch(platform){
              case 'facebook':
                vm.fbLogin = false;
                break;
              case 'instagram':
                vm.instagramLogin = false;
                vm.instagram = {
                  photos: {
                    pagination: null
                  }
                };
                break;
              case 'google':
                vm.googleLogin = false;
                break;
              case 'flickr':
                vm.flickrLogin = false;
                break;
            }
            $rootScope.$emit('socialDisconnect', {provider: platform});
          }
        });
    }

    /************************************* FACEBOOK *************************************/

    // get facebook albums
    function getFBAlbums(cursor){
      turnOnLoader();
      pttFBFactory.getAlbums(cursor)
        .then(function(resp){
          resp.forEach(function(elem, index){
            vm.fb.albums.push(elem);
            turnOffLoader();
          });
          //vm.fb.albums = resp;
        })
    }

    // selecting a facebook album
    function chooseAlbum(index, getNext) {
      vm.showAlbumOrPhotos = true;
      vm.fb.currentAlbumIndex = index;
      var nextCursor = null;
      // selecting a new album, remove pagination
      if(!getNext){
        vm.fb.albums.photosPagination = null;
      }
      // if getNext is true, pass the paging cursor
      if(getNext && vm.fb.albums.photosPagination.next){
        nextCursor = vm.fb.albums.photosPagination.next;
        // console.log("next photos paging: ", vm.fb.albums.photosPagination.next);
      }
      else if(vm.fb.albums.photosPagination && !('next' in vm.fb.albums.photosPagination)){
        // console.log("no next image");
        return;
      }
      pttFBFactory.getAlbumPhotos(vm.fb.albums[index].id, index, nextCursor)
        .then(function(resp){
          // resp = { data: [], paging:{} }
          // console.log(resp);
          resp.data.forEach(function(elem, index){
            //vm.filesToUpload.push(elem);
            uploadFactory.addFile(elem, vm.uploadCategory);
          });
          vm.fb.albums.photosPagination = resp.paging;
          if(resp.data.length>1){
            vm.showAllUploadButtonForSocial = true;
          }
          bindLoadMoreSocialPhotosScroll();
        })
    }

    /************************************* INSTAGRAM *************************************/

    // get instagram photos
    function getInstagramPhotos(getNext){
      turnOnLoader();
      vm.showAlbumOrPhotos = true;
      var nextCursor = null;
      console.log("show me next url: ", vm.instagram.photos.pagination);

      // if getNext is true, pass the paging cursor
      if(getNext && vm.instagram.photos.pagination.next_url){
        nextCursor = vm.instagram.photos.pagination.next_url;
        console.log("next photos paging: ", vm.instagram.photos.pagination.next_url);
      }
      else if(vm.instagram.photos.pagination && !('next_url' in vm.instagram.photos.pagination)){
        console.log("no next image");
        console.log("show me next url: ", vm.instagram.photos.pagination);
        return;
      }

      pttInstagram.getPhotos(nextCursor)
        .then(function(resp){
          // console.log(resp);
          console.log("INSTAGRAM PHOTOS");
          turnOffLoader();

          resp.data.forEach(function(elem, index){
            //vm.filesToUpload.push(elem);
            uploadFactory.addFile(elem, vm.uploadCategory);
          });
          vm.instagram.photos.pagination = resp.pagination;
          if(resp.data.length>1){
            vm.showAllUploadButtonForSocial = true;
          }
          bindLoadMoreSocialPhotosScroll();
        })
    }

    /************************************* GOOGLE *************************************/

    // get google albums
    function getGoogleAlbums(cursor,login){
      turnOnLoader();
      pttGoogleFactory.getAlbums(cursor,login)
        .then(function(resp){
          resp.feed.entry.forEach(function(elem, index){
            vm.google.albums.push(elem);
            console.log("GOOGLE PHOTOS");
            turnOffLoader();
          });
        },function (err) {
         socialDisconnect('google');
          alertFactory.error(null, "Your Session is Expired. Please login again");
        })
    }

    // selecting a google album
    function chooseGoogleAlbum(index, getNext){
      vm.showAlbumOrPhotos = true;
      vm.google.currentAlbumIndex = index;
      var nextCursor = null;
      // selecting a new album, remove pagination
      if(!getNext){
        vm.google.albums.photosPagination = null;
      }
      // if getNext is true, pass the paging cursor
      if(getNext && vm.google.albums.photosPagination.next){
        nextCursor = vm.google.albums.photosPagination.next;
      }
      else if(vm.google.albums.photosPagination && vm.google.albums.photosPagination.next == null){
        return;
      }
      pttGoogleFactory.getAlbumPhotos(vm.google.albums[index].gphoto$id.$t, index, nextCursor)
        .then(function(resp){
          resp.photos.forEach(function(elem, index){
            //vm.filesToUpload.push(elem);
            uploadFactory.addFile(elem, vm.uploadCategory);
          });
          if(vm.google.albums.photosPagination == null ){
            vm.google.albums.photosPagination = {};
          }
          vm.google.albums.photosPagination.next = resp.data.feed.link[resp.data.feed.link.length -1].rel == 'next' ? resp.data.feed.link[resp.data.feed.link.length -1].href : null ;
          if(resp.photos.length>1){
            vm.showAllUploadButtonForSocial = true;
          }
          bindLoadMoreSocialPhotosScroll();
        },function (err) {
          socialDisconnect('google');
          alertFactory.error(null, "Your Session has Expired. Please login again");
        });
    }

    /************************************* FILE UPLOADING STUFF *************************************/

    // Select files and add to local variable

    function checkFileErrors(invalidFiles){
      $.each(invalidFiles, function(index, value){
        switch (value.$error){
          case 'maxSize':
            alertFactory.error(null, "You can upload an image upto size "+ $rootScope.imageConstraints.maxSize);
            break;
        }
      });
    }


    function selectFiles(files, invalidFiles) {
      // // console.log(files, invalidFiles);

      checkFileErrors(invalidFiles);
      // return;

      // console.log(invalidFiles);
      if(files.length>0){
        // first update category
        if(vm.uploadCategory!='device'){
          changeUploadCategory('device');
        }
        for(var i=0;i<files.length;i++){
          uploadFactory.addFile(files[i], vm.uploadCategory);
          addFilesToUploadQueue(i);
        }
        if(files.length>1 || vm.filesToUpload.length-1>vm.filesUploadedCountForDevice){
          // console.log("> 1");
          vm.showAllUploadButtonForDevice = true;
        }
      }
    }

    // add files to upload queue
    function addFilesToUploadQueue(index){
      // if single file

      if(index>=0 && !vm.filesToUpload[index].inProgress && !vm.filesToUpload[index].uploaded){
        vm.filesToUpload[index].inProgress = true;
        vm.filesToUpload[index].position = index;
        vm.filesToUpload[index].category = vm.uploadCategory;
        vm.noOfFilesUploading++;
        console.log('vm.filesToUpload[index]',vm.filesToUpload[index]);
        //push to queue
        uploadFactory.uploadFile(index, vm.uploadCategory, function(success, file){
          vm.noOfFilesUploading--;
          if(success){
            callback(file);
          }
        });
        // console.log("added file to queue: ",vm.filesToUpload[index]);
      }
      // if all files
      else{
        vm.showAllUploadButton = false;
        // set inprogress for the upload bar
        for(var k=0;k<vm.filesToUpload.length;k++){
          (function(){
            // if file is not uploaded yet
            if(!vm.filesToUpload[k].uploaded && !vm.filesToUpload[k].inProgress){
              vm.filesToUpload[k].inProgress = true;
              vm.filesToUpload[k].position = k;
              vm.filesToUpload[k].category = vm.uploadCategory;
              vm.noOfFilesUploading++;
              // push to queue
              //vm.uploadQueue.enqueue(vm.filesToUpload[k]);
              uploadFactory.uploadFile(k, vm.uploadCategory, function(success, file){
                vm.noOfFilesUploading--;
                if(success){
                  callback(file);
                }
              });
              // console.log("added file to queue: ",vm.filesToUpload[k]);
            }
          }());
        }
      }

      function callback(file){
        if(file.category == 'device'){
          vm.filesUploadedCountForDevice++;
          // update showAllUploadButton
          if(vm.filesToUpload.length-1 <= vm.filesUploadedCountForDevice){
            vm.showAllUploadButtonForDevice = false;
            // console.log("< 1");
          }
          else{
            // console.log("> 1");
            vm.showAllUploadButtonForDevice = true;
          }
        }
        else{
          vm.filesUploadedCountForSocial++;
          // update showAllUploadButton
          if(vm.filesToUpload.length-1 <= vm.filesUploadedCountForSocial){
            vm.showAllUploadButtonForSocial = false;
            // console.log("< 1");
          }
          else{
            // console.log("> 1");
            vm.showAllUploadButtonForSocial= true;
          }
        }
      }

    }

    function bindLoadMoreSocialPhotosScroll(){
      var uploadImagesDiv = angular.element('div.uploaded-images');
      //// console.log(uploadImagesDiv);
      uploadImagesDiv.off('scroll');
      uploadImagesDiv.scroll(function(){
        var offset = 50;
        var uploadImagesDivHeight = uploadImagesDiv.height();
        var scrollBottom = uploadImagesDiv.scrollTop() + uploadImagesDivHeight;
        var uploadImageDivScrollHeight = uploadImagesDiv[0].scrollHeight;
        //// console.log("scrollBottom: ",Math.floor(scrollBottom));
        //// console.log("uploadImagesDiv height: ",uploadImagesDivHeight);
        //// console.log("uploadImagesDiv scrollHeight: ",uploadImageDivScrollHeight );
        if(scrollBottom >= uploadImageDivScrollHeight){
          // console.log("fetching more images");
          switch(vm.uploadCategory){
            case 'facebook':
              chooseAlbum(vm.fb.currentAlbumIndex, true);
              break;
            case 'instagram':
              getInstagramPhotos(true);
              break;
            case 'google':
              chooseGoogleAlbum(vm.google.currentAlbumIndex, true);
              break;
          }
        }
      });
    }

    function bindLoadMoreFBAlbumsScroll(){
      var uploadImagesDiv = angular.element('div.fb-albums');
      // console.log(uploadImagesDiv);
      uploadImagesDiv.off('scroll');
      uploadImagesDiv.scroll(function(){
        var offset = 50;
        var uploadImagesDivHeight = uploadImagesDiv.height();
        var scrollBottom = uploadImagesDiv.scrollTop() + uploadImagesDivHeight;
        var uploadImageDivScrollHeight = uploadImagesDiv[0].scrollHeight;
        if(scrollBottom == uploadImageDivScrollHeight){
          // console.log("fetching more albums");
          getFBAlbums('next');
        }
      });
    }

    //delete selected photo/product
    function deletePhoto(id){
      photosFactory.deleteProjectPhotoOrProduct(id);
    }

    /************************************* MANIPULATE DOM *************************************/

    function manipulateDOM(){
      $(document).ready(function() {
        $timeout(function(){
          angular.element('[data-toggle="tooltip"]').tooltip();
          bindLoadMoreFBAlbumsScroll();
        }, 200);
      });
    }

    /************************************* LOADER *************************************/

    function loadMoreMyPhotos(){
      if(vm.myPhotosTotalCount > vm.myPhotos.length){
        // console.log("******** Loading More Photos ********", vm.myPhotosTotalCount, vm.myPhotos.length);
        // load new photos
        vm.myPhotosPagination.from += 6;
        photosFactory.getPhotos(vm.myPhotosPagination)
          .then(function(resp){
            // console.log("new photos length: ", resp.photos.length);
            resp['photos'].forEach(function(elem, index){
              //vm.myPhotos.push(elem);
            });
            if(vm.myPhotosTotalCount >= vm.myPhotos.length){
              // console.log("all photos are loaded");
            }
            else{
              loadMoreMyPhotos();
            }
          })
      }

    }

    /***************/
    function nextStep(stateName){
      // console.log(stateName);
      if(vm.myPhotos.length<$rootScope.imageConstraints.minPhotoForProduct){
        alertFactory.warning(null, "You need to have at least "+$rootScope.imageConstraints.minPhotoForProduct+" photos in order to proceed");
      }
      else if(vm.noOfFilesUploading>0){
        alertFactory.warning(null, "Please wait for the upload to finish");
      }
      else{
        $state.go(stateName, {sku: $rootScope.sku});
      }
    }

    function abortUploading(index){
      uploadFactory.abortUploading(index, vm.uploadCategory);
    }
    function turnOffLoader(){
      $('#loader-social').css("opacity", "0");
      $('.user-description').css("display", "inline", "important");
    }
    function turnOnLoader(){
      $('#loader-social').css("opacity", "1");
      $('.user-description').css("display", "none", "important");
    }


    /*
     * Call Constructor
     * */
    vm.init();

  }

}());
