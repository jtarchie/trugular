describe('Binding values to a template from the scope', function() {
  'use strict';

  var app;

  beforeEach(function() {
    app = new $trugular({rootElement: root});
  });

  describe('when a template reference a scope value', function() {
    var age, scope;
    beforeEach(function() {
      app.$route({
        url: '/',
        template: 'My age is <span tg-bind="age"></span>',
        controller: function($scope) {
          scope = $scope;
          $scope.age = 31;
        }
      });
      app.$go();
    });

    it('should should evaluate in to the DOM', function() {
      expect(root.textContent).toEqual('My age is 31');
    });

    describe('when the value on the scope changes', function() {
      beforeEach(function() {
        scope.$apply(function() {
          scope.age = 100;
        });
      });

      it('changes the value in the template', function() {
        expect(root.textContent).toEqual('My age is 100');
      });
    });
  });

  pending('when the scope value', function() {
    describe('is a function', function() {
    });
    describe('is a collection', function() {
    });
    describe('is a string', function() {
    });
  });
});
