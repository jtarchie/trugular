describe('Contollers', function() {
  'use strict';

  var app, scope;

  beforeEach(function() {
    app = new $trugular({rootElement: root});
    app.$route({
      url: '/',
      controller: function($scope) {
        scope = $scope;
        scope.age = scope.age || 0;
        scope.age++;
      },
      template: 'Nothing'
    });
  });

  afterEach(function() { app.$destroy(); });

  describe('the scope passed to the controller', function() {
    beforeEach(function() {
      app.$go();
    });

    it('can be assigned values', function() {
      expect(scope.age).toEqual(1);
    });

    it('clears the scope on each subsequent route call', function() {
      app.$go()
      expect(scope.age).toEqual(1);
    });

    it('has access to it app original functions', function() {
      expect(scope.$go).toBeDefined();
      expect(scope.$route).toBeDefined();
    });

    pending('when assigning events', function() {
      it('only allows them to be scoped in the request lifespan', function() {

      });
    });
  });
});
