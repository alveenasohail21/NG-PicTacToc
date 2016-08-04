/**
 * @ngdoc controller
 * @name app.welcome.controller:Welcome
 * @description Welcome controller which typically is useless and you are going to delete it
 */

(function(){

  'use strict';

  angular.module('app.dashboard')
    .controller('webappStep2Ctrl', webappStep2Ctrl);

  /* @ngInject */
  function webappStep2Ctrl(photosFactory, cropperFactory, $rootScope, $state){

    var vm = this;

    /* Variables */
    vm.myPhotos = photosFactory._data.photos;
    vm.myPhotosTotalCount = photosFactory._data.totalCount;

    vm.myPhotosPagination = {
      from: 0,
      size: 12,
      dimension: '100x100'
    };
    vm.activeSidemenuItem = '';

    vm.selectedPhoto = {
      thumbnail: null,
      original: null,
      filter: null
    };

    // zoom slider
    var zoomSlider;

    /* Function Assignment */
    vm.toggleSidemenu = toggleSidemenu;
    vm.closeSidemenu = closeSidemenu;
    vm.toggleExpandView = toggleExpandView;
    vm.getSelectPhoto=getSelectPhoto;
    vm.sendEditedImage=sendEditedImage;
    //Toolbar methods
    vm.flipHorizontal=flipHorizontal;
    vm.flipVertical=flipVertical;
    vm.rotateClockwise=rotateClockwise;
    vm.rotateAntiClockwise=rotateAntiClockwise;
    vm.reset=reset;
    //Expand view methods
    vm.deletePhoto = deletePhoto;
    vm.copyPhoto = copyPhoto;
    // filter
    vm.applyFilter = applyFilter;

    /* Initializer */
    function init(){
      // Load more my photos
      loadMoreMyPhotos();

      // Tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      // Slider With JQuery
      zoomSlider = $("#ex4").slider({
        reversed : true
      });
      zoomSlider.on('slide', function(data) {
        cropperFactory.zoom(data.value);
      });

      /* Action Icon 3 DropMenu */
      $('.action-icons-3 .ptt-dropmenu').on('show.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px 50px 30px 30px');
      });

      $('.action-icons-3 .ptt-dropmenu').on('hidden.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px');
      });

      $(document).ready(function(){
        // Pre cache sticker images test
        preCacheHeros();
        // update image studio .element css
        updateImageEditorSize(null, true);
      });

    }

    function toggleSidemenu(template){
      // if opening
      if(!$("#ptt-wrapper-2").hasClass("toggled")){
        console.log("opening");
        vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
        vm.activeSidemenuItem = template;
        $("#ptt-wrapper-2").toggleClass("toggled");
        $rootScope.$emit('sidemenuOpens', {type: template});
      }
      // else if closing
      else{
        if(vm.activeSidemenuItem != template) {
          vm.activeSidemenuItem = template;
          vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
        }
        else{
          console.log("closing");
          vm.activeSidemenuItem = '';
          $("#ptt-wrapper-2").toggleClass("toggled");
        }
      }
    }

    function closeSidemenu(){
      if($("#ptt-wrapper-2").hasClass("toggled")){
        $rootScope.$emit('sidemenuCloses', {type: vm.activeSidemenuItem});
        $("#ptt-wrapper-2").removeClass("toggled");
        $('div#image-studio').css({
          'padding': '2.65% 0'
        });
      }
    }

    function preCacheHeros(){

      var stickerArray = ['images/sidemenu/stickers/2.png', 'images/sidemenu/stickers/3.png', 'images/sidemenu/stickers/5.png',
        'images/sidemenu/stickers/4.png', 'images/sidemenu/stickers/1.png', 'images/sidemenu/stickers/6.png'];
      $.each(stickerArray, function(){
        var img = new Image();
        img.src = this;
      });
    }

    function toggleExpandView(){

      if($('.step2b').hasClass('top-80px')){
        $('.step2-main').removeClass('opacity-0');
        $('.step2b').removeClass('top-80px');
      }
      else{
        $('.step2-main').addClass('opacity-0');
        $('.step2b').addClass('top-80px');
      }
    }

    // resize event
    $(window).resize(updateImageEditorSize);

    function updateImageEditorSize(event, runningFirstTime){
      //console.log("resizing :)");
      var imageStudio = {
        height: $("#image-studio").height(),
        width: $("#image-studio").width()
      };
      var element = {
        original:{
          height: 459,
          width: 459
        },
        current:{
          height: $("#image-studio .element").height(),
          width: $("#image-studio .element").width()
        }
      };
      var updateValue = 0;
      var firstTimeDifference = 17;
      //console.log("#image-studio height: ", imageStudio.height);
      //console.log("#image-studio width: ", imageStudio.width);
      //console.log("#image-studio .element current height: ", element.current.height);
      //console.log("#image-studio .element current width: ", element.current.width);

      // Formula for aspect ratio equality calculation
      // (original height / original width) = (new height / new width)

      // if image studio height is small
      if(imageStudio.height < imageStudio.width){
        // new width = (new height)/(original height / original width)
        updateValue = (imageStudio.height)/(element.original.height/element.original.width);
        //if(runningFirstTime != undefined){
        //  console.log("running first time: ",runningFirstTime);
        //  updateValue = Number(updateValue + firstTimeDifference);
        //}
        //console.log("height is small");
      }
      // else if image studio width is small
      else if(imageStudio.width < imageStudio.height){
        // new height = (original height / original width) x (new width)
        updateValue = (element.original.height/element.original.width) * (imageStudio.width);
        //console.log("width is small");
      }

      // update css
      //console.log("change height and width to: ", updateValue);
      $("#image-studio .element").width(updateValue);
      $("#image-studio .element").height(updateValue);
      $("#image-studio .element").css({
        'margin-left': '-' + Number((updateValue/2)+33) + 'px',
        'left': '50%'
      });

    }

    /************************************* MANIPULATE DOM *************************************/
    function manipulateDOM(){

    }


    /************************************* MY PHOTOS SLIDER *************************************/

    // load new photos
    function loadMoreMyPhotos(){
      if(vm.myPhotosTotalCount > vm.myPhotos.length) {
        vm.myPhotosPagination.from += 12;
        photosFactory.getPhotos(vm.myPhotosPagination)
          .then(function (resp) {
            console.log("new photos length: ", resp.photos.length);
            resp['photos'].forEach(function (elem, index) {
              vm.myPhotos.push(elem);
            });
            if (vm.myPhotosTotalCount > vm.myPhotos.length) {
              // call it self
              loadMoreMyPhotos();
            }
            else {
              console.log("all photos are loaded");
            }
          });
      }
    }

    // get the high res image for editing
    function getSelectPhoto(id, index){
      vm.readyToDisplay = false;
      // if its not an img, then its canvas
      if(!$('#canvas-image').is('img')){
        // this will hide the canvas, and show a new canvas instead : its all angular baby :P
        vm.selectedPhoto.filter = false;
        // destroy the cropper on canvas
        cropperFactory.destroy();
        // remove the hidden canvas (2nd canvas)
        $('#canvas-image:nth-child(2)').remove();
      }
      // close sidemenu if open
      vm.closeSidemenu();
      // get photo now
      photosFactory.getSelectedPhoto(id).then(function(resp){
        vm.selectedPhoto = {
          thumbnail: vm.myPhotos[index],
          original: resp
        };
        setTimeout(function(){
          cropperFactory.destroy();
          cropperFactory.initiateCrop('#selected-image');
          vm.readyToDisplay = true;
        }, 200);
      });
    }

    //send edited image to the server
    function sendEditedImage(){
      if(vm.selectedPhoto){
        var configs = cropperFactory.getImageDetails();
        if(vm.selectedPhoto.filter!=false && vm.selectedPhoto.filter!='normal'){
          configs.filteredImage = vm.selectedPhoto.filteredImage;
        }
        $state.go($rootScope.app.productState + '.Checkout', {id: vm.selectedPhoto.original.id, configs: configs});
      }
    }


    /************************************* CROPPER *************************************/
    function flipHorizontal(){
      cropperFactory.flipHorizontal();
    }

    function flipVertical(){
      cropperFactory.flipVertical();
    }

    function rotateClockwise(){
      cropperFactory.rotateClockwise();
    }

    function rotateAntiClockwise(){
      cropperFactory.rotateAntiClockwise();
    }

    function reset(){
      cropperFactory.reset();
    }

    /************************************* EXPAND VIEW *************************************/

    //delete photo
    function deletePhoto(id, index){
      photosFactory.deletePhoto(id, index);
    }

    //copy photo
    function copyPhoto(id, index){
      photosFactory.copyPhoto(id, index);
    }

    /************************************* FILTERS *************************************/

    // apply filter
    function applyFilter(filter){
      vm.readyToDisplay = false;
      console.log("FILTER TO APPLY: ", filter);
      // if its not an img, then its canvas
      if(!$('#canvas-image').is('img')){
        // this will hide the canvas, and show a new canvas instead : its all angular baby :P
        vm.selectedPhoto.filter = false;
        // destroy the cropper on canvas
        cropperFactory.destroy();
        // remove the hidden canvas (2nd canvas)
        $('#canvas-image:nth-child(1)').remove();
        if(filter=='normal') {
          $('#canvas-image:nth-child(2)').remove();
          cropperFactory.destroy();
          cropperFactory.initiateCrop('#selected-image');
          vm.readyToDisplay = true;
          return;
        }
      }
      // add new filter
      vm.selectedPhoto.filter = filter;
      // apply filter to hidden filter-image
      Caman('.step2-main #canvas-image', function () {
        //var that = this;
        this.revert(true);
        this[filter]();
        this.render(function(){
          // destroy cropper and set it for filtered image
          vm.selectedPhoto.filteredImage = this.toBase64();
          cropperFactory.destroy();
          cropperFactory.initiateCrop('#canvas-image');
          vm.readyToDisplay = true;
        });
      });
    }

    /* Initializer Call */
    init();
  }

}());
