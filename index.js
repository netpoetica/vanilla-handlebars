/**
 * @module VanillaHandlebars
 * @author Keith Rosenberg (netpoetica) <kthrose@netpoetica.com>
 * @link https://github.com/netpoetica/vanilla-handlebars
 * @description A View and Template  Manager for Handlebars templates.
 * @requires module:jofan/get-file
 * @requires module:wycats/handlebars.js
 */
module.exports = VanillaHandlebars;

/**
 * Repsonsible for Adding and Rendering Views, 
 * @constructor
 * @param {object} Handlebars - pass in Handlebars during instantiation.
 * @param {string} templatePath - the file path to your template folder.
 * @returns {object} A handle to the public API of this instance.
 */
function VanillaHandlebars(Handlebars, templatePath){

  // Dependencies
  var getFile = require('get-file');

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

  (function validatePath(){
    if(templatePath[templatePath.length -1] !== "/"){
      templatePath += "/";
    }
  }());

  /**
   * Emits a custom event on the DOM element stored in the private "el" property of this VanillaHandlebars instance.
   * @function
   * @private
   */
  var emit = function(name){
    var evtData = {
      name: name,
      view: views[name]
    };

    // Native (will not work < IE9)
    if(!window.jQuery){
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(e.viewLoaded, true, true, evtData);
      el.dispatchEvent(evt);
    } else {
      $(el).trigger(e.viewLoaded, evtData);
    }
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
  this.register = function(name, renderFn){
    if(typeof name === 'string' && typeof renderFn == 'function'){
      var target = templatePath + name + ".html";

      views[name] = {
        render: renderFn
      };

      getFile(target, function(err, res){
        if(err){
          templateLoadFailure(name, err);
        } else {
          // Success
          views[name].template = Handlebars.compile(res);
          emit(name);
        }
      });
    }
  };
  /**
   * 
   * @public
   * @instance
   * @param {string} name - should be the filename of your partial, minus the file extension (.html).
   * @example
   * // "home", "about", "contact"
   * @param {string} context - The compiled output data from the loaded Handlebars template after loading
   */
  this.render = function(name, context){
    var view = views[name];
    if(typeof view.render == 'function'){
      if(view.template){
        view.render(view.template(context));
      } else {
        var onViewLoaded = function(evt){
          var data = evt.detail;
          if(data.name === name){
            view.render(view.template(context));
          }
        };

        if(!window.jQuery){
          // Todo: xbrowser addEventListener
          el.addEventListener(e.viewLoaded, onViewLoaded);
        } else {
          $(el).on(e.viewLoaded, onViewLoaded);
        }
      }
    }
  };
}

VanillaHandlebars.prototype.toString = function(){
  return "[object VanillaHandlebars]";
};