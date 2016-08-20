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
    var defaultSelectedPhotoIndex = 0;

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
    fabricCanvas.perPixelTargetFind = true;
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
      id: null,
      photoIndex: null
    };
    var scallingFirstTime = true;
    var scaleFactor;
    var scaleConstant = 0.76;
    vm.readyToDisplay = true;
    // layout sections - default is no layout
    var layoutSectionsObj = [];
    // vm.selectedObject
    vm.selectedObject = {};
    vm.updateTextEditor = true;



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
    vm.applyBorder = applyBorder;
    vm.copyCanvas = copyCanvas;
    vm.deleteCanvas = deleteCanvas;
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
    // Customizer
    vm.updateTextSize = updateTextSize;
    vm.updateTextColor = updateTextColor;


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

      // select the 0th index photo by default
      getSelectPhoto(vm.myPhotos[defaultSelectedPhotoIndex].id, defaultSelectedPhotoIndex);

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
        //fabricCanvas.setZoom((scaleFactor*scaleConstant));
      }
      else{
        //fabricCanvas.setZoom(fabricCanvas.getZoom() + (scaleFactor*scaleConstant));
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
      $('#caman-canvas').remove();
      // selected image
      vm.myPhotos.forEach(function(photo){
        photo.selected = false;
      });
      vm.myPhotos[index].selected = true;
      // if canvas was active
      if(canvasBkgImg.active){
        fabricCanvas.deactivateAll();
        // save the already active image with settings
        vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON = fabricCanvas.toJSON();
        vm.myPhotos[canvasBkgImg.photoIndex].canvasImgId = canvasBkgImg.id;
        vm.myPhotos[canvasBkgImg.photoIndex].canvasDataUrl = fabricCanvas.toDataURL();
        // clear canvas
        fabricCanvas.clear();
        // render all
        fabricCanvas.renderAll();
      }

        // get photo now
        photosFactory.getSelectedPhoto(id, index).then(function(resp){
          // the new selected image has JSON data
          if(vm.myPhotos[index].canvasJSON ){
            fabricCanvas.loadFromJSON(vm.myPhotos[index].canvasJSON , function(){
              console.log("LOADED FROM JSON");
              console.log('vm.selectedPhoto: ', vm.selectedPhoto);
              // save index
              canvasBkgImg.photoIndex = index;
              canvasBkgImg.active = true;
              // save image data
              vm.selectedPhoto = {
                thumbnail: vm.myPhotos[index],
                original: resp
              };
              // caman image for filter
              canvasImage.src = vm.selectedPhoto.original.base64;
              canvasImage.onload = function(){
                $(canvasImage).css('z-index', '-10');
                $(canvasImage).attr('id', 'caman-canvas');
                $('.editor').append(canvasImage);
              };
              // fabric settings
              var objects = fabricCanvas.getObjects();
              objects.forEach(function(obj){
                obj.set(fabricObjSettings);
              });
              // background img settings
              objects[0].set({
                id: vm.myPhotos[index].canvasImgId
              });
              canvasBkgImg.id = vm.myPhotos[index].canvasImgId;
              // position
              //objects[0].center();
              objects[0].setCoords();
              // locks
              objects[0].lockMovementY = false;
              objects[0].lockMovementX = false;
              objects[0].hasControls = false;
              if(objects[0].width > objects[0].height){
                objects[0].scaleToHeight(fabricCanvas.getHeight());
                objects[0].lockMovementY = true;
              }
              else{
                objects[0].scaleToWidth(fabricCanvas.getWidth());
                objects[0].lockMovementX = true;
              }
              // render All
              fabricCanvas.renderAll();
            })
          }
          else{
            // save image data
            vm.selectedPhoto = {
              thumbnail: vm.myPhotos[index],
              original: resp
            };
            console.log('vm.selectedPhoto: ', vm.selectedPhoto);
            // load image in controller
            canvasImage.src = vm.selectedPhoto.original.base64;
            canvasImage.onload = function() {
              // caman image for filter
              $(canvasImage).css('z-index', '-10');
              $(canvasImage).attr('id', 'caman-canvas');
              $('.editor').append(canvasImage);
              // settings
              canvasBkgImg.id = (new Date().getTime() / 1000);
              canvasBkgImg.instance = new fabric.Image(canvasImage, {
                id: canvasBkgImg.id,
                renderOnAddRemove: false
              });
              canvasBkgImg.active = true;
              canvasBkgImg.photoIndex = index;
              canvasBkgImg.instance.set(fabricObjSettings);
              // add to canvas
              fabricCanvas.add(canvasBkgImg.instance);
              // position
              canvasBkgImg.instance.center();
              canvasBkgImg.instance.setCoords();
              // locks
              canvasBkgImg.instance.lockMovementY = false;
              canvasBkgImg.instance.lockMovementX = false;
              canvasBkgImg.instance.hasControls = false;
              if(canvasImage.naturalWidth > canvasImage.naturalHeight){
                canvasBkgImg.instance.scaleToHeight(fabricCanvas.getHeight());
                canvasBkgImg.instance.lockMovementY = true;
              }
              else{
                canvasBkgImg.instance.scaleToWidth(fabricCanvas.getWidth());
                canvasBkgImg.instance.lockMovementX = true;
              }
              fabricCanvas.renderAll();
              fabricCanvas.setActiveObject(canvasBkgImg.instance);
            };
          }
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
      if(index == canvasBkgImg.photoIndex){
        deleteCanvas();
      }
      else{
        photosFactory.deletePhoto(id, index);
      }
    }

    //copy photo
    function copyPhoto(id, index){
      if(index == canvasBkgImg.photoIndex){
        copyCanvas();
      }
      else{
        photosFactory.copyPhoto(id, index);
      }
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
          var img = new Image();
          img.src = this.toBase64();
          img.onload = function() {
            // if fabric is loaded from JSON
            if(vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON){
              var fabricImgObj = fabricCanvas.getObjects()[0];
              fabricImgObj.setElement(img);
            }
            // else
            else{
              canvasBkgImg.instance.setElement(img);
            }
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
        hideObjectCustomizer();
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

    function applyBorder(){
      var fabricCanvasToJSON = fabricCanvas.toJSON();
      console.log(fabricCanvasToJSON);
      fabricCanvas.clear();
      setTimeout(function(){
        fabricCanvas.loadFromJSON(fabricCanvasToJSON, function(){
          var objects = fabricCanvas.getObjects();
          objects.forEach(function(obj){
            obj.set(fabricObjSettings);
          });
          fabricCanvas.renderAll();
        });
      }, 2000);
    }

    function copyCanvas(){
      fabricCanvas.deactivateAll();
      // save the already active image with settings
      vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON = fabricCanvas.toJSON();
      vm.myPhotos[canvasBkgImg.photoIndex].canvasImgId = canvasBkgImg.id;
      vm.myPhotos[canvasBkgImg.photoIndex].canvasDataUrl = fabricCanvas.toDataURL();
      // create a copy in vm.myPhotos
      var copiedObj = angular.copy(vm.myPhotos[canvasBkgImg.photoIndex]);
      copiedObj.selected = false;
      vm.myPhotos.splice(canvasBkgImg.photoIndex+1, 0, copiedObj);
    }

    function deleteCanvas(){
      // remove current selected photo with all canvas settings
      photosFactory.deletePhoto(vm.myPhotos[canvasBkgImg.photoIndex].id, canvasBkgImg.photoIndex)
        .then(function(resp){
          if(resp.success){
            canvasBkgImg.active = false;
            fabricCanvas.clear();
            // load default photo
            // select the 0th index photo by default
            getSelectPhoto(vm.myPhotos[defaultSelectedPhotoIndex].id, defaultSelectedPhotoIndex);
          }
        })
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
          }
        },
        'mouse:up': function(e) {
          var obj = e.target;
          if (obj) {
            obj.opacity = 1;
            switch(obj.id){
              case canvasBkgImg.id:
                fabricCanvas.sendToBack(obj);
                fabricCanvas.deactivateAll();
                break;
              default:
                console.log("Obj index: ", fabricCanvas.getObjects());
                var newIndex = fabricCanvas.getObjects().length;
                fabricCanvas.moveTo(obj, newIndex);
                fabricCanvas.setActiveObject(obj);
                break;
            }
            fabricCanvas.renderAll();
          }
        },
        'selection:cleared': function(e){
          hideObjectCustomizer();
        },
        'object:selected': function(e){
          if(e.target){
            vm.selectedObject = e.target;
            objectCustomizer(vm.selectedObject);
            fabricCanvas.renderAll();
          }
        },
        'object:moved': function(e) {
          e.target.opacity = 0.5;
        },
        'object:modified': function(e) {
          var obj = e.target;
          if (obj) {
            obj.opacity = 1;
            switch(obj.id){
              case canvasBkgImg.id:
                backgroundImageBoundaryCheck(obj);
                fabricCanvas.deactivateAll();
                break;
              default:
                break;
            }
            fabricCanvas.renderAll();
          }
        },
        'object:moving': function(e) {
          vm.selectedObject = e.target;
          objectCustomizer(vm.selectedObject);
        }
      });

      // Background Image Boundary Check and Position Update
      function backgroundImageBoundaryCheck(obj){
        var bounds = obj.getBoundingRect();
        // moving horizontally
        if(!obj.lockMovementX){
          if(bounds.left > 0){
            console.log("inside left bound");
            obj.left = bounds.width/2;
            obj.setCoords();
          }
          else if((bounds.width + bounds.left) < fabricCanvas.getWidth()){
            console.log("inside right bound");
            obj.left = fabricCanvas.getWidth() - bounds.width/2;
            obj.setCoords();
          }
        }
        // moving vertically
        else if(!obj.lockMovementY){
          if(bounds.top > 0){
            console.log("inside top bound");
            obj.top = bounds.height/2;
            obj.setCoords();
          }
          else if((bounds.height + bounds.top) < fabricCanvas.getHeight()){
            console.log("inside bottom bound");
            obj.top = fabricCanvas.getHeight() - bounds.height/2;
            obj.setCoords();
          }
        }
      }

    }

    /************************************* OBJECT CUSTOMIZER *************************************/

    function objectCustomizer(obj){
      console.log("Customize Object: ",obj);
      // capture control
      var customizerControl = $('.text-editor-parent');
      // weather to open or not
      switch(obj.type){
        case 'i-text':
          console.log("opening customizer");
          // show necessary control
          customizerControl.find('.size-picker').css('display', 'block');
          customizerControl.find('.ptt-dropmenu').css('display', 'block');
          customizerControl.find('.vertical-partition').css('display', 'block');
          // show control
          customizerControl.css({
            'visibility': 'visible',
            'opacity': 1
          });
          // update size picker
          customizerControl.find('.size-picker').val(obj.getFontSize());
          // update color
          customizerControl.find('.ptt-dropdown-color-3').css('background-color', obj.fill);
          break;
        case 'image':
          // its sticker
          if(obj.id != canvasBkgImg.id){
            console.log("hide unnecessary control");
            // hide unnecessary control
            customizerControl.find('.size-picker').css('display', 'none');
            customizerControl.find('.ptt-dropmenu').css('display', 'none');
            customizerControl.find('.vertical-partition').css('display', 'none');
            console.log("opening customizer");
            // show control
            customizerControl.css({
              'visibility': 'visible',
              'opacity': 1
            });
          }
          else{
            customizerControl.css({
              'visibility': 'hidden',
              'opacity': 0
            });
          }
          break;
        default:
          customizerControl.css({
            'visibility': 'hidden',
            'opacity': 0
          });
          break;
      }
      // position customizer control
      customizerControl.css('left', obj.left - customizerControl.width()/2);
      customizerControl.css('top', obj.top - (obj.height/2) - 48 - 52 );

    }

    function hideObjectCustomizer(){
      // capture control
      var customizerControl = $('.text-editor-parent');
      // hide
      customizerControl.css({
        'visibility': 'hidden',
        'opacity': 0
      });
    }

    function updateTextSize(){
      // capture control
      var customizerControl = $('.text-editor-parent');
      var sizePickerValue = customizerControl.find('.size-picker').val();
      vm.selectedObject.setFontSize(sizePickerValue);
      fabricCanvas.renderAll();
    }

    function updateTextColor(elemIndex){
      // capture control
      var customizerControl = $('.text-editor-parent');
      var currentColorLi = customizerControl.find('.ptt-dropdown-color-3');
      var list = customizerControl.find('.ptt-dropdown-color-2');
      var selectedColor = $(list[elemIndex]).css('background-color');
      console.log("update color", selectedColor);
      vm.selectedObject.setColor(selectedColor);
      fabricCanvas.renderAll();
      // switch color
      $(currentColorLi).css('background-color', selectedColor);
    }



    /* Initializer Call */
    init();
  }

}());
