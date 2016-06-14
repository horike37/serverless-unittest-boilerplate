'use strict';

const Serverless = require('serverless'),
      path       = require('path'),
      chai       = require('chai'),
      should     = chai.should(),
      fs         = require('fs');

let s, plugin, UnitTestBoilerplate, instance;
let options = {
      unittestdir : 'testdir', 
      testdir     : 'testdir/tests',
      testfile    : 'testdir/tests/panpan.js',
      travisfile  : 'testdir/.travis.yml'
    };

describe('ServerlessUnitTestBoilerplate', function() {

  after(function(done) {
    this.timeout(0);
    fs.unlinkSync(options.travisfile);
    fs.unlinkSync(options.testfile);
    fs.rmdirSync(options.testdir);
    fs.rmdirSync(options.unittestdir);
    done();
  });
  
  before(function(done) {
    this.timeout(0);
    fs.mkdirSync(options.unittestdir);
    done();
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
          region: 'us-east-1'
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

      s.actions.testScaffold(options).then(function(path) {
        fs.existsSync(options.travisfile).should.equal(true);
        fs.existsSync(options.testfile).should.equal(true);
        done();
      });   
    });
  });
});