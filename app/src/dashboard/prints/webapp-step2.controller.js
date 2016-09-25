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
  function webappStep2Ctrl($scope, photosFactory, designTool, $rootScope, $state, $timeout,productsFactory, alertFactory){

    var vm = this;

    /* Variables */
    vm.myPhotos = photosFactory._data.photos;
    vm.myPhotosTotalCount = photosFactory._data.totalCount;
    vm.selectedBorder='noBorder';
    var defaultSelectedPhotoIndex = 0;

    vm.myPhotosPagination = {
      from: 0,
      size: 6,
      dimension: '260x260'
    };
    vm.activeSidemenuItem = null;
    vm.selectedPhoto = {
      thumbnail: null,
      original: null,
      filter: null
    };

    // canvas
    var canvasImage = new Image();
    canvasImage.crossOrigin = '';
    // fabric canvas
    designTool.initializeTool('canvas');
    // fabric objects setting
    var fabricObjSettings = {
      borderColor: 'white',
      borderDashArray: [5, 5],
      cornerColor: 'rgba(101,224,228,0.7)',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderOpacityWhenMoving: 0.6,
      hoverCursor: 'move',
      transparentCorners: false,
      originX: 'center',
      originY: 'center'
    };
    var canvasBkgImg = {
      active: false,
      photoIndex: null
    };
    vm.readyToDisplay = true;
    vm.selectedObject = {};
    vm.updateTextEditor = true;
    // available canvas types, don't modify in controller
    vm.availableCanvasTypes = designTool.getCanvasTypes();
    // default canvas type & size string
    vm.selectedSizeOfCanvas = getCanvasSizeDetailsInString();


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
    // nextstep
    vm.goToState = goToState;
    // Deselect layouts
    vm.deSelectLayout = deSelectLayout;
    // Resize Canvas When different Canvas is Changed
    vm.updateCanvasSize = updateCanvasSize;
    vm.sizeMouseOver = sizeMouseOver;
    vm.sizeMouseLeave = sizeMouseLeave;

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

      /* Action Icon 3 DropMenu */
      $('.action-icons-3 .ptt-dropmenu').on('show.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px 50px 30px 30px');
      });

      $('.action-icons-3 .ptt-dropmenu').on('hidden.bs.dropdown', function () {
        $('#dLabel2').css('border-radius', '50px');
      });

      $(document).ready(function(){

        designTool.onDOMLoad();
        // initialize zoom slider
        designTool.initializeZoomSlider("#ex4");
        // update image studio .element css
        designTool.updateImageEditorSize();
      });

      // select the 0th index photo by default

      getSelectPhoto(vm.myPhotos[defaultSelectedPhotoIndex].id, defaultSelectedPhotoIndex);
    }

    function toggleSidemenu(template){
      // if addMorePhotos
      if(template == 'addMorePhotos'){
        saveCanvasState();
        $state.go('^.Upload');
        return;
      }
      if(template== 'filters'){
        if(!designTool.checkLayoutSelection()){
          alertFactory.warning(null, "Please select an image to apply filter");
          return;
        }
      }

      // if opening
      if(!$("#ptt-wrapper-2").hasClass("toggled")){
        //// console.log("opening");
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
          //// console.log("closing");
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

    function deSelectLayout() {
      if($('.sidemenu-layouts > .empty-images').hasClass('layout-selected')){
        $('.sidemenu-layouts > .empty-images').removeClass('layout-selected');
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
    $(window).resize(function(){
      designTool.updateImageEditorSize();
    });

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
            //// console.log("new photos length: ", resp.photos.length);
            resp['photos'].forEach(function (elem, index) {
              //vm.myPhotos.push(elem);
            });
            if (vm.myPhotosTotalCount > vm.myPhotos.length) {
              // call it self
              loadMoreMyPhotos();
            }
            else {
              //// console.log("all photos are loaded");
            }
          });
      }
    }
    // get the high res image for editing
    function getSelectPhoto(id, index, imageDragged){
      if(imageDragged && !designTool.getProp('droppedOnCanvas')){
        // image is dragged but not dropped on canvas
        return;
      }
      // show loader
      $('.global-loader').css('display', 'block');
      //
      vm.closeSidemenu();
      vm.deSelectLayout();
      // if no section is selected then mark the index selected
      if(!designTool.getProp('isSectionSelected')){
        // selected image
        vm.myPhotos.forEach(function(photo){
          photo.selected = false;
        });
        vm.myPhotos[index].selected = true;
      }
      // if canvas is already in editing, save current work as JSON
      if(!designTool.getProp('isCanvasEmpty')){

        if(canvasBkgImg.photoIndex!=null && 'isEdited' in vm.myPhotos[canvasBkgImg.photoIndex]) {
          // save the already active image with settings
          // canvas json will have zoom value and original scale value
          // deselect canvas
          console.log("CTRL: SAVING PRODUCT");
          designTool.deActivateAll();
          var canvasJson = designTool.getCanvasJSON();
          canvasJson.customSettings.selectedBorder = 'noBorder';
          if(vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON){
            if(vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON.customSettings){
              canvasJson.customSettings.selectedBorder = vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON.customSettings.selectedBorder;
            }
          }
          updatePhotoStripWithCanvas(
            canvasBkgImg.photoIndex,
            canvasJson,
            designTool.getCanvasDataUrl()
          );

        }

        // var dataToSaveForProduct = {
        //   photoid : vm.myPhotos[canvasBkgImg.photoIndex].id,
        //   canvasDataUrl : designTool.getCanvasDataUrl(),
        //   canvasJSON : designTool.getCanvasJSON()
        // };
        // // console.log('data to save',dataToSaveForProduct);
        // productsFactory.addInProgressProducts(dataToSaveForProduct);

        // working on layout
        if(designTool.getProp('isSectionSelected')){
          // reset only zoom
          //designTool.resetZoomSettings();
        }
        // working on single photo
        else{
          // reset canvas + zoom
          designTool.resetTool();         // reset zoom settings inside
        }
      }
      // get photo now
      photosFactory.getSelectedPhoto(id, index).then(function(resp){
        // the new selected image has JSON data
        // JSON will be loaded now, saved current work and rest tool
        if(vm.myPhotos[index].canvasJSON ){
          // console.log('CTRL: Loading from JSON', vm.myPhotos[index].canvasJSON);
          // if JSON is present the current layout will be cleared
          designTool.resetTool();
          // update index
          canvasBkgImg.photoIndex = index;
          // load
          designTool.loadFromJSON(vm.myPhotos[index].canvasJSON, function(loadedImage){
            // caman image for filter
            var img = new Image();
            img.onload = function(){
              updateCamanCanvas(img);
            };
            img.src = resp.base64 ? resp.base64 : loadedImage;
            // save image data & filter widget will update filters
            saveSelectedPhoto(vm.myPhotos[index], resp);
            // update the size dropdown with default values
            vm.selectedSizeOfCanvas = getCanvasSizeDetailsInString(
              vm.myPhotos[index].canvasJSON.customSettings.canvasSizeDetails.type,
              vm.myPhotos[index].canvasJSON.customSettings.canvasSizeDetails.size
            );

            turnOffSelectedImageDrag();
            // hide loader
            $('.global-loader').css('display', 'none');

          });

          vm.selectedBorder=vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON.customSettings.selectedBorder;

          if(!designTool.getProp('isLayoutApplied')){
            if(vm.selectedBorder=='outerBorder'){
              $('#canvas').addClass("single-image-border");
            }
            else if(vm.selectedBorder=='noBorder'){
              $('#canvas').removeClass("single-image-border");
            }
          }
          else{
            $('#canvas').removeClass("single-image-border");
          }
        }
        // new image -> single photo / adding to current layout
        else{
          // console.log('CTRL: Loading new Image');
          // update index

          if(!designTool.getProp('isSectionSelected')){
            canvasBkgImg.photoIndex = index;
          }
          designTool.loadBkgImage(resp, {photoIndex: index, currentFilter: 'normal'}, function(loadedImage){
            $('#canvas').removeClass("single-image-border");
            $timeout(function(){
              // caman image for filter
              updateCamanCanvas(loadedImage);
              // save image data & filter widget will update filters
              saveSelectedPhoto(vm.myPhotos[index], resp);
              // udpate photo strip in case working on layout
              if(designTool.getProp('isSectionSelected')){
                // designTool.deselectLayoutAllSections();
                // turnOffSelectedImageDrag();
                // update photostrip slot
                updatePhotoStripWithCanvas(
                  canvasBkgImg.photoIndex,
                  designTool.getCanvasJSON(),
                  designTool.getCanvasDataUrl()
                );
              }
              // udpate border and dropdown
              else{
                vm.selectedBorder='noBorder';
                // update the size dropdown with default values
                vm.selectedSizeOfCanvas = getCanvasSizeDetailsInString();
              }

              // designTool.updateImageEditorForCanvasChange(null);
              turnOffSelectedImageDrag();

              // hide loader
              $('.global-loader').css('display', 'none');

            });
          });
        }

      }, function(err){
      });

      // close sidemenu if open

    }

    function updateCamanCanvas(img){
      // console.log('CTRL: updateCamanCanvas');
      // remove caman canvas
      $('#caman-canvas').remove();
      // set new caman canvas
      $(img).css('z-index', '-10');
      $(img).css('margin-top', '4000px');
      $(img).attr('id', 'caman-canvas');
      $('.editor').append(img);
    }

    function saveSelectedPhoto(thumbnail, original){
      // console.log('CTRL: saveSelectedPhoto');
      // will also update sidemenu filters
      vm.selectedPhoto = {
        thumbnail: thumbnail,
        original: original
      };
    }

    function updatePhotoStripWithCanvas(index, canvasJSON, canvasDataUrl){
      // console.log('CTRL: saving current work', index, canvasJSON);
      if(canvasJSON){
        vm.myPhotos[index].canvasJSON = canvasJSON;
      }
      if(canvasDataUrl){
        vm.myPhotos[index].canvasDataUrl = canvasDataUrl;
      }
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
        // in progress product(d)
        // copy product
      }
      else{
        photosFactory.copyPhoto(id, index);
      }
    }

    /************************************* FILTERS *************************************/

    // apply filter
    function applyFilter(filter, cb){
      designTool.applyFilter(filter, function(flag){
        cb(flag);
      });
    }

    /************************************* STICKERS *************************************/

    function applySticker(sticker){
      designTool.applySticker(sticker);
    }

    /************************************* TEXTS *************************************/

    function applyText(text){
      designTool.applyText(text);
    }

    /************************************* LAYOUTS *************************************/

    function applyLayout(layout){
      // show loader
      $('.global-loader').css('display', 'block');
      //
      var isLayoutApplied = designTool.getProp('isLayoutApplied');
      designTool.applyLayout(layout, function(islayoutOff,photoIndex){
        if(!islayoutOff){
          $('#canvas').removeClass("single-image-border");
          vm.selectedBorder='noBorder';
          $timeout(function(){
            // remove selected from old one
            vm.myPhotos[canvasBkgImg.photoIndex].selected = false;
            // if layout is not applied then
            if(!isLayoutApplied){
              // create a new photo slot for layout
              vm.myPhotos.splice(canvasBkgImg.photoIndex+1, 0, angular.copy(vm.myPhotos[canvasBkgImg.photoIndex]));
              // console.log(vm.myPhotos);
              canvasBkgImg.photoIndex++;
              vm.myPhotos[canvasBkgImg.photoIndex].isEdited = true;
            }
            // else update the current slot
            updatePhotoStripWithCanvas(
              canvasBkgImg.photoIndex,
              designTool.getCanvasJSON(),
              designTool.getCanvasDataUrl()
            );
            vm.myPhotos[canvasBkgImg.photoIndex].selected = true;
            turnOffSelectedImageDrag();
            // hide loader
            $('.global-loader').css('display', 'none');
          })
        }else {
          designTool.loadBkgImage(vm.myPhotos[photoIndex], {photoIndex: photoIndex, currentFilter: 'normal'}, function(loadedImage){
            $timeout(function(){
              // caman image for filter
              updateCamanCanvas(loadedImage);
              // save image data & filter widget will update filters
              //saveSelectedPhoto(vm.myPhotos[photoIndex], resp);
              vm.myPhotos.splice(canvasBkgImg.photoIndex, 1);
              // udpate photo strip in case working on layout
              if(designTool.getProp('isSectionSelected')){
                updatePhotoStripWithCanvas(
                  photoIndex,
                  designTool.getCanvasJSON(),
                  designTool.getCanvasDataUrl()
                );
              }
              // hide loader
              $('.global-loader').css('display', 'none');
            })
          })
        }
      });
    }

    /************************************* LEFT TOOLBAR FUNCTIONS *************************************/
    function flipHorizontal(){
      designTool.flipHorizontal();
    }

    function flipVertical(){
      designTool.flipVertical();
    }

    function rotateClockwise(){
      designTool.rotateClockwise();
    }

    function rotateAntiClockwise(){
      designTool.rotateAntiClockwise();
    }

    function deleteSelectedObject(){
      designTool.deleteSelectedObject();
    }

    function copySelectedObject(){
      alertFactory.warning(null, 'Not functional, need updates');
      return;
      var selectedElem = fabricCanvas.getActiveObject();
      if(selectedElem!=null){
        //// console.log("running COPY");
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
      if(designTool.getProp('isLayoutApplied')){
        designTool.applyBorder(changeBorderSvg, vm.selectedBorder, -1);
      }
      else{
        designTool.applyBorder(changeBorderSvg, vm.selectedBorder, canvasBkgImg.photoIndex);
      }
    }

    function copyCanvas(){
      alertFactory.warning(null, 'Not functional, need updates');
      return;

      // fabricCanvas.deactivateAll();

      // save the already active image with settings
      // vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON = fabricCanvas.toJSON();
      // vm.myPhotos[canvasBkgImg.photoIndex].canvasImgId = canvasBkgImg.id;
      // vm.myPhotos[canvasBkgImg.photoIndex].canvasDataUrl = fabricCanvas.toDataURL();
      // create a copy in vm.myPhotos
      var copiedObj = angular.copy(vm.myPhotos[canvasBkgImg.photoIndex]);
      copiedObj.selected = false;
      vm.myPhotos.splice(canvasBkgImg.photoIndex+1, 0, copiedObj);
    }

    function deleteCanvas(){
      alertFactory.warning(null, 'Not functional, need updates');
      return;
      // return;
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

    /************************************* DESIGN TOOL EVENTS *************************************/

    designTool.on('image:selected', function(e){
      // console.log("CTRL: image:selected: ", e);
      // console.log(e.data[0]);
      photosFactory.getSelectedPhoto(vm.myPhotos[e.data[0].photoIndex].id).then(
        function(resp){
          vm.myPhotos[e.data[0].photoIndex].currentFilter = e.data[0].currentFilter;
          saveSelectedPhoto(vm.myPhotos[e.data[0].photoIndex], resp);
          // caman image for filter
          var img = new Image();
          img.onload = function(){
            updateCamanCanvas(img);
          };
          img.src = resp.base64;
        }
      )
    });

    designTool.on('layout:sectionToggle', function(e) {
      // console.log("CTRL: sectionToggle: ", e);
      if (vm.activeSidemenuItem == "filters") {
        if (!designTool.checkLayoutSelection()) {
          closeSidemenu();
        }
      }
    });

    designTool.on('image:edited',function (e) {
      // console.log('CTRL: Edited event',e.data);
      vm.myPhotos[e.data[0].photoIndex].isEdited = true;
    });

    /************************************* OBJECT CUSTOMIZER *************************************/

    function updateTextSize(){
      designTool.updateTextSize();
    }

    function updateTextColor(elemIndex){
      designTool.updateTextColor(elemIndex);
    }

    /************************************* Canvas type & Size *************************************/
    // update Canvas type and size
    function updateCanvasSize(type, size){
      // show loader
      $('.global-loader').css('display', 'block');
      //
      designTool.updateImageEditorForCanvasChange(type, size, null, null, function(){
          vm.selectedSizeOfCanvas = getCanvasSizeDetailsInString(type, size);
          // hideloader
          $('.global-loader').css('display', 'none');
        }
      );
    }

    function getCanvasSizeDetailsInString(type, size, orientation){
      var defaultDetails = designTool.getDefaultCanvasSizeDetails();
      var obj = {
        type: type || defaultDetails.type,
        size: size || defaultDetails.size,
        orientation: orientation || defaultDetails.orientation
      };
      obj.type = obj.type.toUpperCase();
      return vm.availableCanvasTypes[obj.type].name.capitalize()
        /* Only Initial */
        + ' (' + vm.availableCanvasTypes[obj.type].sizes[obj.size].initial + ')';
      /*  Inches -> (4x4)
       + ' ' + vm.availableCanvasTypes[obj.type].sizes[obj.size][obj.orientation].width.inches
       + 'x' + vm.availableCanvasTypes[obj.type].sizes[obj.size][obj.orientation].height.inches
       + '';
       */
    }

    function sizeMouseOver(type, size){
      var defaultDetails = designTool.getDefaultCanvasSizeDetails();
      type = type.toUpperCase();
      vm.availableCanvasTypes[type].sizeHoveredText = vm.availableCanvasTypes[type].sizes[size][defaultDetails.orientation].width.inches
        + ' x ' + vm.availableCanvasTypes[type].sizes[size][defaultDetails.orientation].height.inches
        + '';
    }

    function sizeMouseLeave(type, size){
      type = type.toUpperCase();
      vm.availableCanvasTypes[type].sizeHoveredText = null;
    }

    /************************************* Image change on hover *************************************/
    var imageUrl;
    $('.toolbar .custom-svg-icon>img').hover(function (e) {
        imageUrl=this.src;
        var temp= imageUrl.substring(imageUrl.indexOf("svgs/"), imageUrl.length);
        imageUrl=temp;
        temp=temp.replace(/fullBorder|innerBorder|outerBorder/gi, 'noBorder');
        temp=temp.replace("gray", "blue");
        temp=temp.replace(/-[0-9]/g, "");
        this.src=temp;
        // console.log(temp);
      },
      function (e) {
        imageUrl=imageUrl.replace(/noBorder|fullBorder|innerBorder|outerBorder/gi, vm.selectedBorder);
        this.src=imageUrl;
      }
    );

    function changeBorderSvg(borderStyle){
      vm.selectedBorder = borderStyle;
      var canvasJson = designTool.getCanvasJSON();
      canvasJson['customSettings'] = {
        selectedBorder : borderStyle
      };
      vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON = canvasJson;
    }

    /************************************* Other methods *************************************/
    function goToState(stateName){
      saveCanvasState();
      designTool.emptyTool();
      // go to state
      //// console.log(stateName);
      if(stateName.indexOf('Upload')>=0){
        //// console.log("going");
        $state.go('^.Upload');
      }
      else{
        $state.go(stateName);
      }
    }

    function saveCanvasState(){
      //fabricCanvas.deactivateAll();
      // save the already active image with settings
      //vm.myPhotos[canvasBkgImg.photoIndex].canvasJSON = fabricCanvas.toJSON();
      //vm.myPhotos[canvasBkgImg.photoIndex].canvasImgId = canvasBkgImg.id;
      //vm.myPhotos[canvasBkgImg.photoIndex].canvasDataUrl = fabricCanvas.toDataURL();
      //vm.myPhotos[canvasBkgImg.photoIndex].canvasImgZoomValue = zoomSlider.slider('getValue');
      //vm.myPhotos[canvasBkgImg.photoIndex].canvasImgOrignalScaleValue = originalScale;
      // clear canvas
      //fabricCanvas.clear();
      // hide customizer
      //h
      //
      // ideObjectCustomizer();
      updatePhotoStripWithCanvas(
        canvasBkgImg.photoIndex,
        designTool.getCanvasJSON(),
        designTool.getCanvasDataUrl()
      );
    }

    function turnOffSelectedImageDrag(){
      $timeout(function () {
        $('.step2-lightSlider li').each(function(i){
          var image=$(this);
          image.find("img").attr("draggable", "true");
          if(image.hasClass("selected")){
            // console.log(image.find("img")[1].id);
            image.find("img").attr("draggable", "false");
          }
        });
      },200);
    }
    // controller
    /* Initializer Call */
    init();
  }

}());
