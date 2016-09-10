/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('designTool', designTool);

  function designTool($timeout){

    /*
     * Constants
     * */
    const customObjectTypes = {
      layout: 'Layout',
      filter: 'Filter',
      text: 'Text',
      sticker: 'Sticker',
      backgroundImage: 'BackgroundImage',
      layoutPlusSign: 'LayoutPlusSign'
    };
    const customBorderTypes = [
      'noBorder', 'fullBorder', 'innerBorder', 'outerBorder'
    ];
    const Defaults = {
      zoom: 0,
      plusIconSizeForLayoutSections: 60,
      borderWidth: 8
    };

    /*
     * Variables
     * */
    var currentLayoutSections = [];
    var sectionBkgImages = [];
    var selectedSectionIndex = -1;
    var selectedBorderIndex = 0;
    var flags = {
      isCanvasEmpty: true,
      isSectionSelected: false,
      isLayoutApplied: false,
      isActionPerformable: true
    };
    // props to save
    var propsToIncludeForJSON = [
      'customObjectType', 'hasControls', 'clipName', 'clipFor', 'originalScale', 'zoom', 'sectionIndex'
    ];
    var fabricCanvas;
    // fabric objects default setting
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
    // zoom slider
    var zoomSlider;
    // current selected object (only for opacity)
    var currentSelectedObject = null;

    /*
     * Custom Events
     * */
    const customEventsList = {
      imageSelected: 'image:selected',
      imageEdited: 'image:edited',
      canvasDimensionChanged : 'canvas:dimensionChanged',
      layoutSectionToggle: 'layout:sectionToggle'
    };
    var customEvents = new EventChannel();
    for (var event in customEventsList) {
      if (customEventsList.hasOwnProperty(event)) {
        customEvents.on(customEventsList[event], function(e){
          //console.log('DesignTool: Custom Event Fired: ' + e.name +', with data: ', e.data);
        });
      }
    }

    /* Return Data & Functions */
    return {
      // Helper methods
      initializeTool: initializeTool,
      onDOMLoad: onDOMLoad,
      setDimensions: setDimensions,
      initializeZoomSlider: initializeZoomSlider,
      loadBkgImage: loadBkgImage,
      loadFromJSON: loadFromJSON,
      getCanvasJSON: getCanvasJSON,
      getCanvasDataUrl: getCanvasDataUrl,
      resetTool: resetTool,
      // getter and setter
      getProp: getProp,
      setProp: setProp,
      // Toolbar methods
      applyBorder: applyBorder,
      flipHorizontal: flipHorizontal,
      flipVertical: flipVertical,
      rotateClockwise: rotateClockwise,
      rotateAntiClockwise: rotateAntiClockwise,
      // Left sidemenu methods
      applyFilter: applyFilter,
      applySticker: applySticker,
      applyText: applyText,
      applyLayout: applyLayout,
      // Customizer methods
      updateTextSize: updateTextSize,
      updateTextColor: updateTextColor,
      deleteSelectedObject: deleteSelectedObject,
      copySelectedObject: copySelectedObject,
      // Custom events
      on: on,
      // zoom
      resetZoomSettings: resetZoomSettings,
      checkLayoutSelection: checkLayoutSelection

    };

    /* Define Functions */

    // ****************************************** Helper methods ******************************************

    function initializeTool(canvasId){
      console.log('DESIGN TOOL: initializeTool');
      // initialize fabric canvas
      fabricCanvas = new fabric.Canvas(canvasId);
      fabricCanvas.renderOnAddRemove = false;
      fabricCanvas.perPixelTargetFind = true;
    }

    function onDOMLoad(){
      console.log('DESIGN TOOL: onDOMLoad');
      fabricCanvas.selectionColor = 'rgba(101,224,228,0.5)';
      fabricCanvas.selectionBorderColor = 'white';
      fabricCanvas.selectionLineWidth = 1;
      // disable group selection
      fabricCanvas.selection = false;
      fabricCanvas.renderAll();
      // bind fabric events to tool as well
      bindFabricEvents();
      // bind keyboard events
      bindKeyboardEvents();
    }

    function setDimensions(dimension){
      console.log('DESIGN TOOL: setDimensions');
      fabricCanvas.setDimensions({
        width: dimension.width,
        height: dimension.height
      });
      fabricCanvas.renderAll();
    }

    function initializeZoomSlider(selector){
      // Slider With JQuery
      zoomSlider = $(selector).slider({
        reversed : true
      });
      zoomSlider.on('change', function(data){
        var object;
        if(flags.isLayoutApplied){
          object = findByProps({
            sectionIndex: selectedSectionIndex,
            customObjectType: customObjectTypes.backgroundImage
          })
        }
        else{
          object = findByProps({
            customObjectType: customObjectTypes.backgroundImage
          })
        }
        if(object){
          customEvents.fire(customEventsList.imageEdited,object);
        }
        // if no background image
        if(!object){
          zoomSlider.slider('setValue', Defaults.zoom);
          return;
        }
        /*
         * Formula: OriginalScale(x,y) * ZoomSliderValue = NewScale(x,y)
         * */
        object.setScaleX(object.originalScale.x*data.value.newValue);
        object.setScaleY(object.originalScale.y*data.value.newValue);
        object.set('zoom', data.value.newValue);
        object.setCoords();
        fabricCanvas.renderAll();
        $timeout(function(){
          // to hold on the check till unknown operation finishes
          backgroundImageBoundaryCheck(object);
        }, 500);
      });
    }

    function loadBkgImage(image, propsToAdd, cb){
      console.log('DESIGN TOOL: loadBkgImage');
      var img = new Image();
      img.onload = function(){
        // image settings
        var fabricImage;
        fabricImage = new fabric.Image(img, {
          customObjectType: customObjectTypes.backgroundImage,
          renderOnAddRemove: false,
          hasControls: false,
          zoom: Defaults.zoom
        });
        // fabric default settings
        fabricImage.set(fabricObjSettings);
        // custom props to add
        fabricImage.set(propsToAdd);
        for(var key in propsToAdd){
          if(propsToAdd.hasOwnProperty(key)){
            propsToIncludeForJSON.push(key);
          }
        }
        /* No Layout Section Selected */
        if(selectedSectionIndex == -1){
          console.log('DESIGN TOOL: Layout section is not selected, loading single image');
          flags.isLayoutApplied = false;
          // change bkg color
          fabricCanvas.backgroundColor = '#cccccc';
          // add to canvas
          fabricCanvas.add(fabricImage);
          // position
          fabricImage.center();
          // scale
          if(img.naturalWidth > img.naturalHeight){
            fabricImage.scaleToHeight(fabricCanvas.getHeight());
          }
          else{
            fabricImage.scaleToWidth(fabricCanvas.getWidth());
          }
          // save fabric image instance
          sectionBkgImages = [];
          sectionBkgImages.push(fabricImage);
        }
        /* Working With Layouts Sections */
        else{
          console.log('DESIGN TOOL: Layout section is selected!');
          // position
          // scale
          // apply clipping
          fabricImage = addBkgImageToSection(fabricImage, selectedSectionIndex);
          // if there is already a background image, remove the previous one
          if(typeof sectionBkgImages[selectedSectionIndex] !== 'undefined'){
            sectionBkgImages[selectedSectionIndex].remove();
          }
          // save fabric image instance to section index
          sectionBkgImages[selectedSectionIndex] = fabricImage;
          //console.log(sectionBkgImages);
          // add to canvas
          fabricCanvas.add(fabricImage);
          // remove the plus sign image
          var plusSign = findByProps({
            sectionIndex: selectedSectionIndex,
            customObjectType: customObjectTypes.layoutPlusSign
          });
          if(plusSign) { plusSign.remove(); }
        }
        // save scale
        fabricImage.set('originalScale', {
          x: fabricImage.getScaleX(),
          y: fabricImage.getScaleY()
        });
        // update coords
        fabricImage.setCoords();
        // render
        fabricCanvas.renderAll();
        fabricCanvas.deactivateAll();
        // update flag
        flags.isCanvasEmpty = false;
        // call callback
        if(cb){
          cb(img);
        }
        console.log("DESIGN TOOL: fabricImage", fabricImage);
      };
      img.src = image.base64;
    }

    function loadFromJSON(canvasJSON, cb){
      console.log('DESIGN TOOL: loadFromJSON', canvasJSON);
      for(var i = 0;i<canvasJSON.objects.length;i++){
        if(canvasJSON.objects[i].customObjectType == customObjectTypes.layout){
          flags.isLayoutApplied = true;
          break;
        }
      }
      if(flags.isLayoutApplied){
        var canvasJsonObjects = {};
        canvasJsonObjects[customObjectTypes.layout] = [];
        canvasJsonObjects[customObjectTypes.backgroundImage] = [];
        canvasJsonObjects[customObjectTypes.sticker] = [];
        canvasJsonObjects[customObjectTypes.text] = [];
        for(var j = 0;j<canvasJSON.objects.length;j++){
          switch (canvasJSON.objects[j].customObjectType){
            case customObjectTypes.layout :
              break;
            case customObjectTypes.layoutPlusSign :
            case customObjectTypes.backgroundImage :
              var img = new Image();
              img.src = canvasJSON.objects[j].src;

              var bgImage = new fabric.Image(img,canvasJSON.objects[j]);
              // save scale
              bgImage.set('originalScale', {
                x: canvasJSON.objects[j].x,
                y: canvasJSON.objects[j].y
              });
              canvasJSON.objects[j].clipTo = function (ctx) {
                return _.bind(clipByName, bgImage)(ctx)
              };
              break;
            case customObjectTypes.sticker :
              break;
            case customObjectTypes.text :
              break
          }
        }

        fabricCanvas.loadFromJSON(canvasJSON, fabricCanvas.renderAll.bind(fabricCanvas));
        // for(var prop in canvasJsonObjects){
        //   if(canvasJsonObjects.hasOwnProperty(prop)){
        //     switch (prop){
        //       case customObjectTypes.layout :
        //         for(var k = 0; k<canvasJsonObjects[prop].length;k++){
        //           var clipRect = new fabric.Rect(canvasJsonObjects[prop][k]);
        //           fabricCanvas.add(clipRect);
        //         }
        //         console.log('ok layouts');
        //         break;
        //       case customObjectTypes.backgroundImage :
        //         for(var b  = 0;b<canvasJsonObjects[prop].length;b++){
        //           var img = new Image();
        //           img.src = canvasJsonObjects[prop][b].src;
        //           var bgImage = new fabric.Image(img,canvasJsonObjects[prop][b]);
        //           bgImage.clipTo = function(ctx) {
        //             return _.bind(clipByName, bgImage)(ctx);
        //           };
        //           fabricCanvas.add(bgImage);
        //         }
        //         console.log('ok bg');
        //         break;
        //       case customObjectTypes.sticker :
        //         for(var s  = 0;s<canvasJsonObjects[prop].length;s++){
        //           var sticker = new fabric.Image(canvasJsonObjects[prop][s]);
        //           fabricCanvas.add(sticker);
        //         }
        //         console.log('ok stickers');
        //         break;
        //       case customObjectTypes.text :
        //         for(var t  = 0;t<canvasJsonObjects[prop].length;t++){
        //           var texts = new fabric.IText(canvasJsonObjects[prop][t]);
        //           fabricCanvas.add(texts);
        //         }
        //         console.log('ok text');
        //         break;
        //       default :
        //         break;
        //     }
        //   }
        // }
        // render
        // fabricCanvas.renderAll();
        // fabricCanvas.deactivateAll();
        // update flag
        flags.isCanvasEmpty = false;
        // call callback
        if(cb){
          cb(null);
        }
      }
      else {
        fabricCanvas.loadFromJSON(canvasJSON, function(){
          var objects = fabricCanvas.getObjects();
          var loadedImage;
          for(var i=0; i<objects.length; i++){
            var obj = objects[i];
            console.log("setting object at index: ",i);
            obj.set(fabricObjSettings);
            // reactivate settings
            switch(obj.customObjectType){
              case customObjectTypes.backgroundImage:
                loadedImage = obj.toDataURL();
                // position
                // scale
                // clipping
                // zoom
                zoomSlider.slider('setValue', obj.get('zoom'));
                console.log('Its a bkg image');
                if(selectedSectionIndex == -1){
                  console.log('DESIGN TOOL: Layout section is not selected, loading single image');
                  flags.isLayoutApplied = false;
                  // change bkg color
                  fabricCanvas.backgroundColor = '#cccccc';
                  // save fabric image instance
                  sectionBkgImages = [];
                  sectionBkgImages.push(obj);
                }
                break;
              case customObjectTypes.layout:
                flags.isLayoutApplied = true;
                break;
              case customObjectTypes.sticker:
                break;
              case customObjectTypes.text:
                break;
            }
            // update coords
            obj.setCoords();
          }
          // render
          fabricCanvas.renderAll();
          fabricCanvas.deactivateAll();
          // update flag
          flags.isCanvasEmpty = false;
          // call callback
          if(cb){
            cb(loadedImage);
          }
        });
      }
    }

    function getCanvasJSON(){
      var canvasJSON = fabricCanvas.toJSON(propsToIncludeForJSON);
      console.log('DESIGN TOOL: getCanvasJSON', canvasJSON);
      // TODO: any update in JSON, or any other process
      return canvasJSON;
    }

    function getCanvasDataUrl(){
      console.log('DESIGN TOOL: getCanvasDataUrl');
      // TODO: any update in other process
      return fabricCanvas.toDataURL();
    }

    function resetTool(){
      console.log('DESIGN TOOL: resetTool');
      currentLayoutSections = [];
      selectedSectionIndex = -1;
      selectedBorderIndex = 0;
      flags.isSectionSelected = false;
      hideObjectCustomizer();
      fabricCanvas.clear();
      fabricCanvas.renderAll();
      // call reset zoom also
      resetZoomSettings();
    }

    // ****************************************** Getter & setter ******************************************
    function getProp(key){
      return flags[key];
    }

    function setProp(key, value){
      if(typeof key == object){
        // TODO
      }
      else{
        flags[key] = value;
      }
    }

    // ****************************************** Toolbar methods ******************************************

    function applyBorder(cb){

      // only if layout is applied
      if(flags.isLayoutApplied){
        selectedBorderIndex++;
        if(selectedBorderIndex == customBorderTypes.length){
          selectedBorderIndex = 0;
        }
        console.log('DESIGN TOOL: applyBorder', customBorderTypes[selectedBorderIndex]);
        var objects = fabricCanvas.getObjects();
        for(var i=0; i<objects.length; i++){
          switch(objects[i].customObjectType){
            case customObjectTypes.layout:
              var border = objects[i].borders[customBorderTypes[selectedBorderIndex]];
              // create gap between layout sections which will work like borders
              objects[i].set({
                top: (fabricCanvas.getHeight()*objects[i].percentValues.top) + ((border.top.value)?Defaults.borderWidth*border.top.applyFactor:0),
                left: (fabricCanvas.getWidth()*objects[i].percentValues.left) + ((border.left.value)?Defaults.borderWidth*border.left.applyFactor:0),
                height: (fabricCanvas.getHeight()*objects[i].percentValues.height) - ((border.height.value)?Defaults.borderWidth*border.height.applyFactor:0),
                width: (fabricCanvas.getWidth()*objects[i].percentValues.width) - ((border.width.value)?Defaults.borderWidth*border.width.applyFactor:0)
              });
              cb(customBorderTypes[selectedBorderIndex]);
              break;
            case customObjectTypes.backgroundImage:
              break;
          }
        }
        fabricCanvas.renderAll();
      }
    }

    function flipHorizontal(){
      console.log('DESIGN TOOL: flipHorizontal');
      var object = fabricCanvas.getActiveObject();
      // if no object is selected and no layout is applied, select the background image
      if(!object && !flags.isLayoutApplied){
        object = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }
      if(object){
        switch(object.customObjectType){
          case customObjectTypes.backgroundImage:
          case customObjectTypes.sticker:
          case customObjectTypes.text:
            object.flipX = object.flipX ? false : true;
            break;
        }
      }
      // select background Image for Editing Event
      var backgroundImage;
      if(flags.isLayoutApplied){
        backgroundImage= findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }else {
        backgroundImage = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
      }
      customEvents.fire(customEventsList.imageEdited,backgroundImage);
      fabricCanvas.renderAll();
    }

    function flipVertical(){
      console.log('DESIGN TOOL: flipVertical');
      var object = fabricCanvas.getActiveObject();
      // if no object is selected and no layout is applied, select the background image
      if(!object && !flags.isLayoutApplied){
        object = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }
      if(object){
        switch(object.customObjectType){
          case customObjectTypes.backgroundImage:
          case customObjectTypes.sticker:
          case customObjectTypes.text:
            object.flipY = object.flipY ? false : true;
            break;
        }
      }
      // select background Image for Editing Event
      var backgroundImage;
      if(flags.isLayoutApplied){
        backgroundImage= findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }else {
        backgroundImage = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
      }
      customEvents.fire(customEventsList.imageEdited,backgroundImage);
      fabricCanvas.renderAll();
    }

    function rotateClockwise(){
      console.log('DESIGN TOOL: rotateClockwise');
      if(!flags.isActionPerformable){
        return;
      }
      var object= fabricCanvas.getActiveObject();
      var isBkgImg = false;
      // if no object is selected and no layout is applied, select the background image
      if(!object && !flags.isLayoutApplied){
        object = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
        object.center();
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }
      switch(object.customObjectType){
        case customObjectTypes.backgroundImage:
          isBkgImg = true;
        //object.center();
        case customObjectTypes.sticker:
        case customObjectTypes.text:
          flags.isActionPerformable = false;
          object.animate('angle', object.angle+(-90), {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              flags.isActionPerformable = true;
              if(isBkgImg){
                backgroundImageBoundaryCheck(object);
                //fixBackgroundScalingAndLocking(object);
              }
              object.setCoords();
            }
          });
          // select background Image for Editing Event
          var backgroundImage;
          if(flags.isLayoutApplied){
            backgroundImage= findByProps({
              sectionIndex: selectedSectionIndex,
              customObjectType: customObjectTypes.backgroundImage
            })
          }else {
            backgroundImage = findByProps({
              customObjectType: customObjectTypes.backgroundImage
            });
          }
          customEvents.fire(customEventsList.imageEdited,backgroundImage);
          break;
      }
    }

    function rotateAntiClockwise(){
      console.log('DESIGN TOOL: rotateAntiClockwise');
      if(!flags.isActionPerformable){
        return;
      }
      var object= fabricCanvas.getActiveObject();
      var isBkgImg = false;
      // if no object is selected and no layout is applied, select the background image
      if(!object && !flags.isLayoutApplied){
        object = findByProps({
          customObjectType: customObjectTypes.backgroundImage
        });
        object.center();
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        })
      }
      switch(object.customObjectType){
        case customObjectTypes.backgroundImage:
          isBkgImg = true;
        case customObjectTypes.sticker:
        case customObjectTypes.text:
          flags.isActionPerformable = false;
          object.animate('angle', object.angle+(90), {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              flags.isActionPerformable = true;
              if(isBkgImg){
                backgroundImageBoundaryCheck(object);
                //fixBackgroundScalingAndLocking(object);
              }
              object.setCoords();
            }
          });
          // select background Image for Editing Event
          var backgroundImage;
          if(flags.isLayoutApplied){
            backgroundImage= findByProps({
              sectionIndex: selectedSectionIndex,
              customObjectType: customObjectTypes.backgroundImage
            })
          }else {
            backgroundImage = findByProps({
              customObjectType: customObjectTypes.backgroundImage
            });
          }
          customEvents.fire(customEventsList.imageEdited,backgroundImage);
          break;
      }
    }

    // ****************************************** Left sidemenu methods ******************************************

    function applyFilter(filter, cb){
      console.log('DESIGN TOOL: applyFilter');
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


          var img = new Image();

          img.onload = function() {
            var imgObj;
            if(flags.isLayoutApplied){
              imgObj = findByProps({
                sectionIndex: selectedSectionIndex,
                customObjectType: customObjectTypes.backgroundImage
              })
            }
            else{
              imgObj = findByProps({
                customObjectType: customObjectTypes.backgroundImage
              })
            }
            // if(!imgObj){
            //   cb(false);
            //   return;
            // }


            // update img on canvas
            imgObj.setElement(img);
            // update current filter
            imgObj.set('currentFilter', filter);
            cb(true);
            fabricCanvas.renderAll();
            // firing edited image event
            customEvents.fire(customEventsList.imageEdited,imgObj);
          };
          img.src = this.toBase64();
        });
      });
    }

    function applySticker(sticker){
      console.log('DESIGN TOOL: applySticker');
      if(sticker.url && sticker.isActive){
        var img = new Image();
        img.src = sticker.url;
        img.onload = function() {
          var fabricStickerInstance = new fabric.Image(img, {
            id: (new Date().getTime() / 1000),
            customObjectType: customObjectTypes.sticker
          });
          fabricStickerInstance.set(fabricObjSettings);
          fabricCanvas.add(fabricStickerInstance);
          fabricStickerInstance.center();
          fabricStickerInstance.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.setActiveObject(fabricStickerInstance);
        };
        // select background Image for Editing Event
        var backgroundImage;
        if(flags.isLayoutApplied){
          backgroundImage= findByProps({
            sectionIndex: selectedSectionIndex,
            customObjectType: customObjectTypes.backgroundImage
          })
        }else {
          backgroundImage = findByProps({
            customObjectType: customObjectTypes.backgroundImage
          });
        }
        customEvents.fire(customEventsList.imageEdited,backgroundImage);
      }
    }

    function applyText(text){
      console.log('DESIGN TOOL: applyText');
      if(text.url && text.isActive){
        var fabricText = new fabric.IText('Add Heading', {
          id: (new Date().getTime() / 1000),
          fontFamily: text.name,
          customObjectType: customObjectTypes.text
        });
        fabricText.editingBorderColor = '#65e0e4';
        fabricText.setColor('white');
        //fabricText.enterEditing();
        //fabricText.hiddenTextarea.focus();
        fabricText.set(fabricObjSettings);
        fabricCanvas.add(fabricText);
        fabricText.center();
        fabricText.setCoords();
        fabricCanvas.renderAll();
        fabricCanvas.setActiveObject(fabricText);

        // select background Image for Editing Event
        var backgroundImage;
        if(flags.isLayoutApplied){
          backgroundImage= findByProps({
            sectionIndex: selectedSectionIndex,
            customObjectType: customObjectTypes.backgroundImage
          })
        }else {
          backgroundImage = findByProps({
            customObjectType: customObjectTypes.backgroundImage
          });
        }
        customEvents.fire(customEventsList.imageEdited,backgroundImage);
      }

    }

    function applyLayout(layout, cb){
      console.log('DESIGN TOOL: applyLayout', layout);
      console.log("sectionBkgImages: ", sectionBkgImages);
      var layoutSectionsCloned = angular.copy(layout.data);
      // change bkg color
      fabricCanvas.backgroundColor = 'white';
      // straighten the sectionBkgImages array
      sectionBkgImages = straightArray(sectionBkgImages, layoutSectionsCloned.length);
      // empty local layout sections
      // clear canvas
      // hide customizer
      resetTool();
      var cbCalled = false;
      // apply layout
      layoutSectionsCloned.forEach(function(elem, index){
        // convert the percentage values to pixel values
        elem.top = fabricCanvas.getHeight()*elem.percentValues.top;
        elem.left = fabricCanvas.getWidth()*elem.percentValues.left;
        elem.height = fabricCanvas.getHeight()*elem.percentValues.height;
        elem.width = fabricCanvas.getWidth()*elem.percentValues.width;
        // add the clipping rect to canvas
        var clipRect = new fabric.Rect(elem);
        clipRect.set({
          clipFor: 'bkgImage'+currentLayoutSections.length,
          alwaysBack: true,
          customObjectType: customObjectTypes.layout,
          sectionIndex: index
        });
        // push to local layout sections
        currentLayoutSections.push(clipRect);
        fabricCanvas.add(clipRect);
        // if bkg image is present add it too
        if(typeof sectionBkgImages[currentLayoutSections.length-1] !== 'undefined'){
          sectionBkgImages[currentLayoutSections.length-1] = addBkgImageToSection(sectionBkgImages[currentLayoutSections.length-1], currentLayoutSections.length-1);
          fabricCanvas.add(sectionBkgImages[currentLayoutSections.length-1]);
          // render
          fabricCanvas.renderAll();
          fabricCanvas.deactivateAll();
          // if last layout
          if(index == layoutSectionsCloned.length-1){
            if(cb && !cbCalled){
              cbCalled = true;
              cb();
            }
          }
        }
        // add the plus icon to rectangle
        else{
          var pugImg = new Image();
          pugImg.onload = function(img){
            (function(img, elem, index){
              var pug = new fabric.Image(pugImg, {
                angle: 0,
                width: Defaults.plusIconSizeForLayoutSections,
                height: Defaults.plusIconSizeForLayoutSections,
                left: elem.left + elem.width/2 - Defaults.plusIconSizeForLayoutSections/2,
                top: elem.top + elem.height/2 - Defaults.plusIconSizeForLayoutSections/2,
                scaleX: 1,
                scaleY: 1,
                selectable: false,
                hasControls: false,
                hasBorders: false,
                customObjectType: customObjectTypes.layoutPlusSign,
                sectionIndex: index
              });
              fabricCanvas.add(pug);
              // render
              fabricCanvas.renderAll();
              fabricCanvas.deactivateAll();
              // if last layout
              if(index == layoutSectionsCloned.length-1){
                if(cb && !cbCalled){
                  cbCalled = true;
                  cb();
                }
              }
            }(img, elem, index));
          };
          pugImg.src = 'images/white-cross.png';
        }
      });
      flags.isLayoutApplied = true;
    }

    function straightArray(arr, needed) {
      var toReturn = [];
      for (var i = 0; i < arr.length && toReturn.length < needed; i++) {
        if (typeof arr[i] !== 'undefined') {
          toReturn.push(arr[i]);
        }
      }
      return toReturn;
    }

    // ****************************************** Customizer methods ******************************************

    function objectCustomizer(obj){
      console.log('DESIGN TOOL: objectCustomizer');
      //console.log("Customize Object: ",obj);
      // capture control
      var customizerControl = $('.text-editor-parent');
      // weather to open or not
      switch(obj.customObjectType){
        case customObjectTypes.text:
          //console.log("opening customizer");
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
        case customObjectTypes.sticker:
          // its sticker
          //console.log("hide unnecessary control");
          // hide unnecessary control
          customizerControl.find('.size-picker').css('display', 'none');
          customizerControl.find('.ptt-dropmenu').css('display', 'none');
          customizerControl.find('.vertical-partition').css('display', 'none');
          //console.log("opening customizer");
          // show control
          customizerControl.css({
            'visibility': 'visible',
            'opacity': 1
          });
          break;
        default:
          customizerControl.css({
            'visibility': 'hidden',
            'opacity': 0
          });
          break;
      }
      // position customizer control
      var customizerTop = obj.top - (obj.height/2) - parseInt(customizerControl.css('height').replace('px', '')) - 52;
      if(customizerTop-10 <= 0 ){
        customizerTop = obj.top + (obj.height/2) + 10;
      }
      customizerControl.css('left', obj.left - customizerControl.width()/2);
      customizerControl.css('top', customizerTop);
    }

    function updateTextSize(){
      console.log('DESIGN TOOL: updateTextSize');
      var customizerControl = $('.text-editor-parent');
      var sizePickerValue = customizerControl.find('.size-picker').val();
      fabricCanvas.getActiveObject().setFontSize(sizePickerValue);
      fabricCanvas.renderAll();
    }

    function updateTextColor(elemIndex){
      console.log('DESIGN TOOL: updateTextColor');
      var customizerControl = $('.text-editor-parent');
      var currentColorLi = customizerControl.find('.ptt-dropdown-color-3');
      var list = customizerControl.find('.ptt-dropdown-color-2');
      var selectedColor = $(list[elemIndex]).css('background-color');
      //console.log("update color", selectedColor);
      fabricCanvas.getActiveObject().setColor(selectedColor);
      fabricCanvas.renderAll();
      // switch color
      $(currentColorLi).css('background-color', selectedColor);
    }

    function deleteSelectedObject(){
      console.log('DESIGN TOOL: deleteSelectedObject');
      var selectedElem = fabricCanvas.getActiveObject();
      if(selectedElem!=null){
        hideObjectCustomizer();
        selectedElem.remove();
        fabricCanvas.renderAll();
      }
    }

    function copySelectedObject(){
      console.log('DESIGN TOOL: copySelectedObject');
    }

    function hideObjectCustomizer(){
      console.log('DESIGN TOOL: hideObjectCustomizer');
      // capture control
      var customizerControl = $('.text-editor-parent');
      // hide
      customizerControl.css({
        'visibility': 'hidden',
        'opacity': 0
      });
    }

    // ****************************************** Fabric events ******************************************

    function bindFabricEvents(){
      console.log('DESIGN TOOL: bindFabricEvents');
      fabricCanvas.on({
        'mouse:down': function(event){
          customEvents.fire(customEventsList.layoutSectionToggle, obj);
          console.log("mouse:down");
          var obj = event.target;
          if(obj){
            switch(obj.customObjectType){
              case customObjectTypes.layoutPlusSign:
                // change to layout obj
                obj = findByProps({
                  sectionIndex: obj.sectionIndex,
                  customObjectType: customObjectTypes.layout
                });
              case customObjectTypes.layout:
                if(flags.isLayoutApplied)selectLayoutSection(obj);
                var bkgimg = findByProps({
                  sectionIndex: selectedSectionIndex,
                  customObjectType: customObjectTypes.backgroundImage
                });
                if(bkgimg) {
                  zoomSlider.slider('setValue', bkgimg.get('zoom'));
                  customEvents.fire(customEventsList.imageSelected, obj);
                  if(!flags.isSectionSelected){
                    bkgimg.lockMovementX = true;
                    bkgimg.lockMovementY = true;
                  }
                  else{
                    bkgimg.lockMovementX = false;
                    bkgimg.lockMovementY = false;
                  }
                }
                else{
                  zoomSlider.slider('setValue', Defaults.zoom);
                }
                break;
              case customObjectTypes.backgroundImage:
                console.log("BKG IMAGE");
                if(flags.isLayoutApplied){
                  selectLayoutSection(obj);
                  if(!flags.isSectionSelected){
                    obj.lockMovementX = true;
                    obj.lockMovementY = true;
                  }
                  else{
                    obj.lockMovementX = false;
                    obj.lockMovementY = false;
                  }
                }
                zoomSlider.slider('setValue', obj.get('zoom'));
                customEvents.fire(customEventsList.imageSelected, obj);
                break;
              case customObjectTypes.text:
                if(obj.isEditing){
                  // set it to true
                  flags.textInEdtitingMode = true;
                  return;
                }
            }
            flags.textInEdtitingMode = false;
            obj.opacity = 0.5;
            currentSelectedObject = obj;
            fabricCanvas.renderAll();
          }
          //if(textInEdtitingMode){
          //  //console.log("Editing mode is ON, returning");
          //  return;
          //}
          //if(obj){
          //  if(!obj.selectable){
          //    return;
          //  }
          //  vm.selectedObject = obj;
          //  objectCustomizer(vm.selectedObject);
          //  fabricCanvas.renderAll();
          //}
        },
        'mouse:move': function(event){

        },
        'mouse:up': function(event){
          console.log("mouse:up");
          customEvents.fire(customEventsList.layoutSectionToggle, obj);
          if(currentSelectedObject) currentSelectedObject.opacity = 1;
          var obj = event.target;
          if(flags.textInEdtitingMode){
            return;
          }
          if(obj){
            obj.opacity = 1;
            switch(obj.customObjectType){
              case customObjectTypes.layout:
              case customObjectTypes.layoutPlusSign:
                break;
              case customObjectTypes.backgroundImage:
                console.log("b");
                if(!flags.isLayoutApplied) fabricCanvas.sendToBack(obj);
                fabricCanvas.deactivateAll();
                break;
              default:
                console.log("c");
                var newIndex = fabricCanvas.getObjects().length;
                fabricCanvas.moveTo(obj, newIndex);
                fabricCanvas.setActiveObject(obj);
                break;
            }
          }
        },
        'mouse:over': function(event){

        },
        'mouse:out': function(event){

        },
        'selection:cleared': function(event){
          var obj = event.target;
          if(obj){
            hideObjectCustomizer();
          }
        },
        'selection:created': function(event){

        },
        'path:created': function(event){

        },
        'before:selection:cleared': function(event){

        },
        'object:modified': function(event){
          console.log("object:modified");
          var obj = event.target;
          switch(obj.customObjectType){
            case customObjectTypes.layoutPlusSign:
            case customObjectTypes.layout:

              break;
            case customObjectTypes.backgroundImage:
              if(flags.isSectionSelected || !flags.isLayoutApplied) backgroundImageBoundaryCheck(obj);
              fabricCanvas.deactivateAll();
              break;
          }
          fabricCanvas.renderAll();
        },
        'object:rotating': function(event){

        },
        'object:scaling': function(event){

        },
        'object:moving': function(event){
          var obj = event.target;
          if(obj){
            switch(obj.customObjectType){
              case customObjectTypes.sticker:
              case customObjectTypes.text:
                objectCustomizer(obj);
                break;
            }
          }
        },
        'object:selected': function(event){
          var obj = event.target;
          if(flags.textInEdtitingMode){
            return;
          }
          if(obj){
            switch(obj.customObjectType){
              case customObjectTypes.sticker:
              case customObjectTypes.text:
                objectCustomizer(obj);
                break;
              default:
                hideObjectCustomizer();
            }
            fabricCanvas.renderAll();
          }
        }
      })
    }

    // ****************************************** Custom events ******************************************

    function on(name, cb){
      customEvents.on(name, cb);
    }

    // ****************************************** Zoom methods ******************************************

    function resetZoomSettings(){
      console.log('DESIGN TOOL: resetZoomSettings');
      zoomSlider.slider('setValue', Defaults.zoom);
      sectionBkgImages.forEach(function(elem, index){
        elem.zoom = Defaults.zoom;
      })
    }

    // ****************************************** Boundary Check methods ******************************************

    // Background Image Boundary Check and Position Update
    function backgroundImageBoundaryCheck(obj) {
      console.log('DESIGN TOOL: backgroundImageBoundaryCheck');
      var bounds = obj.getBoundingRect();
      var area;
      var objBounds = obj.getBoundingRect();
      if (flags.isLayoutApplied) {
        bounds = currentLayoutSections[selectedSectionIndex].getBoundingRect();
        area = {
          top: currentLayoutSections[selectedSectionIndex].top,
          left: currentLayoutSections[selectedSectionIndex].left,
          width: currentLayoutSections[selectedSectionIndex].width,
          height: currentLayoutSections[selectedSectionIndex].height
        }
      }
      else {
        bounds = obj.getBoundingRect();
        area = {
          top: 0,
          width: fabricCanvas.getWidth(),
          height: fabricCanvas.getHeight()
        }
      }
      var keyPair = {
        key: null,
        value: null
      };
      var movement = {
        x: obj.lockMovementX,
        y: obj.lockMovementY
      };
      // Single Image
      if (!flags.isLayoutApplied) {
        // moving horizontally
        if (!movement.x) {
          if (bounds.left > 0) {
            //console.log("inside left bound");
            keyPair.key = 'left';
            keyPair.value = (bounds.width / fabricCanvas.getZoom()) / 2;
          }
          else if ((bounds.width + bounds.left) < area.width) {
            //console.log("inside right bound");
            keyPair.key = 'left';
            keyPair.value = (area.width - bounds.width / 2) / fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
        // moving vertically
        if (!movement.y) {
          if (bounds.top > 0) {
            //console.log("inside top bound");
            keyPair.key = 'top';
            keyPair.value = (bounds.height / fabricCanvas.getZoom()) / 2;
          }
          else if ((bounds.height + bounds.top) < area.height) {
            //console.log("inside bottom bound");
            keyPair.key = 'top';
            keyPair.value = (area.height - bounds.height / 2) / fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
      }
      // Layout
      else{
        // moving horizontally
        if(!movement.x){
          if(bounds.left < objBounds.left){
            //console.log("inside left bound");
            keyPair.key = 'left';
            if(flags.isLayoutApplied) keyPair.value = (bounds.left + objBounds.width/2) /fabricCanvas.getZoom();
          }
          else if((bounds.left + bounds.width) > (objBounds.left +objBounds.width)){
            //console.log("inside right bound");
            keyPair.key = 'left';
            if(flags.isLayoutApplied) keyPair.value = (bounds.left + bounds.width - objBounds.width/2)/fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
        // moving vertically
        if(!movement.y){
          if((bounds.top + bounds.height) > (objBounds.top + objBounds.height)){
            //console.log("inside top bound");
            keyPair.key = 'top';
            if(flags.isLayoutApplied) keyPair.value = (bounds.top + bounds.height -objBounds.height/2)/fabricCanvas.getZoom();
            console.log('values',keyPair.value);
          }
          else if(bounds.top < objBounds.top){
            //console.log("inside bottom bound");
            keyPair.key = 'top';
            if(flags.isLayoutApplied) keyPair.value = (bounds.top + objBounds.height/2)/fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
      }


      function setInBound(key, value){
        if(key){ // key.value could be 0 - lol :D
          flags.isActionPerformable = false;
          obj.lockMovementX = true;
          obj.lockMovementY = true;
          obj.animate(key, value, {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              //console.log("done");
              flags.isActionPerformable = true;
              obj.lockMovementX = movement.x;
              obj.lockMovementY = movement.y;
            }
          });
          obj.setCoords();
        }
      }

    }

    /************************************* KEYBOARD SHORTCUTS*************************************/

    function animateObject(obj, parameter, shiftFlag, ctrlFlag, subtractFlag){
      // Movement
      if(!shiftFlag){
        var animationValue = 1;
        animationValue+=ctrlFlag ? 20 : 0;
        var value = (subtractFlag)?(animationValue*-1):animationValue;
        obj.set(parameter, obj.get(parameter) + value);
      }
      // Rotation & don't rotate background images
      else if(shiftFlag && obj.customObjectType != customObjectTypes.backgroundImage){
        var animateValue = 10;
        var value = null;
        if(parameter == 'left' && !subtractFlag) value = animateValue;
        else if(parameter == 'left' && subtractFlag) value = animateValue*-1;
        if(value) obj.set('angle', obj.get('angle') + value);
      }
      objectCustomizer(obj);
      $timeout(function(){
        // boundary check not workiing here, IDK
        if(obj.customObjectType == customObjectTypes.backgroundImage){
          backgroundImageBoundaryCheck(obj);
        }
      });
      fabricCanvas.renderAll();
    }

    function bindKeyboardEvents(){
      return;
      $(window).keydown(function(e) {
        var key = window.event?window.event.keyCode:e.keyCode;
        var object = fabricCanvas.getActiveObject();
        if(!object){
          if(flags.isLayoutApplied && flags.isSectionSelected){
            object = findByProps({
              sectionIndex: selectedSectionIndex,
              customObjectType: customObjectTypes.backgroundImage
            })
          }
          else{
            object = findByProps({
              customObjectType: customObjectTypes.backgroundImage
            })
          }
          if(!object) return;
        }
        //keyboard shortcuts
        switch(object.customObjectType){
          case customObjectTypes.backgroundImage:
          case customObjectTypes.sticker:
          case customObjectTypes.text:
            switch (key) {
              case 46: // delete
                // don't delete background image
                if(object.customObjectType != customObjectTypes.backgroundImage)
                  deleteSelectedObject();
                break;
              case 37: // right
                animateObject(object, 'left', e.shiftKey, e.ctrlKey, true);
                break;
              case 38: // up
                animateObject(object, 'top', e.shiftKey, e.ctrlKey, true);
                break;
              case 39: // left
                animateObject(object, 'left', e.shiftKey, e.ctrlKey, false);
                break;
              case 40: // down
                animateObject(object, 'top', e.shiftKey, e.ctrlKey, false);
                break;
            }
            break;
        }
      });
    }

    // ****************************************** Other methods ******************************************

    function selectLayoutSection(obj, forcefullySelect){
      // deselect other sections
      for(var i=0; i<currentLayoutSections.length; i++){
        currentLayoutSections[i].set({
          strokeWidth: 0
        });
      }
      // select the new section if not already selected
      if(obj.sectionIndex != selectedSectionIndex || forcefullySelect){
        console.log("selecting");
        selectedSectionIndex = obj.sectionIndex;
        currentLayoutSections[selectedSectionIndex].set({
          strokeWidth: 2
        });
        flags.isSectionSelected = true;
      }
      // deselect
      else{
        console.log("deselecting");
        selectedSectionIndex = -1;
        flags.isSectionSelected = false;
        fabricCanvas.deactivateAll();
      }
    }

    function addBkgImageToSection(imgInstance, sectionIndex){
      // position
      imgInstance.set({
        top: currentLayoutSections[sectionIndex].top + currentLayoutSections[sectionIndex].height/2,
        left: currentLayoutSections[sectionIndex].left + currentLayoutSections[sectionIndex].width/2
      });
      // scale
      if(currentLayoutSections[sectionIndex].width > currentLayoutSections[sectionIndex].height){
        console.log('DESIGN TOOL: Scaled to Width');
        imgInstance.scaleToWidth(currentLayoutSections[sectionIndex].width);
      }
      else{
        console.log('DESIGN TOOL: Scaled to Height');
        imgInstance.scaleToHeight(currentLayoutSections[sectionIndex].height);
      }
      // apply clipping
      imgInstance.set({
        'sectionIndex': sectionIndex,
        'clipName': 'bkgImage'+sectionIndex,
        'clipTo': function(ctx) {
          return _.bind(clipByName, imgInstance)(ctx)
        }
      });
      // save original scale
      imgInstance.set('originalScale', {
        x: imgInstance.getScaleX(),
        y: imgInstance.getScaleY()
      });
      // update coords
      imgInstance.setCoords();
      // return imgInstance
      return imgInstance;
    }

    function degToRad(degrees) {
      return degrees * (Math.PI / 180);
    }

    function findByProps(props){
      return _(fabricCanvas.getObjects()).where(props).first();
    }

    function findByClipName(name) {
      return _(fabricCanvas.getObjects()).where({
        clipFor: name
      }).first()
    }

    function clipByName(ctx) {

      //console.log("DesignTool: clipByName", this);

      this.setCoords();
      var clipRect = findByClipName(this.clipName);
      var scaleXTo1 = (1 / this.scaleX);
      var scaleYTo1 = (1 / this.scaleY);
      ctx.save();

      //console.log("DesignTool: clipByName", clipRect);

      var ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
      var ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
      var ctxWidth = clipRect.width - clipRect.strokeWidth;
      var ctxHeight = clipRect.height - clipRect.strokeWidth;

      ctx.translate((this.flipX)?ctxLeft*-1:ctxLeft, (this.flipY)?ctxTop*-1:ctxTop);
      ctx.scale((this.flipX)?scaleXTo1*-1:scaleXTo1, (this.flipY)?scaleYTo1*-1:scaleYTo1);
      ctx.rotate(degToRad(this.angle * -1));

      ctx.beginPath();
      ctx.rect(
        clipRect.left - this.oCoords.tl.x,
        clipRect.top - this.oCoords.tl.y,
        ctxWidth,
        ctxHeight
      );
      ctx.closePath();
      ctx.restore();
    }

    function checkLayoutSelection(){
      var object = findByProps({
        sectionIndex: selectedSectionIndex,
        customObjectType: customObjectTypes.backgroundImage
      });
      if(flags.isLayoutApplied){
        if(flags.isSectionSelected){
          if(!object){
            return false;
          }
        }
        else{
          return false;
        }
      }
      return true;
    }
  }
}());
