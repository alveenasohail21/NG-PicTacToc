/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('cartFactory', cartFactory);

  function cartFactory($q, restFactory, alertFactory, designTool, $rootScope){

    const DefaultItemImageSize = '260x260';

    var _data = {
      projectItems: [],
      projectId: null
    };

    /* Return Functions */
    return {
      removeProjectItems: removeProjectItems,
      getSpecificProjectItems: getSpecificProjectItems,
      updateProjectItemQuantity: updateProjectItemQuantity,
      getCartProjects: getCartProjects,
      getPricing: getPricing,

      _data: _data
    };

    /* Define Fuctions */

    function removeProjectItems(){
      console.log("removing cart factory data ****************");
      _data.projectItems = [];
      _data.projectId = null;
    }

    function getSpecificProjectItems(projectId) {
      var deferred = $q.defer();
      globalLoader.show();
      restFactory.projects.getItems(projectId)
        .then(function(resp){
          if(resp.success){
            _data.projectItems = resp.data;
            _data.projectId = projectId;
            updateItemSizeDetails();
            alertFactory.success(null , resp.message);
            deferred.resolve(resp);
          }
          else{
            alertFactory.error(null, resp.message);
            deferred.reject(resp);
          }
          globalLoader.hide();
        }, function(err){
          alertFactory.error(null, err.data.message);
          globalLoader.hide();
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateProjectItemQuantity(itemId, quantity){
      var deferred = $q.defer();
      globalLoader.show();
      if(!_data.projectId){
        deferred.reject({
          success: false,
          message: 'Project not selected'
        })
      }
      else{
        var data = {
          quantity: quantity
        };
        restFactory.projects.updateProjectItem(_data.projectId, itemId, data)
          .then(function(resp){
            if(resp.success){
              _data.projectItems[getItemIndexThroughId(itemId)].quantity = quantity;
              alertFactory.success(null , resp.message);
              deferred.resolve(resp);
            }
            else{
              alertFactory.error(null, resp.message);
              deferred.reject(resp);
            }
            globalLoader.hide();
          }, function(err){
            alertFactory.error(null, err.data.message);
            globalLoader.hide();
            deferred.reject(err);
          });
      }
      return deferred.promise;
    }

    function getItemIndexThroughId(id){
      for(var i=0; i<_data.projectItems.length; i++){
        if(id == _data.projectItems[i].item_id){
          return i;
        }
      }
    }

    function updateItemSizeDetails(){
      for(var i=0; i<_data.projectItems.length; i++){
        _data.projectItems[i].canvasSizeDetails = designTool.findItemSizeDetails(_data.projectItems[i]);
        // convert url as well
        _data.projectItems[i].url = convertUrl(_data.projectItems[i]);
      }
    }

    function convertUrl(item){
      if(item.isProduct){
        return $rootScope.safeUrlConvert(item.url);
      }
      return $rootScope.safeUrlConvert(item.url+ '-' + DefaultItemImageSize + '.' + item.extension);
    }

    function getCartProjects(){
      globalLoader.show();
      var deffered = $q.defer();
      restFactory.cart.getCartProjects().then(function(resp){
        if(resp.success){
          globalLoader.hide();

          // TODO: get pricing and add in each project
          // if(!_data.pricing){
          //   resp.data = updateCartProjectPricing(resp.data);
          // }
          // else{
          // call api
          // on resp update price
          // }
          deffered.resolve(resp);
        }
        else{
          // TODO
          console.log(resp);
          alertFactory.error(null, resp.message);
          globalLoader.hide();
          deffered.reject(resp);
        }
      }, function(err){
        globalLoader.hide();
        deffered.reject(err);
      });
      return deffered.promise;
    }

    function getPricing(){
      globalLoader.show();
      var deffered = $q.defer();
      restFactory.cart.getPricing().then(function(resp){
        if(resp.success){
          globalLoader.hide();
          deffered.resolve(resp);
        }
        else{
          // TODO
          alertFactory.error(null, resp.message);
          globalLoader.hide();
          deffered.reject(resp);
        }
      }, function(err){
        globalLoader.hide();
        deffered.reject(err);
      });
      return deffered.promise;
    }


  }
}());
