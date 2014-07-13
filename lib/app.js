(function(window, document) {
  'use strict';

  function $events() {
    var events = {};

    this.$on = function(names, func) {
      names.split(' ').forEach(function(name) {
        events[name] = events[name] || [];
        events[name].push(func);
      });
      return this;
    };

    this.$broadcast = function(name) {
      var args = arguments;
      if(name in events) {
        events[name].forEach(function(func) {
          func.apply(func, Array.prototype.slice.call(args, 1));
        });
      }
      return this;
    };
  };

  var $trugular = window.$trugular;

  if(!$trugular) {
    $trugular = function(options) {
      options = options || {};
      var rootElement = options.rootElement || document.body,
          routes = [], app = this, events = new $events(),
          directives = {};

      events.$on('route:change', function(route) {
        route.scope = Object.create(app);
        if(route.controller) {
          route.controller(route.scope);
        }
      });

      events.$on('route:change', function(route) {
        if(route.template) {
          rootElement.innerHTML = route.template;
          route.scope.$apply();
        }
      });

      app.$route = function(options) {
        options.template = options.template || document.getElementById(options.url).innerHTML;
        if(options.url.slice(-1) !== '/') { options.url += '\/?'; }
        options.url = new RegExp("^" + options.url + "$");

        routes.push(options);
        return this;
      };

      function currentPath() {
        app.$go(window.location.pathname, true);
      }

      function clickHandler(event) {
        if(event.target.tagName === 'A') {
          event.preventDefault();
          app.$go(event.target.pathname);
        }
      }

      app.$run = function() {
        window.addEventListener('popstate', currentPath);
        rootElement.addEventListener('click', clickHandler);
        currentPath();
        return this;
      };

      app.$destroy = function() {
        window.removeEventListener('popstate', currentPath);
        rootElement.removeEventListener('click', clickHandler);
      };

      app.$go = function(path, replace) {
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
        events.$broadcast('route:change', Object.create(foundRoute));
        return this;
      };

      app.$directive = function(name, func) {
        directives[name] = func;
      };

      app.$events = events;
      app.$rootElement = rootElement;

      app.$apply = function() {
        var scope = this;
        var selector = Object.keys(directives).map(function(name) {
          return '[tg-' + name + ']';
        }).join(',');

        var elements = rootElement.querySelectorAll(selector);
        Array.prototype.forEach.call(elements, function(element) {
          for(var name in directives) {
            var attributeName = 'tg-' + name;
            if(element.hasAttribute(attributeName)) {
              directives[name](scope, element, element.getAttribute(attributeName));
            }
          }
        });
      }

      app.$directive('bind', function(scope, element, value) {
        element.innerHTML = scope[value];
      });
    };
  }

  window.$trugular = $trugular;

})(window, document);
