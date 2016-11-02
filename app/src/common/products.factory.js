(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('productsFactory', productsFactory);


  function productsFactory($q, restFactory, alertFactory,photosFactory, $rootScope){
    return {
        savePhotoOrProduct: savePhotoOrProduct,
      addInProgressProducts : addInProgressProducts
    };

    function addInProgressProducts(data) {
      var deffered = $q.defer();
      restFactory.products.addInProgressProducts(data).then(function (resp) {
        alertFactory.success(null, resp.message);
        deffered.resolve(resp.data);
      },function (err) {
        alertFactory.error(null, resp.message);
        deffered.reject(err);
      });
      return deffered.promise;
    }

      function savePhotoOrProduct(data, isLayout) {
          var deffered = $q.defer();
          // TODO: project id should be dynamic
          var projectId = $rootScope.sku;
        // tell the server that it is a layout
        var queryParams = (isLayout)?({
          layout: true
        }):({});
          restFactory.projects.savePhotoOrProduct(projectId, data._id, data, queryParams).then(function (resp) {
              alertFactory.success(null, resp.message);
              deffered.resolve(resp.data);
          },function (err) {
              alertFactory.error(null, err.message);
              deffered.reject(err);
          });
          return deffered.promise;
      }

  }

}());
