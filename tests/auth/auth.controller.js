(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: Auth', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.auth'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('Auth', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
