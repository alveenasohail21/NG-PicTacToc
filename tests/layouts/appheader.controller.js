(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: AppHeader', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.layouts'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('AppHeader', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
