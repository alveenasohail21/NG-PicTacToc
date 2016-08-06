/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('mediaFactory', mediaFactory);

  function mediaFactory(){
    /*Default Configurations*/

    var defaultOptions = {

    };


    var element;

    /* Return Functions */

    return {
      init: init,
      getImageDetails: getImageDetails,
      revert: revert
    };

    /* Define Functions */

    function init(id, options) {
      element = $(id).selector;
      console.log("id: ", element);

      // var canvas = new fabric.Canvas(element);

    }

    function revert(){

    }
    function getImageDetails(){

    }
  }
}());
