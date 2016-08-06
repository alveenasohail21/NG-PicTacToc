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

  function mediaFactory(restFactory){
    /* Default Pagination */
    var defaultPagination = {
      from: 0,
      size: 12
    };

    /* Return Functions */
    return {
      getFilters: getFilters,
      getStickers: getStickers,
      getFonts: getFonts,
      getLayouts: getLayouts
    };

    /* Define Functions */
    function getFilters(pagination){
      var queryPrams = {
        type: 'filter',
        from: pagination.from || defaultPagination.from,
        size: pagination.size || defaultPagination.size
      };
      // TODO: Test REST Call
      return getMedia(queryPrams);
    }

    function getStickers(pagination){
      var queryPrams = {
        type: 'sticker',
        from: pagination.from || defaultPagination.from,
        size: pagination.size || defaultPagination.size
      };
      // TODO: Test REST Call
      return getMedia(queryPrams);
    }

    function getFonts(pagination){
      var queryPrams = {
        type: 'font',
        from: pagination.from || defaultPagination.from,
        size: pagination.size || defaultPagination.size
      };
      // TODO: Test REST Call
      return getMedia(queryPrams);
    }

    function getLayouts(pagination){
      var queryPrams = {
        type: 'layout',
        from: pagination.from || defaultPagination.from,
        size: pagination.size || defaultPagination.size
      };
      // TODO: Test REST Call
      return getMedia(queryPrams);
    }

    function getMedia(queryParams){
      var deffered = $q.defer();
      restFactory.media.get(queryParams)
        .then(function (resp){
          if(resp.success){
            deffered.resolve(resp);
          }
          else{
            alertFactory.error(null, resp.message);
            deffered.reject(resp);
          }
        }, function(err){
          deffered.reject(err);
        });
      return deffered.promise;
    }

  }
}());
