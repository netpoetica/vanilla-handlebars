/**
 * @module VanillaHandlebars
 * @author Keith Rosenberg (netpoetica) <kthrose@netpoetica.com>
 * @link https://github.com/netpoetica/vanilla-handlebars
 * @description A View and Template  Manager for Handlebars templates.
 */
module.exports = VanillaHandlebars;

/**
 * Repsonsible for Adding and Rendering Views, 
 * @constructor
 * @param {object} Handlebars - pass in Handlebars during instantiation.
 * @param {string} templatePath - the file path to your template folder.
 * @param {boolean} bAsync - if true, force VanillaHandlebars to use async requests when possible.
 * @returns {object} A handle to the public API of this instance.
 */
function VanillaHandlebars(Handlebars, templatePath, bAsync){

  /**
   * View Management via views object
   * @private
   */
  var views = {},
  /**
   * Using the window or body for event dispatching.
   * @private
   */
  el = window || document.body || document.getElementsByTagName('body')[0],
  /*
   * Named events container.
   * @private
   */
  e = {
    /**
     * @event
     */
    viewLoaded: "VIEW_LOADED"
  };

  /**
   * Set async false in case you need to render a view right away.
   * If you have a routing mechanism in place, you can probably set this to true or remove the line.
   * You will get an error like 'template' is not a function if you are having synchronization problems
   * @private
   */
  bAsync = typeof bAsync !== 'boolean' ? false : bAsync;

  /**
   * Emits a custom event on the DOM element stored in the private "el" property of this VanillaHandlebars instance.
   * @function
   * @private
   */
  var emit = function(name){
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(e.viewLoaded, true, true, {
      name: name,
      view: views[name]
    });
    el.dispatchEvent(evt);
  };

  /**
   * @throws Will throw an error if the AJAX request fails to load the requested template from the templatePath
   * @function
   * @private
   */
  var templateLoadFailure = function(name, err){
    throw new Error("Unable to load " + name + " template. ", err);
  };

  // Public API.
  return {
    /**
     * Registers a template by name and assigns a render function to it.
     * @public
     * @instance
     * @param {string} name - should be the filename of your partial, minus the file extension (.html).
     * @example
     * // "home", "about", "contact"
     * @param {function} renderFn - function which will be called when you render this template via vanillaHandlebars.render("myTemplate")
     * @callback
     */
    register: function(name, renderFn){
      if(typeof name === 'string' && typeof renderFn == 'function'){
        var _this = this,
            target = templatePath + name + ".html";

        views[name] = {
          render: renderFn
        };

        var req = new XMLHttpRequest();
        req.open("GET", target, bAsync);
        req.onreadystatechange = function(){
          // Bail on failure.
          if(req.readyState != 4 || req.status != 200){
            return;
          } else {
            // Success
            views[name].template = Handlebars.compile(req.responseText);
            emit(name);
          }
        };
        req.send();

      }
    },
    /**
     * 
     * @public
     * @instance
     * @param {string} name - should be the filename of your partial, minus the file extension (.html).
     * @example
     * // "home", "about", "contact"
     * @param {string} context - The compiled output data from the loaded Handlebars template after loading
     */
    render: function(name, context){
      var view = views[name];
      if(typeof view.render == 'function'){
        if(view.template){
          view.render(view.template(context));
        } else {
          el.addEventListener(e.viewLoaded, function(evt){
            var data = evt.detail;
            if(data.name === name){
              view.render(view.template(context));
            }
          });
        }
      }
    }
  }
};