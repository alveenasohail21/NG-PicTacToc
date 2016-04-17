(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: dashboard', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.dashboard'));

    var dashboard;

    beforeEach(inject(function($injector){

      dashboard = $injector.get('dashboard');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
