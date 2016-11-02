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
      layoutPlusSign: 'LayoutPlusSign',
      strokeLine: 'StrokeLine'
    };
    const imageStudioTag = "#image-studio";
    const imageStudioElement = "#image-studio > .element";
    const imageStudioElementEditor = "#image-studio > .element > .editor";
    const zoombar = 'div.zoomBar';
    const toolBar = 'div.toolbar';
    const actionIcon5 = '.action-icons-5';
    const actionIcon4= '.action-icons-4';
    const canvasOrientations = {
      vertical: 'vertical',
      horizontal: 'horizontal'
    };
    const canvasTypes = {
      REGULAR : {
        name : 'regular',
        small : {
          horizontal : {
            width : 1800,
            height : 1200
          },
          vertical : {
            width : 1200,
            height : 1800
          }
        },
        medium : {
          horizontal : {
            width : 2100,
            height : 1500
          },
          vertical : {
            width : 1500,
            height : 2100
          }
        },
        large : {
          horizontal : {
            width : 2400,
            height : 1800
          },
          vertical : {
            width : 1800,
            height : 2400
          }
        }
      },
      SQUARE : {
        name : 'square',
        small : {
          dimensions : {
            width : 1200,
            height : 1200
          }
        },
        medium : {
          dimensions : {
            width : 1800,
            height : 1800
          }
        },
        large : {
          dimensions: {
            width: 2400,
            height: 2400
          }
        }
      },
      ENLARGE : {
        name :  'enlarge',
        small : {
          horizontal : {
            width : 3600,
            height : 2400
          },
          vertical : {
            width : 2400,
            height : 3600
          }
        },
        medium : {
          horizontal : {
            width : 3600,
            height : 3000
          },
          vertical : {
            width : 3000,
            height : 3600
          }
        },
        large : {
          horizontal : {
            width : 4800,
            height : 3600
          },
          vertical : {
            width : 3600,
            height : 4800
          }
        }
      }
    };
    const _canvasTypes = {
      REGULAR : {
        name : 'regular',
        sizes: {
          small : {
            name: 'small',
            initial: 'S',
            horizontal : {
              width : {
                px: 1800,
                inches: 6
              },
              height : {
                px: 1200,
                inches: 4
              },
              title: {
                inches: '6 x 4 inches'
              }
            },
            vertical : {
              width : {
                px: 1200,
                inches: 4
              },
              height : {
                px: 1800,
                inches: 6
              },
              title: {
                inches: '4 x 6 inches'
              }
            }
          },
          medium : {
            name: 'medium',
            initial: 'M',
            horizontal : {
              width : {
                px: 2100,
                inches: 7
              },
              height : {
                px: 1500,
                inches: 5
              },
              title: {
                inches: '7 x 5 inches'
              }
            },
            vertical : {
              width : {
                px: 1500,
                inches: 5
              },
              height : {
                px: 2100,
                inches: 7
              },
              title: {
                inches: '5 x 7 inches'
              }
            }
          },
          large : {
            name: 'large',
            initial: 'L',
            horizontal : {
              width : {
                px: 2400,
                inches: 8
              },
              height : {
                px: 1800,
                inches: 6
              },
              title: {
                inches: '8 x 6 inches'
              }
            },
            vertical : {
              width : {
                px: 1800,
                inches: 6
              },
              height : {
                px: 2400,
                inches: 8
              },
              title: {
                inches: '6 x 8 inches'
              }
            }
          }
        }
      },
      ENLARGE : {
        name :  'enlarge',
        sizes: {
          small: {
            name: 'small',
            initial: 'S',
            horizontal : {
              width : {
                px: 3600,
                inches: 12
              },
              height : {
                px: 2400,
                inches: 8
              },
              title: {
                inches: '12 x 8 inches'
              }
            },
            vertical : {
              width : {
                px: 2400,
                inches: 8
              },
              height : {
                px: 3600,
                inches: 12
              },
              title: {
                inches: '8 x 12 inches'
              }
            }
          },
          medium : {
            name: 'medium',
            initial: 'M',
            horizontal : {
              width : {
                px: 3600,
                inches: 12
              },
              height : {
                px: 3000,
                inches: 10
              },
              title: {
                inches: '12 x 10 inches'
              }
            },
            vertical : {
              width : {
                px: 3000,
                inches: 10
              },
              height : {
                px: 3600,
                inches: 12
              },
              title: {
                inches: '10 x 12 inches'
              }
            }
          },
          large : {
            name: 'large',
            initial: 'L',
            horizontal : {
              width : {
                px: 4800,
                inches: 16
              },
              height : {
                px: 3600,
                inches: 12
              },
              title: {
                inches: '16 x 12 inches'
              }
            },
            vertical : {
              width : {
                px: 3600,
                inches: 12
              },
              height : {
                px: 4800,
                inches: 16
              },
              title: {
                inches: '12 x 16 inches'
              }
            }
          }
        }
      },
      SQUARE : {
        name : 'square',
        sizes: {
          small: {
            name: 'small',
            initial: 'S',
            horizontal : {
              width : {
                px: 1200,
                inches: 4
              },
              height : {
                px: 1200,
                inches: 4
              },
              title: {
                inches: '4 x 4 inches'
              }
            },
            vertical : {
              width : {
                px: 1200,
                inches:4
              },
              height : {
                px: 1200,
                inches: 4
              },
              title: {
                inches: '4 x 4 inches'
              }
            }
          },
          medium : {
            name: 'medium',
            initial: 'M',
            horizontal : {
              width : {
                px: 1800,
                inches: 6
              },
              height : {
                px: 1800,
                inches: 6
              },
              title: {
                inches: '6 x 6 inches'
              }
            },
            vertical : {
              width : {
                px: 1800,
                inches: 6
              },
              height : {
                px: 1800,
                inches: 6
              },
              title: {
                inches: '6 x 6 inches'
              }
            }
          },
          large : {
            name: 'large',
            initial: 'L',
            horizontal : {
              width : {
                px: 2400,
                inches: 8
              },
              height : {
                px: 2400,
                inches: 8
              },
              title: {
                inches: '8 x 8 inches'
              }
            },
            vertical : {
              width : {
                px: 2400,
                inches: 8
              },
              height : {
                px: 2400,
                inches: 8
              },
              title: {
                inches: '8 x 8 inches'
              }
            }
          }
        }
      }
    };
    const customBorderTypes = [
      'noBorder', 'fullBorder', 'innerBorder', 'outerBorder'
    ];
    const Defaults = {
      zoom: 0,
      plusIconSizeForLayoutSections: 60,
      borderWidth: 8,
      stroke: 'rgb(101, 224, 228)',
      strokeWidth : 5,
      canvasType: 'square',
      canvasSize: 'small',
      canvasSizeOrientation: 'horizontal'
    };

    /*
     * Variables
     * */
    var currentLayoutSections = [];
    var sectionBkgImages = [];
    var selectedSectionIndex = -1;
    var selectedBorderIndex = 0;
    var currentLayout = null;
    var blueSelectedBoarderOffset =  5;
    // default canvas type and sizes
    var currentSelectedCanvasType =  Defaults.canvasType;
    var currentSelectedCanvasSize = Defaults.canvasSize;
    var currentSelectedCanvasOrientation = Defaults.canvasSizeOrientation;
    // flags
    var flags = {
      isCanvasEmpty: true,
      isSectionSelected: false,
      isLayoutApplied: false,
      isActionPerformable: true,
      droppedOnCanvas: false
    };

    // props to save
    var propsToIncludeForJSON = [
      'customObjectType', 'hasControls', 'hasBorders', 'selectable', 'borders',
      'clipName', 'clipFor', 'originalScale', 'zoom', 'sectionIndex', 'percentValues', 'selectedBorder','originalWidth',
      'originalHeight', 'photoData'
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
    var scaleFactor;

    /*
     * Custom Events
     * */
    const customEventsList = {
      imageSelected: 'image:selected',
      imageEdited: 'image:edited',
      canvasDimensionChanged : 'canvas:dimensionChanged',
      imageCheckResolution : 'image:checkResolution',
      layoutSectionToggle: 'layout:sectionToggle'
    };
    // canvas parent div
    var element = {
      original:{
        height: 459,
        width: 459
      },
      current:{
        height: $(imageStudioElement).height(),
        width: $(imageStudioElement).width()
      },
      previous: {
        height: null,
        width: null
      }
    };
    var customEvents = new EventChannel();
    for (var event in customEventsList) {
      if (customEventsList.hasOwnProperty(event)) {
        customEvents.on(customEventsList[event], function(e){
          // console.log('DesignTool: Custom Event Fired: ' + e.name +', with data: ', e.data);
        });
      }
    }

    /* Return Functions*/
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
      emptyTool: emptyTool,
      deActivateAll: deActivateAll,
      // getter and setter
      getProp: getProp,
      setProp: setProp,
      getSeletedCanvasTypeAndSize : getSeletedCanvasTypeAndSize,
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
      checkLayoutSelection: checkLayoutSelection,
      deselectLayoutAllSections : deselectLayoutAllSections,
      // change Canvas
      getCanvasTypes: getCanvasTypes,
      getDefaultCanvasSizeDetails: getDefaultCanvasSizeDetails,
      updateImageEditorSize : updateImageEditorSize,
      updateImageEditorForCanvasChange : updateImageEditorForCanvasChange,
      checkResolution: checkResolution,
      //drag and drop events
      // others
      findItemSizeDetails: findItemSizeDetails
    };

    /* Define Functions */

    // ****************************************** Helper methods ******************************************

    function initializeTool(canvasId){
      // console.log('DESIGN TOOL: initializeTool');
      // initialize fabric canvas
      fabricCanvas = new fabric.Canvas(canvasId);
      fabricCanvas.renderOnAddRemove = false;
      fabricCanvas.perPixelTargetFind = true;
    }

    function onDOMLoad(){
      // console.log('DESIGN TOOL: onDOMLoad');
      setDimensions(element.original);
      fabricCanvas.selectionColor = 'rgba(101,224,228,0.5)';
      fabricCanvas.selectionBorderColor = 'white';
      fabricCanvas.selectionLineWidth = 1;
      // disable group selection
      fabricCanvas.selection = false;
      fabricCanvas.renderAll();
      // bind fabric events to tool as well
      bindFabricEvents();
      bindDOMEvents();
      // bind keyboard events
      bindKeyboardEvents();
    }

    function updateImageEditorSize(){
      //customEvents.fire(customEventsList.imageCheckResolution, true);
      var imageStudio = {
        height: $(imageStudioTag).height(),
        width: $(imageStudioTag).width()
      };
      var updateValue = 0;

      // Formula for aspect ratio equality calculation
      // (original height / original width) = (new height / new width)

      // if image studio height is small
      if(imageStudio.height < imageStudio.width){
        // new width = (new height)/(original height / original width)
        updateValue = (imageStudio.height)/(element.original.height/element.original.width);
        ////// console.log("height is small");
      }
      // else if image studio width is small
      else if(imageStudio.width < imageStudio.height){
        // new height = (original height / original width) x (new width)
        updateValue = (element.original.height/element.original.width) * (imageStudio.width);
        ////// console.log("width is small");
      }

      // update css
      ////// console.log("change height and width to: ", updateValue);
      $(imageStudioElement).width(updateValue);
      $(imageStudioElement).height(updateValue);
      $(imageStudioElement).css({
        'margin-left': '-' + Number((updateValue/2)+33) + 'px',
        'left': '50%'
      });

      // set zoom and dimensions of canvas
      // got from canvas test
      scaleFactor = updateValue/element.original.width;
      //// console.log("--- FACTOR SCALE ---", scaleFactor);
      setDimensions({
        width: updateValue,
        height: updateValue
      });
      element.previous.height = updateValue;
      element.previous.width = updateValue;
      element.current.height = updateValue;
      element.current.width = updateValue;
    }

    function updateImageEditorForCanvasChange(canvasType, canvasSize, canvasOrientation, noRecalculation, cb){
      var updateHeight = 0;
      var updateWidth = 0;
      var imageStudio = {
        width : $(imageStudioTag).width(),
        height : $(imageStudioTag).height()
      };
      canvasType = canvasType || currentSelectedCanvasType;
      currentSelectedCanvasType = canvasType;
      currentSelectedCanvasSize = canvasSize || currentSelectedCanvasSize;
      // Formula for aspect ratio equality calculation
      // (original height / original width) = (new height / new width)

      switch (canvasType){
        case canvasTypes.ENLARGE.name :
        case canvasTypes.REGULAR.name :
          if(flags.isLayoutApplied) {
            // if(noRecalculation){
            //
            // }else {
              // if image  width is small go for vertical canvas
              console.log('canvasOrientation ',canvasOrientation);
              if(canvasOrientation === canvasOrientations.vertical){
                currentSelectedCanvasOrientation = canvasOrientations.vertical;
                // new height = (original height / original width) x (new width)
                var selectedSize = canvasType == canvasTypes.REGULAR.name ? canvasTypes.REGULAR[currentSelectedCanvasSize].vertical: canvasTypes.ENLARGE[currentSelectedCanvasSize].vertical;
                if(imageStudio.width < imageStudio.height){
                  updateWidth =  imageStudio.width;
                  updateHeight = (updateWidth * selectedSize.height) / selectedSize.width;
                }
                else {
                  updateHeight =  imageStudio.height;
                  updateWidth = (updateHeight * selectedSize.width) / selectedSize.height;
                }
              }
              // else image  width is large go for horizontal canvas
              else {
                currentSelectedCanvasOrientation = canvasOrientations.horizontal;
                // new width = (new height)/(original height / original width)
                selectedSize = canvasType == canvasTypes.REGULAR.name ? canvasTypes.REGULAR[currentSelectedCanvasSize].horizontal: canvasTypes.ENLARGE[currentSelectedCanvasSize].horizontal;
                if(imageStudio.width < imageStudio.height){
                  updateWidth =  imageStudio.width;
                  updateHeight = (updateWidth * selectedSize.height) / selectedSize.width;
                }
                else {
                  updateHeight =  imageStudio.height;
                  updateWidth = (updateHeight * selectedSize.width) / selectedSize.height;
                }
              }
            // }
          }
         else {
          var fabricBkgImage = findByProps({
            customObjectType: customObjectTypes.backgroundImage
          });
            // if image  width is small go for vertical canvas
            if(fabricBkgImage.originalWidth < fabricBkgImage.originalHeight){
              currentSelectedCanvasOrientation = canvasOrientations.vertical;
              // new height = (original height / original width) x (new width)
              var selectedSize = canvasType == canvasTypes.REGULAR.name ? canvasTypes.REGULAR[currentSelectedCanvasSize].vertical: canvasTypes.ENLARGE[currentSelectedCanvasSize].vertical;
              if(imageStudio.width < imageStudio.height){
                updateWidth =  imageStudio.width;
                updateHeight = (updateWidth * selectedSize.height) / selectedSize.width;
              }
              else {
                updateHeight =  imageStudio.height;
                updateWidth = (updateHeight * selectedSize.width) / selectedSize.height;
              }
            }
            // else image  width is large go for horizontal canvas
            else {
              currentSelectedCanvasOrientation = canvasOrientations.horizontal;
              // new width = (new height)/(original height / original width)
              selectedSize = canvasType == canvasTypes.REGULAR.name ? canvasTypes.REGULAR[currentSelectedCanvasSize].horizontal: canvasTypes.ENLARGE[currentSelectedCanvasSize].horizontal;
              if(imageStudio.width < imageStudio.height){
                updateWidth =  imageStudio.width;
                updateHeight = (updateWidth * selectedSize.height) / selectedSize.width;
              }
              else {
                updateHeight =  imageStudio.height;
                updateWidth = (updateHeight * selectedSize.width) / selectedSize.height;
              }
            }
          }
          break;
        default :
          selectedSize = canvasTypes.SQUARE[currentSelectedCanvasSize].dimensions;
          if(imageStudio.width < imageStudio.height){
            updateWidth =  imageStudio.width;
            updateHeight = (updateWidth * selectedSize.height) / selectedSize.width;
          }
          else {
            updateHeight =  imageStudio.height;
            updateWidth = (updateHeight * selectedSize.width) / selectedSize.height;
          }
          break;
      }
      // update css
      ///// console.log("change height and width to: ", updateValue);
      $(imageStudioElement).width(updateWidth);
      $(imageStudioElement).height(updateHeight);
      $(imageStudioElement).css({
        'margin-left': '-' + Number((updateWidth/2)+33) + 'px',
        'left': '50%'
      });
      setDimensions({
        width:  updateWidth,
        height: updateHeight
      });
      element.previous.height = updateHeight;
      element.previous.width = updateWidth;
      if(!noRecalculation){
        if(flags.isLayoutApplied){
          reApplyLayouts(currentLayout);
        }
        else{
          updateScalingOfBkgImage();
          backgroundImageBoundaryCheck(sectionBkgImages[0]);
        }
      }
      else{
        fabricCanvas.renderAll();
      }
      if(cb){
        cb();
      }
    }

    function updateScalingOfBkgImage(){
      // save image orientation, default to vertical image
      var isHorizontal = false;
      var fabricImage = findByProps({
        customObjectType: customObjectTypes.backgroundImage
      });
      // zoom is equal to zero rescale the image if not then do nothing
      if(fabricImage.zoom === 0){
        if(fabricImage.originalWidth > fabricImage.originalHeight){
          // its a horizontal image
          isHorizontal = true;
        }
        // scale
        if(fabricImage.originalHeight < fabricImage.originalWidth){
          fabricImage.scaleToHeight(fabricCanvas.getHeight());
          if(fabricImage.originalWidth*fabricImage.scaleX < fabricCanvas.getWidth()){
            fabricImage.scaleToWidth(fabricCanvas.getWidth());
          }
        }
        else{
          fabricImage.scaleToWidth(fabricCanvas.getWidth());
          if(fabricImage.originalHeight*fabricImage.scaleY < fabricCanvas.getHeight()){
            fabricImage.scaleToHeight(fabricCanvas.getHeight());
          }
        }
      }
    }

    function updateScalingOfSectionImage(sectionIndex){
      // save image orientation, default to vertical image
      var isHorizontal = false;
      // save current section index and object
      var currSelectedSection = currentLayoutSections[sectionIndex];
      // deselect section for the image to calculate its width and height properly
      deselectLayoutAllSections();
      var imgInstance = findByProps({
        customObjectType: customObjectTypes.backgroundImage,
        sectionIndex: sectionIndex
      });
      if(imgInstance.originalWidth > imgInstance.originalHeight){
        // its a horizontal image
        isHorizontal = true;
      }

      // scale
      if(imgInstance.originalHeight < imgInstance.originalWidth){
        console.log('scale to height 1');
        imgInstance.scaleToHeight(currentLayoutSections[sectionIndex].height);
        // console.log('imgInstance.originalHeight*imgInstance.scaleY', imgInstance.originalHeight*imgInstance.scaleY);
        // console.log('currentLayoutSections[sectionIndex].width', currentLayoutSections[sectionIndex].width);
        if(imgInstance.originalWidth*imgInstance.scaleX < currentLayoutSections[sectionIndex].width){
          console.log('scale to width 2');
          imgInstance.scaleToWidth(currentLayoutSections[sectionIndex].width);
        }
      }
      else{
        console.log('scale to width 1');
        imgInstance.scaleToWidth(currentLayoutSections[sectionIndex].width);
        if(imgInstance.originalHeight*imgInstance.scaleY < currentLayoutSections[sectionIndex].height){
          console.log('scale to height 2');
          imgInstance.scaleToHeight(currentLayoutSections[sectionIndex].height);
        }
      }
      // select the section again to apply blue border
      selectLayoutSection(currSelectedSection);
    }

    function setDimensions(dimension){
      // console.log('DESIGN TOOL: setDimensions');
      fabricCanvas.setDimensions({
        width: dimension.width,
        height: dimension.height
      });
      fabricCanvas.renderAll();
      registerCanvasEvents();
    }

    function initializeZoomSlider(selector,imageIndex){
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
          customEvents.fire(customEventsList.imageEdited,null);
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
      // console.log('DESIGN TOOL: loadBkgImage', image);
      var img = new Image();
      img.onload = function(){
        // image settings
        var fabricImage;
        fabricImage = new fabric.Image(img, {
          customObjectType: customObjectTypes.backgroundImage,
          renderOnAddRemove: false,
          hasControls: false,
          zoom: Defaults.zoom,
          originalWidth : this.naturalWidth,
          originalHeight : this.naturalHeight,
          photoData  : {
            _id: image._id,
            url: image.url,
            extension: image.extension
          }
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
          // console.log('DESIGN TOOL: Layout section is not selected, loading single image');
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
          var canvasType = getCanvasTypeBasedOnOrientation(fabricImage);
          // change the canvas back to default on new single image load
          updateImageEditorForCanvasChange(canvasType);
        }
        /* Working With Layouts Sections */
        else{
          // console.log('DESIGN TOOL: Layout section is selected!');
          var indexToMoveImgTo = null;
          // save current section index and object
          var currSectionIndex = selectedSectionIndex;
          var currSelectedSection = currentLayoutSections[currSectionIndex];
          // deselect section for the image to calculate its width and height properly
          deselectLayoutAllSections();
          // position
          // scale
          // apply clipping
          fabricImage = addBkgImageToSection(fabricImage, currSectionIndex);
          // select the section again to apply blue border
          selectLayoutSection(currSelectedSection);
          // if there is already a background image, remove the previous one
          if(typeof sectionBkgImages[selectedSectionIndex] !== 'undefined'){
            indexToMoveImgTo = fabricCanvas.getObjects().indexOf(sectionBkgImages[selectedSectionIndex]);
            sectionBkgImages[selectedSectionIndex].remove();
          }
          // save fabric image instance to section index
          sectionBkgImages[selectedSectionIndex] = fabricImage;
          //// console.log(sectionBkgImages);
          // add to canvas
          fabricCanvas.add(fabricImage);
          // remove the plus sign image
          var plusSign = findByProps({
            sectionIndex: selectedSectionIndex,
            customObjectType: customObjectTypes.layoutPlusSign
          });
          if(plusSign) {
            indexToMoveImgTo = fabricCanvas.getObjects().indexOf(plusSign);
            plusSign.remove();
          }
          if(indexToMoveImgTo){
            // console.log("MOVING TO INDEX: ", indexToMoveImgTo);
            fabricCanvas.moveTo(fabricImage, indexToMoveImgTo);
          }
          // reset zoom to default
          resetZoomSettings();
          // send image to back (as there might be stickers and text present)
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
      };
      // img.src = image.base64;
        // get high res
        img.src = image.highResBase64
    }

    function loadFromJSON(canvasJSON,index, cb){
      console.log('DESIGN TOOL: loadFromJSON', canvasJSON);
      // by default make layout applied to false
      flags.isLayoutApplied = false;
      for(var i = 0;i<canvasJSON.objects.length;i++){
        if(canvasJSON.objects[i].customObjectType == customObjectTypes.layout){
          flags.isLayoutApplied = true;
          break;
        }
      }
      if(flags.isLayoutApplied){
        var loadedObjs = 0;
        currentLayout = canvasJSON.customSettings.currentLayout;
        fabricCanvas.backgroundColor="white";
        resetTool();
        // empty bkg images as well
        sectionBkgImages = [];
        var canvasJsonObjects = {};
        canvasJsonObjects[customObjectTypes.layout] = [];
        canvasJsonObjects[customObjectTypes.backgroundImage] = [];
        canvasJsonObjects[customObjectTypes.layoutPlusSign] = [];
        canvasJsonObjects[customObjectTypes.sticker] = [];
        canvasJsonObjects[customObjectTypes.text] = [];
        for(var j = 0;j<canvasJSON.objects.length;j++){
          switch (canvasJSON.objects[j].customObjectType){
            case customObjectTypes.layout :
              canvasJsonObjects[customObjectTypes.layout].push(canvasJSON.objects[j]);
              break;
            case customObjectTypes.layoutPlusSign:
              canvasJsonObjects[customObjectTypes.layoutPlusSign].push(canvasJSON.objects[j]);
              break;
            case customObjectTypes.backgroundImage :
              canvasJsonObjects[customObjectTypes.backgroundImage].push(canvasJSON.objects[j]);
              break;
            case customObjectTypes.sticker :
              canvasJsonObjects[customObjectTypes.sticker].push(canvasJSON.objects[j]);
              break;
            case customObjectTypes.text :
              canvasJsonObjects[customObjectTypes.text].push(canvasJSON.objects[j]);
              break
          }
        }
        var textArray = [];
        for(var prop in canvasJsonObjects){
          if(canvasJsonObjects.hasOwnProperty(prop)){
            switch (prop){
              case customObjectTypes.layout:
                for(var k = 0; k<canvasJsonObjects[prop].length;k++){
                  (function(layoutSection){
                    var clipRect = new fabric.Rect(layoutSection);
                    currentLayoutSections[clipRect.sectionIndex] = clipRect;
                    fabricCanvas.add(clipRect);
                    loadedObjs++;
                    if(loadedObjs == canvasJSON.objects.length){
                      continueRender(null,textArray);
                    }
                  }(canvasJsonObjects[prop][k]));
                }
                break;
              case customObjectTypes.backgroundImage:
                for(var b  = 0;b<canvasJsonObjects[prop].length;b++){
                  (function(bkgImage){
                    var img = new Image();
                    img.onload = function(){
                      var fabricImage = new fabric.Image(img, bkgImage);
                      // if bkg image (avoiding plus signs)
                      if(fabricImage.customObjectType == customObjectTypes.backgroundImage){
                        // apply clipping
                        fabricImage.clipTo = function(ctx) {
                          return _.bind(clipByName, fabricImage)(ctx);
                        };
                        // fabric default settings
                        fabricImage.set(fabricObjSettings);
                        // other settings from prev objects
                        fabricImage.set({
                          zoom: bkgImage.zoom
                        });
                        // set coords
                        fabricImage.setCoords();
                        // save fabric image instance to section index
                        sectionBkgImages[fabricImage.sectionIndex] = fabricImage;
                        // add to canvas
                        fabricCanvas.add(fabricImage);
                        loadedObjs++;
                        if(loadedObjs == canvasJSON.objects.length){
                          continueRender(null,textArray);
                        }
                      }
                    };
                    img.src = bkgImage.src;
                  }(canvasJsonObjects[prop][b]));
                }
                break;
              case customObjectTypes.layoutPlusSign:
                for(var a=0;a<canvasJsonObjects[prop].length;a++){
                  (function(plusSignImage){
                    var img = new Image();
                    img.src = plusSignImage.src;
                    var fabricImage = new fabric.Image(img, plusSignImage);
                    // add to canvas
                    fabricCanvas.add(fabricImage);
                    loadedObjs++;
                    if(loadedObjs == canvasJSON.objects.length){
                      continueRender(null,textArray);
                    }
                  }(canvasJsonObjects[prop][a]));
                }
                break;
              case customObjectTypes.sticker :
                for(var s=0; s<canvasJsonObjects[prop].length; s++){
                  (function(sticker){
                    var img = new Image();
                    img.onload = function(){
                      var fabricStickerImg = new fabric.Image(img, sticker);
                      // fabric default settings
                      fabricStickerImg.set(fabricObjSettings);
                      // set coords
                      fabricStickerImg.setCoords();
                      // add to canvas
                      fabricCanvas.add(fabricStickerImg);
                      // bring forward
                      fabricCanvas.bringForward(fabricStickerImg);
                      loadedObjs++;
                      if(loadedObjs == canvasJSON.objects.length){
                        continueRender(null,textArray);
                      }
                    };
                    img.src = sticker.src;
                  }(canvasJsonObjects[prop][s]));
                }
                break;
              case customObjectTypes.text :
                for(var t=0; t<canvasJsonObjects[prop].length; t++){
                  (function(text){
                    var fabricText = new fabric.IText('Add Heading', text);
                    // fabric default settings
                    fabricText.set(fabricObjSettings);
                    // set coords
                    fabricText.setCoords();
                    // add to canvas
                    fabricCanvas.add(fabricText);
                    textArray.push(fabricText);
                    // bring forward
                    fabricCanvas.bringForward(fabricText);
                    loadedObjs++;
                    if(loadedObjs == canvasJSON.objects.length){
                      continueRender(null,textArray);
                    }
                  }(canvasJsonObjects[prop][t]));
                }
                break;
              default :
                break;
            }
          }
        }
        currentSelectedCanvasType = canvasJSON.customSettings.canvasSizeDetails.type;
        updateImageEditorForCanvasChange(
          canvasJSON.customSettings.canvasSizeDetails.type,
          canvasJSON.customSettings.canvasSizeDetails.size,
          canvasJSON.customSettings.canvasSizeDetails.orientation,
          true
        );

      }
      else {
        // canvasJSON.objects[0].photoIndex = index;
        fabricCanvas.loadFromJSON(canvasJSON, function(){
          var objects = fabricCanvas.getObjects();
          var loadedImage;
          $timeout(function () {
            for(var i=0; i<objects.length; i++){
              var obj = objects[i];
              // console.log("setting object at index: ",i);
              obj.set(fabricObjSettings);
              // reactivate settings
              switch(obj.customObjectType){
                case customObjectTypes.backgroundImage:
                  loadedImage = obj.toDataURL();
                  // // fabric default settings
                  // position
                  // scale
                  // clipping
                  // zoom
                  zoomSlider.slider('setValue', obj.get('zoom'));
                  // console.log('Its a bkg image');
                  if(selectedSectionIndex == -1){
                    // console.log('DESIGN TOOL: Layout section is not selected, loading single image');
                    flags.isLayoutApplied = false;
                    // change bkg color
                    fabricCanvas.backgroundColor = '#cccccc';
                    // save fabric image instance
                    sectionBkgImages = [];
                    sectionBkgImages.push(obj);
                    // before loading resize the canvas to previous type
                    currentSelectedCanvasType = canvasJSON.customSettings.canvasSizeDetails.type;
                    updateImageEditorForCanvasChange(
                      canvasJSON.customSettings.canvasSizeDetails.type,
                      canvasJSON.customSettings.canvasSizeDetails.size
                    );
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
            }
              continueRender(loadedImage);
          });
        });
      }

      function continueRender(callbackArgToPass,textArray){
        // since in layouts backgroumd images take more time on loading and the text is load first which remain in back.
        if(textArray){
          bringAllTextToFront(textArray);
        }
        // render
        fabricCanvas.renderAll();
        fabricCanvas.deactivateAll();
        // update flag
        flags.isCanvasEmpty = false;
        // call callback
        if(cb){
          cb(callbackArgToPass);
        }
      }
    }
    function getCanvasJSON(){
      var canvasJSON = fabricCanvas.toJSON(propsToIncludeForJSON);
      canvasJSON.customSettings = {
        canvasSizeDetails: {
          type: currentSelectedCanvasType,
          size: currentSelectedCanvasSize,
          orientation: currentSelectedCanvasOrientation
        }
      };
      if(flags.isLayoutApplied){
        canvasJSON.customSettings.currentLayout = currentLayout;
      }
      return canvasJSON;
    }

    function getCanvasDataUrl(){
      // console.log('DESIGN TOOL: getCanvasDataUrl');
      // TODO: any update in other process
      return fabricCanvas.toDataURL();
    }

    function resetTool(){
      // console.log('DESIGN TOOL: resetTool');
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

    function emptyTool(){
      resetTool();
      flags.isCanvasEmpty = true;
      flags.isLayoutApplied = false;
      flags.isActionPerformable = true;
    }

    function deActivateAll(){
      fabricCanvas.deactivateAll();
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


    function applyBorder(cb, currentBorder, imageIndex){
      // first remove selected blue border
      deselectLayoutAllSections();
      //
      selectedBorderIndex=customBorderTypes.indexOf(currentBorder);
      var objects = fabricCanvas.getObjects();
      // only if layout is applied
      if(flags.isLayoutApplied){
        selectedBorderIndex++;
        if(selectedBorderIndex == customBorderTypes.length){
          selectedBorderIndex = 0;
        }
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
      }
      else{
        switch(objects[0].customObjectType){
          case customObjectTypes.layout:
            break;
          case customObjectTypes.backgroundImage:
            selectedBorderIndex=selectedBorderIndex==0 ? 3 : 0;
            if(customBorderTypes[selectedBorderIndex]=='outerBorder'){
              $('#canvas').addClass("single-image-border");
            }
            else if(customBorderTypes[selectedBorderIndex]=='noBorder'){
              $('#canvas').removeClass("single-image-border");
            }
            cb(customBorderTypes[selectedBorderIndex]);
            break;
        }
      }
      // firing edited image event
      customEvents.fire(customEventsList.imageEdited,imageIndex);
      fabricCanvas.renderAll();
    }

    function flipHorizontal(index){
      // console.log('DESIGN TOOL: flipHorizontal');
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
      customEvents.fire(customEventsList.imageEdited,index);
      fabricCanvas.renderAll();
    }

    function flipVertical(index){
      // console.log('DESIGN TOOL: flipVertical');
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
      customEvents.fire(customEventsList.imageEdited,index);
      fabricCanvas.renderAll();
    }

    function rotateClockwise(index){
      // console.log('DESIGN TOOL: rotateClockwise');
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
      else if(!object && !flags.isSectionSelected){
        return;
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        });
        if(!object) return;
      }
      switch(object.customObjectType){
        case customObjectTypes.backgroundImage:
          isBkgImg = true;
        //object.center();
        case customObjectTypes.sticker:
        case customObjectTypes.text:
          flags.isActionPerformable = false;
          // reset zoom first (due to different size issue, we have to reset it)
          resetZoomSettings();
          object.animate('angle', object.angle+(-90), {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              flags.isActionPerformable = true;
              if(isBkgImg) {
                // fix bkg image scaling
                if (flags.isLayoutApplied) {
                  updateScalingOfSectionImage(selectedSectionIndex);
                }
                else {
                  updateScalingOfBkgImage();
                }
                // adjust boundary
                backgroundImageBoundaryCheck(object);
              }
              // fire edited Image.
              customEvents.fire(customEventsList.imageEdited,index);
              object.setCoords();
              fabricCanvas.renderAll();
            }
          });
          break;
      }
    }

    function rotateAntiClockwise(index){
      // console.log('DESIGN TOOL: rotateAntiClockwise');
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
      else if(!object && !flags.isSectionSelected){
        return;
      }
      // if no object is selected but layout is applied, select the background image for the selected section
      else if(!object && flags.isLayoutApplied){
        object = findByProps({
          sectionIndex: selectedSectionIndex,
          customObjectType: customObjectTypes.backgroundImage
        });
        if(!object) return;
      }

      switch(object.customObjectType){
        case customObjectTypes.backgroundImage:
          isBkgImg = true;
        case customObjectTypes.sticker:
        case customObjectTypes.text:
          flags.isActionPerformable = false;
          // reset zoom first (due to different size issue, we have to reset it)
          resetZoomSettings();
          object.animate('angle', object.angle+(90), {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              flags.isActionPerformable = true;
              if(isBkgImg) {
                // fix bkg image scaling
                if (flags.isLayoutApplied) {
                  updateScalingOfSectionImage(selectedSectionIndex);
                }
                else {
                  updateScalingOfBkgImage();
                }
                // adjust boundary
                backgroundImageBoundaryCheck(object);
              }
              // fire edited Image.
              customEvents.fire(customEventsList.imageEdited,index);
              object.setCoords();
              fabricCanvas.renderAll();
            }
          });
          break;
      }
    }

    // ****************************************** Left sidemenu methods ******************************************

    function applyFilter(filter,index, cb){
      console.log('DESIGN TOOL: applyFilter', filter);
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
              // update zoom
              // resetZoomSettings();
            cb(true);
            fabricCanvas.renderAll();
            // firing edited image event
            customEvents.fire(customEventsList.imageEdited,index);
          };
          img.src = this.toBase64();
        });
      });
    }

    function applySticker(sticker,index){
      // console.log('DESIGN TOOL: applySticker');
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

          // deselect all layout sections
          if(flags.isLayoutApplied){
            deselectLayoutAllSections()
          }

          fabricCanvas.renderAll();
          fabricCanvas.setActiveObject(fabricStickerInstance);

        };
        // firing edited image event
        customEvents.fire(customEventsList.imageEdited,index);
      }
    }

    function applyText(text,index){
      // console.log('DESIGN TOOL: applyText');
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

        // deselect all layout sections
        if(flags.isLayoutApplied){
          deselectLayoutAllSections()
        }
        // firing edited image event
        customEvents.fire(customEventsList.imageEdited,index);
        fabricCanvas.renderAll();
        fabricCanvas.setActiveObject(fabricText);
      }

    }

    function applyLayout(layout, cb){
      // console.log('DESIGN TOOL: applyLayout', layout);
      if(flags.isLayoutApplied){
        if(currentLayout.name === layout.name){
          resetTool();
          currentLayout = null;
          flags.isLayoutApplied = false;
          cb(true);
          return;
        }
      }
      currentLayout = layout;
      var stickerAndText = extractStickersAndTexts();
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
          // if last layout
          if(index == layoutSectionsCloned.length-1){
            loadStickersAndTexts(stickerAndText);
            // render
            fabricCanvas.renderAll();
            fabricCanvas.deactivateAll();
            if(cb && !cbCalled){
              cbCalled = true;
              cb(false);
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
              // if last layout
              if(index == layoutSectionsCloned.length-1){
                loadStickersAndTexts(stickerAndText);
                // render
                fabricCanvas.renderAll();
                fabricCanvas.deactivateAll();
                if(cb && !cbCalled){
                  cbCalled = true;
                  cb(false);
                }
              }
            }(img, elem, index));
          };
          pugImg.src = 'images/white-cross.png';
        }
      });
      flags.isLayoutApplied = true;
    }

    function reApplyLayouts(layout) {
      currentLayout = layout;
      var stickerAndText = extractStickersAndTexts();
      var layoutSectionsCloned = angular.copy(layout.data);
      // change bkg color
      fabricCanvas.backgroundColor = 'white';
      // straighten the sectionBkgImages array
      sectionBkgImages = straightArray(sectionBkgImages, layoutSectionsCloned.length);
      // empty local layout sections
      // clear canvas
      // hide customizer
      resetTool();
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
          // backgroundImageBoundaryCheck(sectionBkgImages[currentLayoutSections.length-1]);
          if(index == layoutSectionsCloned.length-1){
            loadStickersAndTexts(stickerAndText);
            // render
            fabricCanvas.renderAll();
            fabricCanvas.deactivateAll();
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
              // if last layout
              if(index == layoutSectionsCloned.length-1){
                loadStickersAndTexts(stickerAndText);
                // render
                fabricCanvas.renderAll();
                fabricCanvas.deactivateAll();
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
      // console.log('DESIGN TOOL: objectCustomizer');
      //// console.log("Customize Object: ",obj);
      // capture control
      var customizerControl = $('.text-editor-parent');

      console.log(customizerControl);

      // weather to open or not
      switch(obj.customObjectType){
        case customObjectTypes.text:
          // console.log("opening customizer");
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
          //// console.log("hide unnecessary control");
          // hide unnecessary control
          customizerControl.find('.size-picker').css('display', 'none');
          customizerControl.find('.ptt-dropmenu').css('display', 'none');
          customizerControl.find('.vertical-partition').css('display', 'none');
          //// console.log("opening customizer");
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
      // console.log('DESIGN TOOL: updateTextSize');
      var customizerControl = $('.text-editor-parent');
      var sizePickerValue = customizerControl.find('.size-picker').val();
      fabricCanvas.getActiveObject().setFontSize(sizePickerValue);
      fabricCanvas.renderAll();
    }

    function updateTextColor(elemIndex){
      // console.log('DESIGN TOOL: updateTextColor');
      var customizerControl = $('.text-editor-parent');
      var currentColorLi = customizerControl.find('.ptt-dropdown-color-3');
      var list = customizerControl.find('.ptt-dropdown-color-2');
      var selectedColor = $(list[elemIndex]).css('background-color');
      //// console.log("update color", selectedColor);
      fabricCanvas.getActiveObject().setColor(selectedColor);
      fabricCanvas.renderAll();
      // switch color
      $(currentColorLi).css('background-color', selectedColor);
    }

    function deleteSelectedObject(){
      // console.log('DESIGN TOOL: deleteSelectedObject');
      var selectedElem = fabricCanvas.getActiveObject();
      if(selectedElem!=null){
        hideObjectCustomizer();
        selectedElem.remove();
        fabricCanvas.renderAll();
      }
    }

    function copySelectedObject(){
      // console.log('DESIGN TOOL: copySelectedObject');
    }

    function hideObjectCustomizer(){
      // // console.log('DESIGN TOOL: hideObjectCustomizer');
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
      // console.log('DESIGN TOOL: bindFabricEvents');
      fabricCanvas.on({
        'mouse:down': function(event){
          var obj = event.target;
          if(obj){
            customEvents.fire(customEventsList.layoutSectionToggle, obj);
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
                // // console.log("BKG IMAGE");
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
              case customObjectTypes.sticker:
                if(flags.isLayoutApplied){
                  deselectLayoutAllSections();
                }
                break;
              case customObjectTypes.text:
                if(flags.isLayoutApplied){
                  deselectLayoutAllSections();
                }
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
        },
        'mouse:move': function(event){

        },
        'mouse:up': function(event){
          // // console.log("mouse:up");
          if(currentSelectedObject) currentSelectedObject.opacity = 1;
          var obj = event.target;
          if(flags.textInEdtitingMode){
            return;
          }
          if(obj){
            customEvents.fire(customEventsList.layoutSectionToggle, obj);
            obj.opacity = 1;
            switch(obj.customObjectType){
              case customObjectTypes.layout:
              case customObjectTypes.layoutPlusSign:
                break;
              case customObjectTypes.backgroundImage:
                if(!flags.isLayoutApplied) fabricCanvas.sendToBack(obj);
                fabricCanvas.deactivateAll();
                break;
              default:
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
          // console.log("object:modified");
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
          customEvents.fire(customEventsList.imageEdited,null);
          fabricCanvas.renderAll();
        },
        'object:rotating': function(event){

        },
        'object:scaling': function(event){

        },
        'object:moving': function(event){
          var obj = event.target;
          // console.log("standing at object moving: ", obj);
          if(obj){
            switch(obj.customObjectType){
              case customObjectTypes.sticker:
              case customObjectTypes.text:
                objectCustomizer(obj);
                customEvents.fire(customEventsList.imageEdited,null);
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
    // ****************************************** Custom DOM Events ******************************************

    function bindDOMEvents() {
      var imageStudio = angular.element(imageStudioTag);
      imageStudio.bind('mousedown',function ($event) {
        var element = $event.toElement;
        if('#'+element.id === imageStudioTag ){
          deselectLayoutAllSections();
        }
      });
    }

    // ****************************************** Zoom methods ******************************************

    function resetZoomSettings(){
      // console.log('DESIGN TOOL: resetZoomSettings');
      zoomSlider.slider('setValue', Defaults.zoom);
      sectionBkgImages.forEach(function(elem, index){
        elem.zoom = Defaults.zoom;
      })
    }

    // ****************************************** Boundary Check methods ******************************************

    // Background Image Boundary Check and Position Update
    function backgroundImageBoundaryCheck(obj) {
      // console.log('DESIGN TOOL: backgroundImageBoundaryCheck',obj);
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
        };
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
            //// console.log("inside left bound");
            keyPair.key = 'left';
            keyPair.value = (bounds.width / fabricCanvas.getZoom()) / 2;
          }
          else if ((bounds.width + bounds.left) < area.width) {
            //// console.log("inside right bound");
            keyPair.key = 'left';
            keyPair.value = (area.width - bounds.width / 2) / fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
        // moving vertically
        if (!movement.y) {
          if (bounds.top > 0) {
            //// console.log("inside top bound");
            keyPair.key = 'top';
            keyPair.value = (bounds.height / fabricCanvas.getZoom()) / 2;
          }
          else if ((bounds.height + bounds.top) < area.height) {
            //// console.log("inside bottom bound");
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
            //// console.log("inside left bound");
            keyPair.key = 'left';
            if(flags.isLayoutApplied) keyPair.value = (bounds.left + objBounds.width/2)  /fabricCanvas.getZoom();
          }
          else if((bounds.left + bounds.width) > (objBounds.left +objBounds.width)){
            //// console.log("inside right bound");
            keyPair.key = 'left';
            if(flags.isLayoutApplied) keyPair.value = (bounds.left + bounds.width - objBounds.width/2)/fabricCanvas.getZoom();
          }
          setInBound(keyPair.key, keyPair.value);
        }
        // moving vertically
        if(!movement.y){
          if((bounds.top + bounds.height) > (objBounds.top + objBounds.height)){
            //// console.log("inside top bound");
            keyPair.key = 'top';
            if(flags.isLayoutApplied) keyPair.value = (bounds.top + bounds.height - objBounds.height/2)/fabricCanvas.getZoom();
            // console.log('values',keyPair.value);
          }
          else if(bounds.top < objBounds.top){
            //// console.log("inside bottom bound");
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
          obj.selectable=false;
          obj.animate(key, value, {
            //easing: fabric.util.ease.easeOutBounce,
            onChange: fabricCanvas.renderAll.bind(fabricCanvas),
            onComplete: function(){
              //// console.log("done");
              flags.isActionPerformable = true;
              obj.selectable=true;
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

    // ****************************************** Canvas Size methods ******************************************

    // get canvas types
    function getCanvasTypes(){
      return angular.copy(_canvasTypes);
    }

    // get default canvas type, size, orientation
    function getDefaultCanvasSizeDetails(){
      return {
        type: Defaults.canvasType,
        size: Defaults.canvasSize,
        orientation: Defaults.canvasSizeOrientation
      };
    }

    // ****************************************** Other methods ******************************************

    function selectLayoutSection(obj, forcefullySelect){
      // deselect all sections
      var objects = fabricCanvas.getObjects();
      var toDelete = [];
      for(var i=0; i<objects.length; i++){
        if(objects[i].customObjectType === customObjectTypes.strokeLine){
          toDelete.push(objects[i]);
//          fabricCanvas.remove(objects[i]);
        }
      }
      $timeout(function(){
        toDelete.forEach(function(elem, index){
          fabricCanvas.remove(elem);
          if(index === toDelete.length - 1){
            fabricCanvas.renderAll();
          }
        })
      });

      var strokeLines = [];
      // select the new section if not already selected
      if(obj.sectionIndex != selectedSectionIndex || forcefullySelect){

        selectedSectionIndex = obj.sectionIndex;
        blueSelectedBoarderOffset = Defaults.strokeWidth;

        // vertical left
        strokeLines.push(new fabric.Line([
          currentLayoutSections[selectedSectionIndex].left,
          currentLayoutSections[selectedSectionIndex].top,
          currentLayoutSections[selectedSectionIndex].left,
          currentLayoutSections[selectedSectionIndex].top + currentLayoutSections[selectedSectionIndex].height
        ]));
        // vertical right
        strokeLines.push(new fabric.Line([
          currentLayoutSections[selectedSectionIndex].left + currentLayoutSections[selectedSectionIndex].width - Defaults.strokeWidth,
          currentLayoutSections[selectedSectionIndex].top,
          currentLayoutSections[selectedSectionIndex].left + currentLayoutSections[selectedSectionIndex].width - Defaults.strokeWidth,
          currentLayoutSections[selectedSectionIndex].top + currentLayoutSections[selectedSectionIndex].height
        ]));
        // horizontal top
        strokeLines.push(new fabric.Line([
          currentLayoutSections[selectedSectionIndex].left,
          currentLayoutSections[selectedSectionIndex].top,
          currentLayoutSections[selectedSectionIndex].left + currentLayoutSections[selectedSectionIndex].width,
          currentLayoutSections[selectedSectionIndex].top
        ]));
        // horizontal bottom
        strokeLines.push(new fabric.Line([
          currentLayoutSections[selectedSectionIndex].left,
          currentLayoutSections[selectedSectionIndex].top + currentLayoutSections[selectedSectionIndex].height - Defaults.strokeWidth,
          currentLayoutSections[selectedSectionIndex].left + currentLayoutSections[selectedSectionIndex].width,
          currentLayoutSections[selectedSectionIndex].top + currentLayoutSections[selectedSectionIndex].height - Defaults.strokeWidth
        ]));

        for(var j=0; j<strokeLines.length; j++){
          strokeLines[j].set({
            stroke: Defaults.stroke,
            strokeWidth: Defaults.strokeWidth,
            hasBorders: false,
            hasControls: false,
            selectable: false,
            customObjectType: customObjectTypes.strokeLine
          });
          fabricCanvas.add(strokeLines[j]);
        }
        flags.isSectionSelected = true;
        zoomSlider.slider('setValue', obj.get('zoom'));
      }
      // deselect
      else{
        blueSelectedBoarderOffset = 0;
        backgroundImageBoundaryCheck(obj);
        // console.log("deselecting");
        selectedSectionIndex = -1;
        flags.isSectionSelected = false;
        fabricCanvas.deactivateAll();
        zoomSlider.slider('setValue', Defaults.zoom);

      }
    }

    function deselectLayoutAllSections(){
      // deselect all sections
      var objects = fabricCanvas.getObjects();
      var toDelete = [];
      for(var i=0; i<objects.length; i++){
        if(objects[i].customObjectType === customObjectTypes.strokeLine){
          toDelete.push(objects[i]);
        }
      }
      $timeout(function(){
        toDelete.forEach(function(elem, index){
          fabricCanvas.remove(elem);
          fabricCanvas.renderAll();
        })
      });
      flags.isSectionSelected = false;
      selectedSectionIndex = -1;
    }

    function addBkgImageToSection(imgInstance, sectionIndex){
      // position
      imgInstance.set({
        top: currentLayoutSections[sectionIndex].top + currentLayoutSections[sectionIndex].height/2,
        left: currentLayoutSections[sectionIndex].left + currentLayoutSections[sectionIndex].width/2
      });
      // scale
      if(currentLayoutSections[sectionIndex].width > currentLayoutSections[sectionIndex].height){
        imgInstance.scaleToWidth(currentLayoutSections[sectionIndex].width);
        if(imgInstance.originalHeight*imgInstance.scaleY < currentLayoutSections[sectionIndex].height){
          imgInstance.scaleToHeight(currentLayoutSections[sectionIndex].height);
        }
      }
      else{
        imgInstance.scaleToHeight(currentLayoutSections[sectionIndex].height);
        if(imgInstance.originalWidth*imgInstance.scaleX < currentLayoutSections[sectionIndex].width){
          imgInstance.scaleToWidth(currentLayoutSections[sectionIndex].width);
        }
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

      this.setCoords();
      var clipRect = findByClipName(this.clipName);
      // console.log(this);
      // console.log(clipRect);
      var scaleXTo1 = (1 / this.scaleX);
      var scaleYTo1 = (1 / this.scaleY);
      ctx.save();

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
      var objectFlag=flags.isLayoutApplied ? flags.isLayoutApplied : false;
      var returnFlag=true;
      if(objectFlag)
        returnFlag=object ? true : false;
      return returnFlag;
    }

    function cancel(e) {
      // console.log(e);
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }

    function disableFabricObject(object){
      object.lockMovementX=true;
      object.lockMovementY=true;
      object.lockScalingY=true;
      object.lockScalingX=true;
      object.lockRotation=true;
      return object;
    }

    function dragOverOnCanvas(ev){
      //handles dragover event on the canvas
    }

    function registerCanvasEvents(){
      //registers events on canvas
      var canvas_container= $(".canvas-container");
      canvas_container.on('dragover', function(ev){
        if(flags.isLayoutApplied){
          var objectLeft=ev.originalEvent.offsetX;
          var objectTop=ev.originalEvent.offsetY;
          var minDistance=1000;
          var sectionIndex;
          currentLayoutSections.forEach(function(section, index){
            var sectionX=section.left + (section.width/2);
            var sectionY=section.top + (section.height/2);
            var distance=Math.pow((sectionX - objectLeft), 2) + Math.pow((sectionY- objectTop), 2);
            distance=Math.sqrt(distance);
            if(distance<=minDistance){
              minDistance=distance;
              // minLeft=differenceLeft;
              // minTop=differenceTop;
              sectionIndex=index;
            }
          });
          if(selectedSectionIndex != sectionIndex){
            selectLayoutSection(currentLayoutSections[sectionIndex], true);
            fabricCanvas.renderAll();
          }
        }
        flags.droppedOnCanvas = true;
      });
      $('#image-studio').on('dragover', function (ev) {
        // just to cancel dropping on outside the canvas : somehow its working
        ev.preventDefault();
        // console.log('image-studio dragover');
      });
      canvas_container.on('dragleave', function(ev){
        // console.log('dragleave');
        flags.droppedOnCanvas = false;
        deselectLayoutAllSections();
        fabricCanvas.renderAll();
      });
    }

    // extract Sticks and Text from Canvas
    function extractStickersAndTexts() {
      var objects = fabricCanvas.getObjects();
      var returnArr = [];
      for(var i = 0; i<objects.length; i++ ){
        if(objects[i].customObjectType === customObjectTypes.sticker || objects[i].customObjectType === customObjectTypes.text){
          returnArr.push(objects[i]);
        }
      }
      return returnArr;
    }

    // load Stickers and Text into Canvas
    function loadStickersAndTexts(stickerTextArr) {
      for(var i =0; i<stickerTextArr.length; i++){
        fabricCanvas.add(stickerTextArr[i]);
      }
    }
    function bringAllTextToFront(textArray) {
      if(textArray.length === 0 || !textArray){
        return;
      }
      else {
        for(var i = 0; i< textArray.length; i++){
          fabricCanvas.bringToFront(textArray[i]);
        }
      }
    }

    function checkResolution(selectedImage){
      if(!selectedImage) return;
      if(!flags.isLayoutApplied){
        var selectedCanvasResolutions = _canvasTypes[currentSelectedCanvasType.toLocaleUpperCase()].sizes[currentSelectedCanvasSize][Defaults.canvasSizeOrientation];
        var low_resolution=lowResolution(selectedImage.originalWidth, selectedImage.originalHeight,
          selectedCanvasResolutions.width.px, selectedCanvasResolutions.height.px);
        if(low_resolution) {
          customEvents.fire(customEventsList.imageCheckResolution, true);
        }
      }
    }

    function lowResolution(width1, height1, width2, height2) {
      return !!(width1 < width2 || height1 < height2);
    }

    function getCanvasTypeBasedOnOrientation(image) {
      if(image.originalWidth === image.originalHeight){
        return Defaults.canvasType;
      }
      else {
        return canvasTypes.REGULAR.name;
      }
    }

    function getSeletedCanvasTypeAndSize() {
      var canvasObj = {
        type : currentSelectedCanvasType || Defaults.canvasType,
        size : currentSelectedCanvasSize ||  Defaults.canvasSize,
        orientation : currentSelectedCanvasOrientation || Defaults.canvasSizeOrientation
      };
      return canvasObj;
    }

    function findItemSizeDetails(item){

      if(!item.isProduct){
        var canvasSizeDetails = {};
        // TYPE
        canvasSizeDetails.type = getCanvasTypeBasedOnOrientation(item);
        // SIZE
        canvasSizeDetails.size = Defaults.canvasSize;
        // ORIENTATION
        if(item.originalWidth < item.originalHeight) {
          canvasSizeDetails.orientation = canvasOrientations.vertical;
        }
        else{
          canvasSizeDetails.orientation = canvasOrientations.horizontal;
        }
        // Dimensions
        canvasSizeDetails.dimensions = _canvasTypes[canvasSizeDetails.type.toUpperCase()].sizes[canvasSizeDetails.size][canvasSizeDetails.orientation];

        item.canvasSizeDetails = canvasSizeDetails;
      }
      else{
        console.log(item.canvasSizeDetails);
        // Dimension
          item.canvasSizeDetails.dimensions = _canvasTypes[item.canvasSizeDetails.type.toUpperCase()].sizes[item.canvasSizeDetails.size][item.canvasSizeDetails.orientation];
      }

      return item.canvasSizeDetails;

    }

  }
}());

