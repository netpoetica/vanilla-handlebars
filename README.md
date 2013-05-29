vanilla-handlebars
==================

A plain old JS object that can automate the process of loading in Handlebars templates - primarily used to prevent having to load in a dozen script tags to your index.html file.


## How to Use Vanilla Handlebars
This module expects two arguments during instantiation: a reference to the Global Handlebars object, and a path string from the root to the folder containing your templates:

````javascript
var vanillaHandlebars = new VanillaHandlebars(window.Handlebars, 'static/js/templates/');
````

After instantiation, you register your templates as views like so:

````javascript
vanillaHandlebars.register('fileName', function(data){
  // fileName represents a .html file in your template folder. Later, in order to render this template you will
  // have to call it by the string specified as fileName here.

  // The data argument to the callback function represents data the user may pass to render the compled Handlebars file. 
  // The render function will pass that data to the compiled Handlebars file and then data will be the HTML returned from the template.
  console.log(data);
  $('#content').html(data)
});
````

The register function will compile your Handlebars templates and have them waiting for use by simply calling the render function. The render function is a reference to the anonymous function you passed to register:

````javascript
var newUser = data;    // From an AJAX function.

vanillaHandlebars.render('fileName', { user: newUser });
````
