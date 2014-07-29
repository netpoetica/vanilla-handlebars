describe('Instance', function(){
  var vh = new VanillaHandlebars(Handlebars, "./partials");

  it('should report "[object VanillaHandlebars]" from toString()', function(){
    expect(vh.toString()).to.equal("[object VanillaHandlebars]");
  });
});

describe('The public API', function(){
  var vh = new VanillaHandlebars(Handlebars, "./partials");
  it('should contain a register function', function(){
    expect(typeof vh.register).to.equal("function");
  });
  it('should contain a render function', function(){
    expect(typeof vh.render).to.equal("function");
  })
});

describe('Errors should be thrown', function(){
  var vh = new VanillaHandlebars(Handlebars, "./partials");

  it('when non-string value passed as first param to the register function', function(){
    try {
      vh.register(0191091, function(){});
    } catch(e){
      expect(e instanceof Error).to.equal(true);
    }
  });

  /* This can't be tested without promises or yield, and I don't want to require it just to test this module 
  it('when non-existent file is passed to the register function', function(){
    try {
      vh.register('hello', function(){});
    } catch(e){
      expect(e instanceof Error).to.equal(true);
    }
  });
  */
});

describe('Partials dir specified as string passed instead of options object (legacy)', function(){
  var vh = new VanillaHandlebars(Handlebars, "./partials");

  it('should render after async load', function(done){
    vh.register('markup', function(data){

      done();
    });

    // Render actually calls the done function.
    vh.render('markup');
  });
});


describe('A set of templates with the same file extension', function(){

  var vh = new VanillaHandlebars(Handlebars, {
    templatePath: "templates",
    templateFileType: "hbr"
  });

  it('should render index.hbr after async load using options.templateFileType', function(done){
    vh.register('index', function(data){
      done();
    });

    // Render actually calls the done function.
    vh.render('index');
  });

  it('should render footer.hbr after async load via "footer" without extension', function(done){
    vh.register('footer.hbr', function(data){
      done();
    });

    // Render actually calls the done function.
    vh.render('footer');
  });

  it('should render header.hbr after async load via "header.hbr" with extension', function(done){
    vh.register('header.hbr', function(data){
      done();
    });

    // Render actually calls the done function.
    vh.render('header.hbr');
  });

  it('should render home.html after async load via "home" with specified extension different from options.templateFileType', function(done){
    vh.register('home.html', function(data){
      done();
    });

    // Render actually calls the done function.
    vh.render('home');
  });

  it('should render home.html after async load via "home.html" with specified extension different from options.templateFileType', function(done){
    vh.register('home.html', function(data){
      done();
    });

    // Render actually calls the done function.
    vh.render('home.html');
  });

});