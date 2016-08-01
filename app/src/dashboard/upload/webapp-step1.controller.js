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
  function webappStep1Ctrl(API_URL, r_photos, $timeout, $localStorage, Upload, pttFBFactory, pttInstagram, authFactory, userFactory, photosFactory, uploadSliderConfig, alertFactory){

    console.log("CONTROLLER STEP 1");

    var vm = this;

    /*
     * Debug mode
     * */
    vm.debug = false;

    /*
     * Variables
     * */
    vm.myPhotos = r_photos['photos'];
    vm.myPhotosTotalCount = r_photos.totalCount;
      var step2Slider;
    vm.slider = {
      photosInCurrentFrame: 8,
      indexOfLastPhotoInCurrentFrame: 8,
      showUploadImage: true                 // only show it when all user images are fetched
    };
    vm.myPhotosPagination = {
      from: 0,
      size: 12,
      dimension: '100x100'
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
    // files to upload
    vm.showAllUploadButton = true;
    vm.filesToUpload = [];              // Stack
    vm.uploadQueue = new Queue();       // Queue
    vm.uploadInProgress = false;
    vm.showAlbumOrPhotos = true;
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
      vm.deletePhoto=deletePhoto;
    //vm.manipulateDOM = manipulateDOM;
    vm.socialDisconnect = socialDisconnect;


    /*
     * Define Functions
     * */

    function init(){
      console.log(vm.showAlbumOrPhotos);
      console.log(vm.uploadCategory);
      manipulateDOM();
      loadMoreMyPhotos();
      if(location.href.indexOf('?platform=')!=-1){
        var platformInUrl = location.href.indexOf('?platform=');
        var offset = 10;
        changeUploadCategory(location.href.substr(platformInUrl+offset));
      }
    }

    // changing upload category
    function changeUploadCategory(uploadCategory){
      vm.uploadCategory = uploadCategory;
      // hide albums and photos at first
      vm.showAlbumOrPhotos = false;
      // update file upload count
      vm.filesUploadedCount = 0;
      // empty all data
      vm.filesToUpload = [];
      // update url
      updateHref();
      // all login to false
      vm.fbLogin = false;
      vm.instagramLogin = false;
      vm.flickrLogin = false;
      vm.googleLogin = false;
      // switch
      switch(uploadCategory){
        case 'device':
          vm.showAlbumOrPhotos = true;
          break;
        case 'facebook':
          // check fb present
          if(userFactory.activeSocialProfiles().indexOf(uploadCategory)>=0){
            // already linked fb account
            vm.fbLogin = true;
            // get albums
            getFBAlbums();
          }
          break;
        case 'instagram':
          // check fb present
          if(userFactory.activeSocialProfiles().indexOf(uploadCategory)>=0){
            // already linked instagram account
            vm.instagramLogin = true;
            // get instagram photos
            getInstagramPhotos();
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
      authFactory.socialAuthenticate(platform)
        .then(function(resp) {
          if (resp) {
            // linked social account
            changeUploadCategory(platform);
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
                break;
              case 'google':
                vm.googleLogin = false;
                break;
              case 'flickr':
                vm.flickrLogin = false;
                break;
            }
          }
      });
    }


    /************************************* FACEBOOK *************************************/

    // get facebook albums
    function getFBAlbums(cursor){
      pttFBFactory.getAlbums(cursor)
        .then(function(resp){
          resp.forEach(function(elem, index){
            vm.fb.albums.push(elem);
          });
          //vm.fb.albums = resp;
        })
    }

    // selecting a facebook album
    function chooseAlbum(index, getNext){
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
          bindLoadMoreSocialPhotosScroll();
        })
    }

    /************************************* INSTAGRAM *************************************/

    // get instagram photos
    function getInstagramPhotos(getNext){
      vm.showAlbumOrPhotos = true;
      var nextCursor = null;
      // if getNext is true, pass the paging cursor
      if(getNext && vm.instagram.photos.pagination.next_url){
        nextCursor = vm.instagram.photos.pagination.next_url;
        console.log("next photos paging: ", vm.instagram.photos.pagination.next_url);
      }
      else if(vm.instagram.photos.pagination && !('next_url' in vm.instagram.photos.pagination)){
        console.log("no next image");
        return;
      }
      pttInstagram.getPhotos(nextCursor)
        .then(function(resp){
          console.log(resp);
          resp.data.forEach(function(elem, index){
            vm.filesToUpload.push(elem);
          });
          vm.instagram.photos.pagination = resp.pagination;
          if(resp.data.length>1){
            vm.showAllUploadButton = true;
          }
          bindLoadMoreSocialPhotosScroll();
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

    //delete selected photo
      function deletePhoto(id, index){
          photosFactory.deletePhoto(id).then(function(response){
              if(response.success){
                  vm.myPhotos.splice(index, 1);
                  alertFactory.success("Success!", "Photo deleted.");
              }
          });
      };

      // upload single file from queue
    function uploadFile(){

      var file;
      // see if queue is not empty
      if(!vm.uploadQueue.isEmpty()){
        // get the first element in queue
        file = vm.uploadQueue.peek();
      }

      // uploading files
      console.log("uploading file from Queue: ",file);
      // added here only for progress :/
      if (file) {
        // set url on the basis of uploadCategory
        var url;
        switch(vm.uploadCategory){
          case 'device':
            url = API_URL+'/photos/upload/device';
            break;
          case 'facebook':
            url = API_URL+'/photos/upload/social';
            break;
        }
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
            // go to last item in slider
            console.log('vm.myPhotos.length: ',vm.myPhotos.length);
            console.log("step2Slider.getTotalSlideCount(): ", step2Slider.getTotalSlideCount());
            //step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);
            //step2Slider.refresh();
            //step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);
            setupSlider();
            sliderFrameCount();
            step2Slider.goToSlide(step2Slider.getTotalSlideCount() - vm.slider.photosInCurrentFrame + 1);
            //vm.slider.indexOfLastPhotoInCurrentFrame = vm.myPhotos.length-1;
            //vm.myPhotosTotalCount++;
            //$(window).trigger('resize');
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

    function bindLoadMoreSocialPhotosScroll(){
      var uploadImagesDiv = angular.element('div.uploaded-images');
      //console.log(uploadImagesDiv);
      uploadImagesDiv.off('scroll');
      uploadImagesDiv.scroll(function(){
        var offset = 50;
        var uploadImagesDivHeight = uploadImagesDiv.height();
        var scrollBottom = uploadImagesDiv.scrollTop() + uploadImagesDivHeight;
        var uploadImageDivScrollHeight = uploadImagesDiv[0].scrollHeight;
        //console.log("scrollBottom: ",Math.floor(scrollBottom));
        //console.log("uploadImagesDiv height: ",uploadImagesDivHeight);
        //console.log("uploadImagesDiv scrollHeight: ",uploadImageDivScrollHeight );
        if(scrollBottom == uploadImageDivScrollHeight){
          console.log("fetching more images");
          switch(vm.uploadCategory){
            case 'facebook':
              chooseAlbum(vm.fb.currentAlbumIndex, true);
              break;
            case 'instagram':
              getInstagramPhotos(true);
              break;
          }
        }
      });
    }

    function bindLoadMoreFBAlbumsScroll(){
      var uploadImagesDiv = angular.element('div.fb-albums');
      console.log(uploadImagesDiv);
      uploadImagesDiv.off('scroll');
      uploadImagesDiv.scroll(function(){
        var offset = 50;
        var uploadImagesDivHeight = uploadImagesDiv.height();
        var scrollBottom = uploadImagesDiv.scrollTop() + uploadImagesDivHeight;
        var uploadImageDivScrollHeight = uploadImagesDiv[0].scrollHeight;
        console.log("scrollBottom: ",Math.floor(scrollBottom));
        console.log("uploadImagesDiv height: ",uploadImagesDivHeight);
        console.log("uploadImagesDiv scrollHeight: ",uploadImageDivScrollHeight );
        if(scrollBottom == uploadImageDivScrollHeight){
          console.log("fetching more albums");
          getFBAlbums('next');
        }
      });
    }

    /************************************* MANIPULATE DOM *************************************/
    function manipulateDOM(){

      $(document).ready(function() {

        $timeout(function(){
          angular.element('[data-toggle="tooltip"]').tooltip();

          bindLoadMoreFBAlbumsScroll();

          setupSlider();

          sliderFrameCount();

          $(window).resize(function(){
            sliderFrameCount();
          })

        }, 200);

      });

    }

    /************************************* MY PHOTOS SLIDER *************************************/

    function setupSlider(){
      console.log("RUNNING SLIDER SETUP");
      step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);

      $('.custom-svg-icon.left-arrow').off('click');
      $('.custom-svg-icon.right-arrow').off('click');

      $('.custom-svg-icon.left-arrow').click(function(){
        if(vm.slider.indexOfLastPhotoInCurrentFrame >= vm.slider.photosInCurrentFrame){
          vm.slider.indexOfLastPhotoInCurrentFrame--;
          step2Slider.goToPrevSlide();
        }
        console.log("left arrow");
        console.log("vm.slider: ",vm.slider);
        console.log("step2Slider.getCurrentSlideCount(): ", step2Slider.getCurrentSlideCount());
        console.log("vm.slider.indexOfLastPhotoInCurrentFrame: ", vm.slider.indexOfLastPhotoInCurrentFrame);
        console.log("vm.slider.photosInCurrentFrame: ", vm.slider.photosInCurrentFrame);
      });

      $('.custom-svg-icon.right-arrow').click(function(){
        if(vm.slider.indexOfLastPhotoInCurrentFrame <= vm.myPhotos.length){
          vm.slider.indexOfLastPhotoInCurrentFrame++;
          step2Slider.goToNextSlide();
        }
        console.log("right arrow");
        console.log("vm.slider: ",vm.slider);
        console.log("step2Slider.getCurrentSlideCount(): ", step2Slider.getCurrentSlideCount());
        console.log("vm.slider.indexOfLastPhotoInCurrentFrame: ", vm.slider.indexOfLastPhotoInCurrentFrame);
        console.log("vm.slider.photosInCurrentFrame: ", vm.slider.photosInCurrentFrame);
      });
    }

    function sliderFrameCount(){
      var currentWidth = $('body').css('width').replace('px', '');
      var photosRemovedFromCF = 0;
      for(var i=uploadSliderConfig.responsive.length-1;i>=0;i--){
        var elem = uploadSliderConfig.responsive[i];
        photosRemovedFromCF++;
        if(elem.breakpoint > currentWidth){
          if(vm.slider.photosInCurrentFrame != elem.settings.item){
            var prevIndex = vm.slider.indexOfLastPhotoInCurrentFrame;
            // TODO need fix
            console.log("changing slider data");
            console.log("currentWidth: ",currentWidth);
            console.log("elem.breakpoint: ",elem.breakpoint);
            console.log("elem.settings: ",elem.settings);
            vm.slider.photosInCurrentFrame = vm.slider.indexOfLastPhotoInCurrentFrame = elem.settings.item;
            console.log("prevIndex: ", prevIndex);
            console.log("photosInCurrentFrame: ",vm.slider.photosInCurrentFrame);
            var diffOfPhotosInBreakpoints = prevIndex-vm.slider.photosInCurrentFrame;
            console.log("diffOfPhotosInBreakpoints: ",diffOfPhotosInBreakpoints);
            //vm.slider.indexOfLastPhotoInCurrentFrame += ((diff>0)?(diff+ photosRemovedFromCF):(photosRemovedFromCF));
          }
          break;
        }
      }
    }

    function loadMoreMyPhotos(){
        if(vm.myPhotosTotalCount > vm.myPhotos.length){
          // load new photos
          vm.myPhotosPagination.from += 12;
          photosFactory.getPhotos(vm.myPhotosPagination)
            .then(function(resp){
              console.log("new photos length: ", resp.photos.length);
              resp['photos'].forEach(function(elem, index){
                vm.myPhotos.push(elem);
              });
              if(vm.myPhotosTotalCount >= vm.myPhotos.length){
                console.log("all photos are loaded");
                //step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);
                setupSlider();
                step2Slider.goToSlide(vm.slider.indexOfLastPhotoInCurrentFrame-vm.slider.photosInCurrentFrame);
                //step2Slider.goToSlide(vm.myPhotos.length);
              }
              else{
                //step2Slider.refresh();
                // stupid jquery slider needs reload
                //step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);
                //step2Slider.goToSlide(vm.slider.indexOfLastPhotoInCurrentFrame-vm.slider.photosInCurrentFrame);
                // call it self
                loadMoreMyPhotos();
              }
            })
        }

    }


    /*
     * Call Constructor
     * */
    vm.init();

  }

}());
