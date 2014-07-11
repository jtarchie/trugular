(function(window, document) {
  'use strict';

  function $events() {
    var events = {};

    this.$on = function(name, func) {
      events[name] = events[name] || [];
      events[name].push(func);
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
          routes = [], self = this, events = new $events();

      events.$on('route:change', function(route) {
        rootElement.innerHTML = route.template;
      });

      self.$route = function(options) {
        options.template = options.template || document.getElementById(options.url).innerHTML;
        if(options.url.slice(-1) !== '/') { options.url += '\/?'; }
        options.url = new RegExp("^" + options.url + "$");

        routes.push(options);
        return self;
      };

      function currentPath() {
        self.$go(window.location.pathname, true);
      }

      function clickHandler(event) {
        if(event.target.tagName === 'A') {
          event.preventDefault();
          self.$go(event.target.pathname);
        }
      }

      self.$run = function() {
        window.addEventListener('popstate', currentPath);
        rootElement.addEventListener('click', clickHandler);
        currentPath();
        return self;
      };

      self.$destroy = function() {
        window.removeEventListener('popstate', currentPath);
        rootElement.removeEventListener('click', clickHandler);
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
        events.$broadcast('route:change', foundRoute);
        return self;
      };

      self.$events = events;
      self.$rootElement = rootElement;
    };
  }

  window.$trugular = $trugular;

})(window, document);
