'use strict';

const Serverless = require('serverless'),
      path       = require('path'),
      chai       = require('chai'),
      should     = chai.should();

let s, plugin, UnitTestBoilerplate, instance;

describe('ServerlessUnitTestBoilerplate', function() {
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
      CmdEventPlugin.getName().should.equal('UnitTestBoilerplate');
    });
  });
  
  describe('serverless test scaffold', function() {
    it('should built unittest template', function(done) {
      this.timeout(0);
      let options = {
        testdir: 'tests/tests',
        testfile: 'tests/tests/panpan.js',
        travisfile: 'tests/.travis.yml'
      };

      s.actions.testScaffold(options)
         .then(function(evt) {
           done();
         })
         .catch(e => {
           done(e);
         });
    });
  });
});