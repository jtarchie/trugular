(function(window, document) {
  'use strict';

  var $trugular = window.$trugular;

  if(!$trugular) {
    $trugular = function(options) {
      options = options || {};
      var rootElement = options.rootElement || document.body,
          routes = [], self = this;

      self.$route = function(options) {
        if(options.url.slice(-1) !== '/') { options.url += '\/?'; }
        options.url = new RegExp("^" + options.url + "$");

        routes.push(options);
        return self;
      };

      self.$run = function() {
        window.addEventListener('popstate', function(event) {
          self.$go(window.location.pathname, true);
        });
        rootElement.addEventListener('click', function(event) {
          if(event.target.tagName === 'A') {
            event.preventDefault();
            self.$go(event.target.pathname);
          }
        });
        self.$go(window.location.pathname, true);
        return self;
      };

      self.$go = function(path, replace) {
        path = path || '/';

        var foundRoute;
        routes.forEach(function(route) {
          var matches = route.url.exec(path);
          if(matches && matches.length > 0) {
            foundRoute = route;
          }
        });

        if(!foundRoute) { throw('Could not find route ' + path); }
        if(replace) {
          window.history.replaceState({}, "", path);
        } else{
          window.history.pushState({}, "", path);
        }
        rootElement.innerHTML = foundRoute.template;
        return self;
      };
    };
  }

  window.$trugular = $trugular;

})(window, document);
