(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('productsFactory', productsFactory);


  function productsFactory($q, restFactory, alertFactory,photosFactory){
    return {
        savePhotoOrProduct: savePhotoOrProduct,
      addInProgressProducts : addInProgressProducts,
      copyProduct: copyProduct,
      deleteProduct : deleteProduct
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

      function savePhotoOrProduct(data) {
          var deffered = $q.defer();
          // TODO: project id should be dynamic
          var projectId = $rootScope.sku;
          restFactory.projects.savePhotoOrProduct(projectId, data._id, data).then(function (resp) {
              alertFactory.success(null, resp.message);
              deffered.resolve(resp.data);
          },function (err) {
              alertFactory.error(null, err.message);
              deffered.reject(err);
          });
          return deffered.promise;
      }

    function copyProduct(id, index) {
      var deferred = $q.defer();
      $('.collapse-loader').css('display', 'block');
      restFactory.products.copyProduct(id, index).then(function(resp){
        if(resp.success){
          resp.data.base64 = photosFactory._data.photos[index].base64;
          photosFactory._data.photos.splice(index, 0, angular.copy(resp.data));
          photosFactory._data.totalCount++;
          deferred.resolve(resp);
        }
        else{
          deferred.reject(resp);
        }
        $('.collapse-loader').css('display', 'none');
      });
      return deferred.promise;
    }
    function deleteProduct(id,index) {
      var deferred = $q.defer();
      $('.collapse-loader').css('display', 'block');
      restFactory.products.deleteProduct(id).then(function(resp){
        if(resp.success){
          photosFactory._data.photos.splice(index, 1);
          photosFactory._data.totalCount--;
          alertFactory.success(null , resp.message);
          $('.collapse-loader').css('display', 'none');
          deferred.resolve(resp);
        }
        else{
          $('.collapse-loader').css('display', 'none');
          deferred.reject(resp);
        }
      });
      return deferred.promise;
    }
  }

}());
