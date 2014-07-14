describe('Directives', function() {
  'use strict';

  var app, scope, element, value, controllerScope;

  beforeEach(function() {
    app = new $trugular({rootElement: root});
    app.$directive('custom', function($scope, $element, $value) {
      scope = $scope;
      element = $element;
      value = $value;
    });
    app.$route({
      url: '/',
      template: '<span tg-custom="some text"/>',
      controller: function($scope) { controllerScope = $scope; }
    });
    app.$go();
  });

  describe('arguments passed to the binding', function() {
    it('gets a unique scope', function() {
      expect(scope).toBeDefined();
      expect(controllerScope === scope).not.toBeTruthy();
    });

    it('gets the element', function() {
      expect(element.tagName).toEqual('SPAN');
    });

    it('gets the value of the assigned attribute', function() {
      expect(value).toEqual('some text');
    });
  });
});
