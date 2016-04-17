(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: Dashboard', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.dashboard'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('Dashboard', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
