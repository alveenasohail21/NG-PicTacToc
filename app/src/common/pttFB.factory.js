/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('pttFBFactory', pttFBFactory);

  function pttFBFactory($q, restFactory, $rootScope, photosFactory, $http){

    var platform = 'facebook';
    var authResponse = null;
    var requestTimeInSecond;
    var graphAPIversion = "v2.6";
    var facebookProfilePicUrl = "https://graph.facebook.com/user_id/picture?type=large";
    var albums = {
      data: [],
      pagination: {
        from: 0,
        limit: 25,
        next: null,
        previous: null,
        end: false
      }
    };

    /* Return Functions */
    return {
      isAuthenticated: isAuthenticated,
      login: login,
      getAlbums: getAlbums,
      getAlbumPhotos: getAlbumPhotos,
      saveAuth: saveAuth,
      disconnect: disconnect,
      clearInternalData: clearInternalData
    };


    /* Define Fuctions */

    function saveAuth(data){
      authResponse = data;
      if(!authResponse.picture){
        authResponse.picture = (facebookProfilePicUrl.replace('user_id', authResponse.social_id));
        $rootScope.user.socialPicture = authResponse.picture;
      }
    }

    function disconnect(){
      authResponse = null;
      albums = {
        data: [],
        pagination: {
          from: 0,
          limit: 25,
          next: null,
          previous: null,
          end: false
        }
      }
    }

    function clearInternalData(){
      albums = {
        data: [],
        pagination: {
          from: 0,
          limit: 25,
          next: null,
          previous: null,
          end: false
        }
      }
    }

    function isAuthenticated(){
      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        console.log("not authenticated");
        return false;
      }
      else if(isTokenExpire()){
        console.log("token is expired");
        return false;
      }
      else{
        return true;
      }
    }

    function isTokenExpire(){
      var diff = ((requestTimeInSecond+authResponse.expiresIn) - requestTimeInSecond);
      console.log("Diff>exp: ", diff>authResponse.expiresIn);
      return (diff>authResponse.expiresIn);
    }

    function login(){
      var deffered = $q.defer();
      requestTimeInSecond = (new Date()).getSeconds();
      console.log(requestTimeInSecond);
      FB.login(function(response) {
        console.log("Login Resposne: ",response);
        if (response.status === 'connected') {
          console.log("connected");
          // Logged into your app and Facebook.
          authResponse = response.authResponse;
          deffered.resolve(response);
        } else if (response.status === 'not_authorized') {
          console.log("not_authorized");
          // The person is logged into Facebook, but not your app.
          deffered.reject('Something is wrong');
        } else {
          console.log("not logged in");
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          deffered.reject('Something is wrong');
        }
      }, {
        scope: 'email,user_photos,public_profile'
      });
      return deffered.promise;
    }

    function getAlbums(cursor){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        restFactory.users.socialDetails({platform: 'facebook'})
          .then(function(resp){
            console.log(resp);
            if(resp.success){
              console.log("Social DETAILS: ", resp.data);
              $rootScope.user.socialName = resp.data.social_name;
              saveAuth(resp.data);
            }
            if(albums.data.length>0 && !cursor){
              console.log("albums present");
              deffered.resolve(albums.data);
            }
            else{
              _getAlbums();
            }
          })
      }
      // if authenticated and token is not expired, get albums
      else{
        console.log("Setting Facebook details on rootscope");
        $rootScope.user.socialName = authResponse.social_name;
        $rootScope.user.socialPicture = authResponse.picture;

        if(albums.data.length>0 && !cursor){
          console.log("albums present");
          deffered.resolve(albums.data);
        }
        else{
          // check if all albums are downloaded
          if(albums.pagination.end){
            console.log("no more album");
            deffered.resolve([]);
          }
          else{
            _getAlbums();
          }
        }
      }

      function _getAlbums(){
        var url;
        switch(cursor){
          case 'next':
            url = albums.pagination.next;
            break;
          case 'previous':
            url = albums.pagination.previous;
            break;
          default:
            url = graphAPIversion + '/'+ authResponse.social_id+ "/albums";
            break;
        }
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.access_token,
            //limit: albums.pagination.limit,
            fields: 'name,source,picture,count'
          },
          function (response) {
            console.log("Albums Response: ", response);
            if (response && !response.error) {
              // save paging
              if(response.paging.next){
                albums.pagination.next = response.paging.next;
              }
              if(response.paging.previous){
                albums.pagination.previous = response.paging.previous;
              }
              // add received album length in from
              //albums.pagination.from += response.data.length;
              // see if no albums remaining
              if(response.data.length < albums.pagination.limit){
                albums.pagination.end = true;
              }
              deffered.resolve(response.data);
              // get the album covers of each album
              //response.data.forEach(function(elem, index, array){
              //  getAlbumCover(elem.id)
              //    .then(function(resp){
              //      // add the image to elem
              //      elem.cover_photo.url = resp.url;
              //      // push elem to album
              //      albums.data.push(elem);
              //      // resolve on the last album
              //      if(index == response.data.length-1){
              //        // album with cover
              //      }
              //    });
              //});
            }
            else{
              alertFactory.error(null, "Unable to get Facebook photos, Please try later");
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;

    }

    function getAlbumPhotos(albumId, index, pagingCursor){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!isAuthenticated()){
        login().then(function(resp){
          _getAlbumPhotos();
        })
      }
      // if authenticated and token is not expired, get albums
      else{
        _getAlbumPhotos();
      }

      function _getAlbumPhotos(){
        // if authenticated, get album cover
        var url= graphAPIversion + '/'+ albumId + "/photos";
        // if pagingCursor is present
        if(pagingCursor != null){
          url = pagingCursor;
        }
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.access_token,
            fields: 'images,link,name,from,picture,height,width,source'
          },
          function (response) {
            console.log("Album Photos Response: ", response);
            if (response && !response.error) {
              // resolve
              response.data.forEach(function(elem, index){
                response.data[index] = photosFactory.mapSocialPhotos(elem, platform);
              });
              deffered.resolve(response);
            }
            else{
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;
    }

  }

}());
