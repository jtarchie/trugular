describe('Templating', function() {
  'use strict';

  var app, body;

  beforeEach(function() {
    root.innerHTML = '<div id="body"></div>'
      + '<template id="/examples">Hello World!</template>';
      + '<template id="/both">Hello World!</template>';
    body = document.getElementById('body');
    app = new $trugular({rootElement: body});
    app.$route({
      url: '/examples'
    }).$route({
      url: '/both',
      template: 'Another Example'
    }).$route({
      url: '/hello',
      template: 'Goodbye'
    });
  });

  afterEach(function() { app.$destroy(); });

  describe('when the template is defined in the DOM', function() {
    it('renders it in the body', function() {
      app.$go('/examples');
      expect(body.textContent).toEqual('Hello World!');
    });
  });

  describe('when the template is defined as config option', function() {
    it('renders that in the body', function() {
      app.$go('/hello');
      expect(body.textContent).toEqual('Goodbye');
    });
  });

  describe('when the templates is defined as config and in DOM', function() {
    it('renders the config in the body', function() {
      app.$go('/both');
      expect(body.textContent).toEqual('Another Example');
    });
  });
});
