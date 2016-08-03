/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('camanFactory', camanFactory);

  function camanFactory(){
    /*Default Configurations*/

    var defaultOptions = {

    };

    var filters=['vintage', 'lomo', 'clarity', 'sinCity', 'sunrise', 'nostalgia', 'hemingway', 'grungy', 'jarques', 'pinhole'];

    var element;

    /* Return Functions */

    return {
      initiateCaman: initiateCaman,
      getImageDetails: getImageDetails,
      revert: revert,
      applyFilter: applyFilter,
      filters: filters
    };

    /* Define Functions */

    function initiateCaman(id, options) {
      element = $(id).selector;
      Caman(element, function () {
        console.log("here i am");
        this.reloadCanvasData();
        this.render();
      });
    }

    function revert(){
      Caman(element, function () {
        this.revert();
      });
    }

    function getImageDetails(){

    }

    function applyFilter(){

    }
  }
}());
