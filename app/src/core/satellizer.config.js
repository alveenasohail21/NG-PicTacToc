(function () {

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration($authProvider, $localStorageProvider, API_URL) {


    $authProvider.httpInterceptor = false;
    $authProvider.withCredentials = false;
    $authProvider.tokenPrefix = 'ptt';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';

    $authProvider.loginUrl = API_URL + '/auth/login';
    $authProvider.signupUrl = API_URL + '/auth/signup';

    $authProvider.facebook({
      url: API_URL + '/auth/facebook/',
      clientId: '985520998209467',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: {width: 580, height: 400}
    });

    $authProvider.google({
      url: API_URL + '/auth/google/',
      clientId: '227446808862-908ggmoncfcuquuulgn8smte0mrd48nd.apps.googleusercontent.com',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      type: '2.0',
      popupOptions: {width: 452, height: 633}
    });

  }

}());
