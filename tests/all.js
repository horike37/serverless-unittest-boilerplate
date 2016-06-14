'use strict';

const Serverless = require('serverless'),
      path       = require('path'),
      chai       = require('chai'),
      should     = chai.should(),
      fs         = require('fs');
      chai.use(require('chai-fs'));

let s, plugin, UnitTestBoilerplate, instance;
let options = {
      testdir   : 'tests/tests',
      testfile  : 'tests/tests/panpan.js',
      travisfile: 'tests/.travis.yml'
    };

describe('ServerlessUnitTestBoilerplate', function() {

  after(function() {
    this.timeout(0);
    console.log(fs.unlinkSync(options.testfile));
    fs.unlinkSync(options.travisfile);
    fs.rmdirSync(options.testdir);
  });
  
  beforeEach(function(done) {
    this.timeout(0);

    s = new Serverless();

    s.init().then(function() {
      UnitTestBoilerplate = require('..')(s);
      plugin = new UnitTestBoilerplate(s);

      s.addPlugin(plugin);
      s.config.projectPath = __dirname;
      s.setProject(new s.classes.Project({
        stages: {
          dev: { regions: { 'ap-northeast-1': {} }}
        },
        variables: {
          project: 'serverless-project',
          stage: 'dev',
          region: 'ap-northeast-1'
        }
      }));
      done();
    });
  });

  describe('getName()', function() {
    it('should return the correct name', function() {
      UnitTestBoilerplate.getName().should.equal('UnitTestBoilerplate');
    });
  });
  
  describe('serverless test scaffold', function() {
    it('should built unittest template', function(done) {
      this.timeout(0);

      s.actions.testScaffold(options)
         .then(function(options) {
           options.testdir.should.be.a.directory();
           done();
         })
         .catch(e => {
           done(e);
         });
    });
  });
});