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
 * @param {string} opts.templatePath - the file path to your template folder.
 * @param {string} opts.templateFileType - the file extension of the files in your templatePath.
 * @returns {object} A handle to the public API of this instance.
 */
function VanillaHandlebars(Handlebars, opts){
  opts = opts || {};

  var templatePath = opts.templatePath || './',
      templateFileType = opts.templateFileType || 'html';

  // Support legacy use of VanillaHandlebars where opts was just a string.
  if(typeof opts === 'string'){
    templatePath = opts;
  }

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
  function emit(name){
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
      // Use jquery if we have it. Should allow support of old IE.
      $(el).trigger(e.viewLoaded, evtData);
    }
  };

  /**
   * Get the path of the path you need
   * @private
   * @param {string} filename - the filename of the template you're working on.
   * @param {boolean} bExtension - true if you want to return "html" out of "index.html", false if you want "index" out of "index.html"
   */
  function parseFilename(filename, bExtension){
    if(typeof filename !== 'string') throw new Error('Error parsing filename: ' + filename + ' is not a string.');

    var match = filename.match(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/)

    // If bExtension is true, you will get "html" out of "index.min.html"
    // otherwise you will get "index.min" out of "index.min.html"
    // Offset the first option which returns the full path.
    bExtension = (Number(bExtension) || 0) + 1;

    return match[bExtension];
  }

  /**
   * @throws Will throw an error if the AJAX request fails to load the requested template from the templatePath
   * @function
   * @private
   */
  function templateLoadFailure(name, err){
    throw new Error("Unable to load " + name + " template. ", err);
  };

  // Public API.
  /**
   * Registers a template by name and assigns a render function to it.
   * @public
   * @instance
   * @param {string} name - should be the filename of your partial, plus or minus the file extension.
   * @example
   * // "home", "about", "contact"
   * @param {function} renderFn - function which will be called when you render this template via vanillaHandlebars.render("myTemplate")
   * @callback
   */
  this.register = function(name, renderFn){
    var filename = parseFilename(name),
        filetype = parseFilename(name, true);

    if(typeof name === 'string' && typeof renderFn == 'function'){
      var target = templatePath + filename + "." + (filetype || templateFileType);

      views[filename] = {
        render: renderFn
      };

      getFile(target, function(err, res){
        if(err){
          templateLoadFailure(filename, err);
        } else {
          // Success
          views[filename].template = Handlebars.compile(res);
          emit(filename);
        }
      });
    }
  };
  /**
   * 
   * @public
   * @instance
   * @param {string} name - should be the filename of your partial, plus or minus the file extension.
   * @example
   * // "home", "about", "contact"
   * @param {string} context - The compiled output data from the loaded Handlebars template after loading
   */
  this.render = function(name, context){
    var filename = parseFilename(name),
        filetype = parseFilename(name, true);

    var view = views[filename];
    if(typeof view.render == 'function'){
      if(view.template){
        view.render(view.template(context));
      } else {
        var onViewLoaded = function(evt){
          var data = evt.detail;
          if(data.name === filename){
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