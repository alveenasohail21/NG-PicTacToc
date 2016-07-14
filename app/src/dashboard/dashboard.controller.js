/**
 * @ngdoc controller
 * @name app.dashboard.controller:Dashboard
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashboardCtrl', dashboardCtrl);

  /* @ngInject */
  function dashboardCtrl(authFactory, restFactory, $rootScope, Upload, $timeout, $localStorage, pttFBFactory){
    var vm = this;

    vm.testFunction = testFunction;
    vm.socialAuthenticate = socialAuthenticate;
    vm.getSocialAlbums = getSocialAlbums;
    /////////////////////

    /**
     * @ngdoc method
     * @name testFunction
     * @param {number} num number is the number of the number
     * @methodOf app.dashboard.controller:Dashboard
     * @description
     * My Description rules
     */
    function testFunction(num){
      console.info('This is a test function');
    }

    function socialAuthenticate(provider){
      authFactory.socialAuthenticate(provider);
    }

    function getSocialAlbums(){
      pttFBFactory.getAlbums()
        .then(function(resp){
          if(resp){
            console.log("Response in CTRL: ", resp);
          }
        })
    }

    function getSocialAlbumsOLD(provider){

      FB.login(function(response) {
        console.log("Login Resposne: ",response);
        if (response.status === 'connected') {
          console.log("connected");
          // Logged into your app and Facebook.
          var authResponse = response.authResponse;

          var url= 'v2.6/'+ authResponse.userID + "/albums";
          console.log(url);
          FB.api(url, 'GET',
            {
              access_token: authResponse.accessToken,
              limit: 5
            },
            function (response) {
              console.log("Photos Response: ", response);
              if (response && !response.error) {
                //console.log(response);

                var url= 'v2.6/'+ response.data[3].id + "/picture";
                console.log(url);
                FB.api(url, 'GET',
                  {
                    access_token: authResponse.accessToken
                  },
                  function (response) {
                    console.log("Album Cover Response: ", response);
                    if (response && !response.error) {
                      //console.log(response);
                    }
                  }
                );

              }
            }
          );

        } else if (response.status === 'not_authorized') {
          console.log("not_authorized");
          // The person is logged into Facebook, but not your app.
        } else {
          console.log("not logged in");
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
        }
      }, {
        scope: 'email,user_photos,public_profile'
      });

      //var url= "/812279648803406/photos?type=uploaded";
      //console.log(url);
      //FB.api(url, function (response) {
      //    console.log(response);
      //    if (response && !response.error) {
      //      console.log(response);
      //    }
      //  }
      //);

      //console.log($rootScope.user);
      //
      //restFactory.photos.getSocialPhotos(provider)
      //  .then(function(resp){
      //    console.log(resp);
      //  }, function(err){
      //    console.log(err);
      //  })
    }

    // ng file upload test

    //vm.uploadFiles = function(file, errFiles) {
    //console.log("upload start");
    //  vm.f = file;
    //  vm.errFile = errFiles && errFiles[0];
    //  if (file) {
    //    file.upload = Upload.upload({
    //      url: 'https://localhost:8000/photos/upload/device',
    //      data: {file: file}
    //    });
    //
    //    file.upload.then(function (response) {
    //      $timeout(function () {
    //        file.result = response.data;
    //      });
    //    }, function (response) {
    //      if (response.status > 0)
    //        vm.errorMsg = response.status + ': ' + response.data;
    //    }, function (evt) {
    //      file.progress = Math.min(100, parseInt(100.0 *
    //        evt.loaded / evt.total));
    //    });
    //  }
    //}

    // working form single select
    //vm.uploadPic = function(file) {
    //  console.log("upload start", file);
    //  file.upload = Upload.upload({
    //    url: 'http://localhost:8000/photos/upload/device',
    //    data: {username: vm.username, file: file},
    //  });
    //
    //  file.upload.then(function (response) {
    //    $timeout(function () {
    //      file.result = response.data;
    //    });
    //  }, function (response) {
    //    if (response.status > 0)
    //      vm.errorMsg = response.status + ': ' + response.data;
    //  }, function (evt) {
    //    // Math.min is to fix IE which reports 200% sometimes
    //    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //  });
    //}


    vm.uploadFiles = function (files) {
      vm.files = files;
      console.log(vm.files);
      if (files && files.length) {
        Upload.upload({
          method: 'POST',
          url: 'http://localhost:8000/photos/upload/device',
          data: {
            files: files
          },
          headers: {
            'Content-Type': 'application/json',
            'token': 'Bearer {'+ $localStorage.token +'}'
          }
        }).then(function (response) {
          $timeout(function () {
            vm.result = response.data;
            console.log(response);
          });
        }, function (response) {
          if (response.status > 0) {
            vm.errorMsg = response.status + ': ' + response.data;
          }
        }, function (evt) {
          vm.progress =
            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    }

  }

}());
