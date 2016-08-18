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
  function webappStep2Ctrl(photosFactory, cropperFactory, $rootScope, $state, mediaFactory){

    var vm = this;

    /* Variables */
    vm.myPhotos = photosFactory._data.photos;
    vm.myPhotosTotalCount = photosFactory._data.totalCount;

    vm.myPhotosPagination = {
      from: 0,
      size: 12,
      dimension: '260x260'
    };
    vm.activeSidemenuItem = null;

    vm.selectedPhoto = {
      thumbnail: null,
      original: null,
      filter: null
    };
    // canvas parent div
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
    // zoom slider
    var zoomSlider;
    var zoomSliderPrevValue = 0;
    // canvas
    //var canvas = document.getElementById('canvas');
    //var ctx = canvas.getContext('2d');
    // canvas image - Enable Cross Origin Image Editing
    var canvasImage = new Image();
    canvasImage.crossOrigin = '';
    // fabric canvas
    var fabricCanvas = new fabric.Canvas('canvas');
    fabricCanvas.renderOnAddRemove = false;
    // fabric objects setting
    var fabricObjSettings = {
      borderColor: 'white',
      borderDashArray: [5, 5],
      cornerColor: 'rgba(101,224,228,0.7)',
      //cornerColor: 'rgba(255,255,255,1)',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderOpacityWhenMoving: 0.6,
      hoverCursor: 'move',
      //cornerStrokeColor: 'white',
      transparentCorners: false,
      originX: 'center',
      originY: 'center'
    };
    var canvasBkgImg = {
      instance: null,
      active: false,
      id: null
    };
    var scallingFirstTime = true;
    var scaleFactor;
    var scaleConstant = 0.76;
    vm.readyToDisplay = true;
    // layout sections - default is no layout
    var layoutSectionsObj = [];


    /* Function Assignment */
    vm.toggleSidemenu = toggleSidemenu;
    vm.closeSidemenu = closeSidemenu;
    vm.toggleExpandView = toggleExpandView;
    vm.getSelectPhoto = getSelectPhoto;
    vm.sendEditedImage = sendEditedImage;
    // Toolbar methods
    vm.flipHorizontal = flipHorizontal;
    vm.flipVertical = flipVertical;
    vm.rotateClockwise = rotateClockwise;
    vm.rotateAntiClockwise = rotateAntiClockwise;
    vm.deleteSelectedObject = deleteSelectedObject;
    vm.copySelectedObject = copySelectedObject;
    //Expand view methods
    vm.deletePhoto = deletePhoto;
    vm.copyPhoto = copyPhoto;
    // filter
    vm.applyFilter = applyFilter;
    // sticker
    vm.applySticker = applySticker;
    // texts
    vm.applyText = applyText;
    // layouts
    vm.applyLayout = applyLayout;



    /* Initializer */
    function init(){
      // Load more my photos
      loadMoreMyPhotos();

      // Load original images of some photos
      photosFactory.loadOriginalImages();

      // Tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      // Slider With JQuery
      zoomSlider = $("#ex4").slider({
        reversed : true
      });
      //zoomSlider.on('slide', function(data) {
      //  if(data.value >= 1 && data.value <= 2){
      //    var point = new fabric.Point(fabricCanvas.getWidth()/2, fabricCanvas.getHeight()/2);
      //    if((data.value - zoomSliderPrevValue) > 0){
      //
      //    }
      //    else{
      //      data.value = data.value*-1;
      //    }
      //    zoomSliderPrevValue = data.value;
      //    fabricCanvas.zoomToPoint( point, data.value);
      //    console.log("fabricCanvas.getZoom(): ", fabricCanvas.getZoom());
      //    fabricCanvas.renderAll();
      //  }
      //});

      /* Action Icon 3 DropMenu */
      $('.action-icons-3 .ptt-dropmenu').on('show.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px 50px 30px 30px');
      });

      $('.action-icons-3 .ptt-dropmenu').on('hidden.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px');
      });

      $(document).ready(function(){
        // set fabric canvas
        fabricCanvas.setDimensions({
          width: element.original.width,
          height: element.original.height
        });
        fabricCanvas.selectionColor = 'rgba(101,224,228,0.5)';
        fabricCanvas.selectionBorderColor = 'white';
        fabricCanvas.selectionLineWidth = 1;
        fabricCanvas.renderAll();
        // bind fabricjs events
        bindEventsOnFabric();
        // update image studio .element css
        updateImageEditorSize(null, true);
      });

    }

    function toggleSidemenu(template){
      // if opening
      if(!$("#ptt-wrapper-2").hasClass("toggled")){
        console.log("opening");
        vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
        $rootScope.$emit('sidemenuToggles', {
          previousTemplate: vm.activeSidemenuItem,
          currentTemplate: template
        });
        vm.activeSidemenuItem = template;
        $("#ptt-wrapper-2").toggleClass("toggled");
      }
      else{
        // switch sidemenu
        if(vm.activeSidemenuItem != template) {
          $rootScope.$emit('sidemenuToggles', {
            previousTemplate: vm.activeSidemenuItem,
            currentTemplate: template
          });
          vm.activeSidemenuItem = template;
          vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
        }
        // closing
        else{
          console.log("closing");
          $rootScope.$emit('sidemenuToggles', {
            previousTemplate: vm.activeSidemenuItem,
            currentTemplate: null
          });
          vm.activeSidemenuItem = '';
          $("#ptt-wrapper-2").toggleClass("toggled");
        }
      }
    }

    function closeSidemenu(){
      if($("#ptt-wrapper-2").hasClass("toggled")){
        $rootScope.$emit('sidemenuToggles', {
          previousTemplate: vm.activeSidemenuItem,
          currentTemplate: null
        });
        vm.activeSidemenuItem = '';
        $("#ptt-wrapper-2").removeClass("toggled");
        $('div#image-studio').css({
          'padding': '2.65% 0'
        });
      }
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

      var updateValue = 0;
      var firstTimeDifference = 17;

      // Formula for aspect ratio equality calculation
      // (original height / original width) = (new height / new width)

      // if image studio height is small
      if(imageStudio.height < imageStudio.width){
        // new width = (new height)/(original height / original width)
        updateValue = (imageStudio.height)/(element.original.height/element.original.width);
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

      // set zoom and dimensions of canvas
      // got from canvas test
      scaleFactor = updateValue/element.original.width;
      console.log("--- FACTOR SCALE ---", scaleFactor);
      if(scallingFirstTime){
        fabricCanvas.setZoom((scaleFactor*scaleConstant));
      }
      else{
        fabricCanvas.setZoom(fabricCanvas.getZoom() + (scaleFactor*scaleConstant));
      }
      console.log("CURRENT ZOOM: ", fabricCanvas.getZoom());
      //fabricCanvas.setDimensions({
      //  width: updateValue,
      //  height: updateValue
      //});
      fabricCanvas.setWidth(updateValue);
      fabricCanvas.setHeight(updateValue);
      fabricCanvas.renderAll();

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
              //vm.myPhotos.push(elem);
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
      // close sidemenu if open
      vm.closeSidemenu();
      // remove caman canvas
      vm.showCamanImg = false;
      $('canvas#caman-canvas').remove();
      // get photo now
      photosFactory.getSelectedPhoto(id, index).then(function(resp){
        // save image data
        vm.selectedPhoto = {
          thumbnail: vm.myPhotos[index],
          original: resp
        };

        console.log('vm.selectedPhoto: ', vm.selectedPhoto);
        // remove caman id to reset caman
        $('#caman-canvas').removeAttr('data-caman-id');
        // this will add caman img tag in DOM - its angular baby :P
        vm.showCamanImg = true;
        // load image in controller
        canvasImage.src = vm.selectedPhoto.original.base64;
        canvasImage.onload = function() {
          if(!canvasBkgImg.active){
            canvasBkgImg.id = (new Date().getTime() / 1000);
            canvasBkgImg.instance = new fabric.Image(canvasImage, {
              id: canvasBkgImg.id,
              renderOnAddRemove: false
            });
            canvasBkgImg.active = true;
            canvasBkgImg.instance.set(fabricObjSettings);
            fabricCanvas.add(canvasBkgImg.instance);
          }
          else{
            canvasBkgImg.instance.setElement(canvasImage);
          }
          canvasBkgImg.instance.center();
          canvasBkgImg.instance.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.setActiveObject(canvasBkgImg.instance);
        };
      }, function(err){
      });
    }

    //send edited image to the server
    function sendEditedImage(){
      if(vm.selectedPhoto.original != null){
        //var configs = cropperFactory.getImageDetails();
        //if(vm.selectedPhoto.filter!=false && vm.selectedPhoto.filter!='normal'){
        //  configs.filteredImage = vm.selectedPhoto.filteredImage;
        //}
        fabricCanvas.deactivateAll();
        $rootScope.dummyImage = fabricCanvas.toDataURL();
        $state.go($rootScope.app.productState + '.Checkout', {id: vm.selectedPhoto.original.id});
      }
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
      console.log("FILTER TO APPLY: ", filter);
      // add new filter
      vm.selectedPhoto.filter = filter;
      // apply filter
      Caman('#caman-canvas', function () {
        //var that = this;
        this.revert(false);
        switch(filter){
          case'normal':
            // do nothing
            break;
          default:
            this[filter]();
            break;
        }
        this.render(function(){
          // destroy cropper and set it for filtered image
          vm.selectedPhoto.filteredImage = this.toBase64();
          canvasImage.src = this.toBase64();
          canvasImage.onload = function() {
            canvasBkgImg.instance.setElement(canvasImage);
            fabricCanvas.renderAll();
          };
        });
      });
    }

    /************************************* STICKERS *************************************/

    function applySticker(sticker){
      if(sticker.url && sticker.isActive){
        var img = new Image();
        img.src = sticker.url;
        img.onload = function() {
          var fabricStickerInstance = new fabric.Image(img, {
            id: (new Date().getTime() / 1000)
          });
          fabricStickerInstance.set(fabricObjSettings);
          fabricCanvas.add(fabricStickerInstance);
          fabricStickerInstance.center();
          fabricStickerInstance.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.setActiveObject(fabricStickerInstance);
        };
      }
    }

    /************************************* TEXTS *************************************/

    function applyText(text){
      console.log(text);
      if(text.url && text.isActive){
        var fabricText = new fabric.IText('Add Heading', {
          id: (new Date().getTime() / 1000),
          fontFamily: text.name
        });
        fabricText.setColor('white');
        //fabricText.enterEditing();
        //fabricText.hiddenTextarea.focus();
        fabricText.set(fabricObjSettings);
        fabricCanvas.add(fabricText);
        fabricText.center();
        fabricText.setCoords();
        fabricCanvas.renderAll();
        fabricCanvas.setActiveObject(fabricText);
      }
    }

    /************************************* LAYOUTS *************************************/

    function applyLayout(layout){
      console.log(layout);
      var layoutCloned = angular.copy(layout);
      if(layoutCloned.data.length>0){
        // remove all previous layouts from canvas
        layoutSectionsObj.forEach(function(elem, index){
          elem.remove();
        });
        layoutSectionsObj = [];
        // customize new layouts
        layoutCloned.data.forEach(function(elem, index){
          // convert the percentage values to actual values
          elem.top = fabricCanvas.getHeight()*elem.top;
          elem.left = fabricCanvas.getWidth()*elem.left;
          elem.height = fabricCanvas.getHeight()*elem.height;
          elem.width = fabricCanvas.getWidth()*elem.width;
          // add the clipping rect to canvas
          var clipRect = new fabric.Rect(elem);
          layoutSectionsObj.push(clipRect);
          fabricCanvas.add(clipRect);
        })
      }
    }

    /************************************* LEFT TOOLBAR FUNCTIONS *************************************/
    function flipHorizontal(){
      var object = fabricCanvas.getActiveObject();
      object.flipX = object.flipX ? false : true;
      fabricCanvas.renderAll();
    }

    function flipVertical(){
      var object = fabricCanvas.getActiveObject();
      object.flipY = object.flipY ? false : true;
      fabricCanvas.renderAll();
    }

    function rotateClockwise(){
      var object= fabricCanvas.getActiveObject();
      object.animate('angle', object.angle+(-90), {
        //easing: fabric.util.ease.easeOutBounce,
        onChange: fabricCanvas.renderAll.bind(fabricCanvas)
      });
      object.setCoords();
    }

    function rotateAntiClockwise(){
      var object= fabricCanvas.getActiveObject();
      object.animate('angle', object.angle+(90), {
        //easing: fabric.util.ease.easeOutBounce,
        onChange: fabricCanvas.renderAll.bind(fabricCanvas)
      });
      object.setCoords();
    }

    function deleteSelectedObject(){
      var selectedElem = fabricCanvas.getActiveObject();
      if(selectedElem!=null){
        selectedElem.remove();
        fabricCanvas.renderAll();
      }
    }

    function copySelectedObject(){
      var selectedElem = fabricCanvas.getActiveObject();
      if(selectedElem!=null){
        console.log("running COPY");
        var clonedObj = fabric.util.object.clone(selectedElem);
        clonedObj.set("top", clonedObj.top+10);
        clonedObj.set("left", clonedObj.left+10);
        clonedObj.set(fabricObjSettings);
        fabricCanvas.add(clonedObj);
        clonedObj.center();
        clonedObj.setCoords();
        fabricCanvas.setActiveObject(clonedObj);
      }
    }

    /************************************* FABRICJS FUNCTIONS *************************************/
    function bindEventsOnFabric(){
      fabricCanvas.on("object:removed", function(e){
        switch(e.target.id){
          case canvasBkgImg.id:
            canvasBkgImg.active = false;
            break;
          default:
            break;
        }
      });

      fabricCanvas.on({
        'mouse:down': function(e) {
          if (e.target) {
            e.target.opacity = 0.5;
            fabricCanvas.renderAll();
          }
        },
        'mouse:up': function(e) {
          if (e.target) {
            e.target.opacity = 1;
            //fabricCanvas.discardActiveObject();
            //fabricCanvas.deactivateAll();
            fabricCanvas.renderAll();
            //var index = fabricCanvas.getObjects().indexOf(e.target);
            //e.target.remove();
            //fabricCanvas.moveTo(e.target, index);
            fabricCanvas.setActiveObject(e.target);

          }
        },
        'object:moved': function(e) {
          e.target.opacity = 0.5;
        },
        'object:modified': function(e) {
          e.target.opacity = 1;
        }
      });

    }

    /* Initializer Call */
    init();
  }

}());
