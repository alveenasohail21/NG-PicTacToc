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

  function designTool(){

    /*
    * Constants
    * */
    const customObjectTypes = {
      layout: 'Layout',
      filter: 'Filter',
      text: 'Text',
      sticker: 'Sticker',
      backgroundImage: 'BackgroundImage'
    };
    const Defaults = {
      zoom: 0,
      propsToIncludeForJSON: [
        'customObjectType', 'hasControls', 'clipName', 'originalScale', 'zoom', 'sectionIndex'
      ],
      plusIconSizeForLayoutSections: 60
    };

    /*
    * Variables
    * */
    var currentLayoutSections = [];
    var sectionBkgImages = [];
    var selectedSectionIndex = 0;
    var flags = {
      isCanvasEmpty: true,
      isLayoutApplied: false
    };
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

    /* Return Data & Functions */
    return {
      // Helper methods
      initializeTool: initializeTool,
      onDOMLoad: onDOMLoad,
      setDimensions: setDimensions,
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
      // Tool events
      bindToolEvents: bindToolEvents,
      // zoom
      resetZoomSettings: resetZoomSettings
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
    }

    function setDimensions(dimension){
      console.log('DESIGN TOOL: setDimensions');
      fabricCanvas.setDimensions({
        width: dimension.width,
        height: dimension.height
      });
      fabricCanvas.renderAll();
    }

    function loadBkgImage(image, cb){
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
        // add to canvas
        fabricCanvas.add(fabricImage);
        /* No Layout Selected */
        if(!flags.isLayoutApplied){
          console.log('DESIGN TOOL: Layout is not applied');
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
        /* Working With Layouts */
        else{
          console.log('DESIGN TOOL: Layout is applied');
          // position
          fabricImage.set({
            top: currentLayoutSections[selectedSectionIndex].top + currentLayoutSections[selectedSectionIndex].height/2,
            left: currentLayoutSections[selectedSectionIndex].left + currentLayoutSections[selectedSectionIndex].width/2
          });
          // scale
          if(currentLayoutSections[selectedSectionIndex].width > currentLayoutSections[selectedSectionIndex].height){
            console.log('DESIGN TOOL: Scaled to Width');
            fabricImage.scaleToWidth(currentLayoutSections[selectedSectionIndex].width);
          }
          else{
            console.log('DESIGN TOOL: Scaled to Height');
            fabricImage.scaleToHeight(currentLayoutSections[selectedSectionIndex].height);
          }
          // apply clipping
          fabricImage.set({
            'sectionIndex': selectedSectionIndex,
            'clipName': 'bkgImage'+selectedSectionIndex,
            'clipTo': function(ctx) {
              return _.bind(clipByName, fabricImage)(ctx)
            }
          });
          // save fabric image instance to section index
          sectionBkgImages[selectedSectionIndex] = fabricImage;
          // update selected section index
          selectedSectionIndex++;
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
      fabricCanvas.loadFromJSON(canvasJSON, function(){
        var objects = fabricCanvas.getObjects();
        objects.forEach(function(obj){
          obj.set(fabricObjSettings);
          // reactivate settings
          switch(obj.customObjectType){
            case customObjectTypes.backgroundImage:
              // position
              // scale
              // clipping
              // zoom
              break;
            case customObjectTypes.layout:
              break;
            case customObjectTypes.sticker:
              break;
            case customObjectTypes.text:
              break;
          }
          // update coords
          obj.setCoords();
        });
        // render
        fabricCanvas.renderAll();
        fabricCanvas.deactivateAll();
        // update flag
        flags.isCanvasEmpty = false;
        // call callback
        if(cb){
          cb();
        }
      });
    }

    function getCanvasJSON(){
      var canvasJSON = fabricCanvas.toJSON(Defaults.propsToIncludeForJSON);
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

    function applyBorder(){
      console.log('DESIGN TOOL: applyBorder');
    }

    function flipHorizontal(){
      console.log('DESIGN TOOL: flipHorizontal');
    }

    function flipVertical(){
      console.log('DESIGN TOOL: flipVertical');
    }

    function rotateClockwise(){
      console.log('DESIGN TOOL: rotateClockwise');
    }

    function rotateAntiClockwise(){
      console.log('DESIGN TOOL: rotateAntiClockwise');
    }

    // ****************************************** Left sidemenu methods ******************************************

    function applyFilter(){
      console.log('DESIGN TOOL: applyFilter');
    }

    function applySticker(){
      console.log('DESIGN TOOL: applySticker');
    }

    function applyText(){
      console.log('DESIGN TOOL: applyText');
    }

    function applyLayout(layout, cb){
      console.log('DESIGN TOOL: applyLayout', layout);
      var layoutSectionsCloned = angular.copy(layout.data);
      // empty local layout sections
      currentLayoutSections = [];
      // clear canvas
      fabricCanvas.clear();
      // apply layout
      layoutSectionsCloned.forEach(function(elem, index){
        // convert the percentage values to pixel values
        elem.top = fabricCanvas.getHeight()*elem.top;
        elem.left = fabricCanvas.getWidth()*elem.left;
        elem.height = fabricCanvas.getHeight()*elem.height;
        elem.width = fabricCanvas.getWidth()*elem.width;
        // add the clipping rect to canvas
        var clipRect = new fabric.Rect(elem);
        clipRect.set({
          clipFor: 'bkgImage'+currentLayoutSections.length,
          alwaysBack: true,
          customObjectType: customObjectTypes.layout
        });
        // push to local layout sections
        currentLayoutSections.push(clipRect);
        fabricCanvas.add(clipRect);
        // add the plus icon to rectangle
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
              hasBorders: false
            });
            fabricCanvas.add(pug);
            // render
            fabricCanvas.renderAll();
            fabricCanvas.deactivateAll();

            // if last layout
            if(index == layoutSectionsCloned.length-1){
              if(cb){
                cb();
              }
            }

          }(img, elem, index));
        };
        pugImg.src = 'images/white-cross.png';
      });
      flags.isLayoutApplied = true;
    }

    // ****************************************** Customizer methods ******************************************

    function updateTextSize(){
      console.log('DESIGN TOOL: updateTextSize');
    }

    function updateTextColor(){
      console.log('DESIGN TOOL: updateTextColor');
    }

    function deleteSelectedObject(){
      console.log('DESIGN TOOL: deleteSelectedObject');
    }

    function copySelectedObject(){
      console.log('DESIGN TOOL: copySelectedObject');
    }

    // ****************************************** Tool events ******************************************

    function bindToolEvents(){
      console.log('DESIGN TOOL: bindToolEvents');
      // fabric events
      fabricCanvas.on({
        'mouse:down': function(event){
          var obj = event.target;
          console.log(obj);
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

        },
        'mouse:over': function(event){

        },
        'mouse:out': function(event){

        },
        'selection:cleared': function(event){

        },
        'selection:created': function(event){

        },
        'path:created': function(event){

        },
        'before:selection:cleared': function(event){

        },
        'object:modified': function(event){

        },
        'object:rotating': function(event){

        },
        'object:scaling': function(event){

        },
        'object:moving': function(event){

        },
        'object:selected': function(event){

        }
      })
    }

    // ****************************************** Zoom methods ******************************************

    function resetZoomSettings(){
      console.log('DESIGN TOOL: resetZoomSettings');
    }

    // ****************************************** Other methods ******************************************

    function degToRad(degrees) {
      return degrees * (Math.PI / 180);
    }

    function findByClipName(name) {
      return _(fabricCanvas.getObjects()).where({
        clipFor: name
      }).first()
    }

    function clipByName(ctx) {
      this.setCoords();
      var clipRect = findByClipName(this.clipName);
      var scaleXTo1 = (1 / this.scaleX);
      var scaleYTo1 = (1 / this.scaleY);
      ctx.save();

      var ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
      var ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
      var ctxWidth = clipRect.width - clipRect.strokeWidth;
      var ctxHeight = clipRect.height - clipRect.strokeWidth;

      ctx.translate( ctxLeft, ctxTop );
      ctx.scale(scaleXTo1, scaleYTo1);
      ctx.rotate(degToRad(this.angle * -1));

      ctx.beginPath();
      ctx.rect(
        clipRect.left - this.oCoords.tl.x,
        clipRect.top - this.oCoords.tl.y,
        clipRect.width,
        clipRect.height
      );
      ctx.closePath();
      ctx.restore();
    }

  }
}());
