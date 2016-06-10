'use strict';

const path  = require('path'),
  BbPromise = require('bluebird'),
  fs        = BbPromise.promisifyAll(require('fs'));
  
module.exports = function(S) {

  S.classes.Project.newStaticMethod     = function() { console.log("A new method!"); };
  S.classes.Project.prototype.newMethod = function() { S.classes.Project.newStaticMethod(); };



  class UnitTestBoilplate extends S.classes.Plugin {

    constructor() {
      super();
      this.name = 'UnitTestBoilplate'; // Define your plugin's name
    }


    registerActions() {

      S.addAction(this._testScaffold.bind(this), {
        handler:       '_testScaffold',
        description:   'Create UnitTest Template',
        context:       'test',
        contextAction: 'scaffold'
      });

      return BbPromise.resolve();
    }

    _testScaffold(evt) {

      let _this = this;

      return new BbPromise(function (resolve, reject) {
        _this.mkdir('tests').then(function () {
          return _this.makeFile('tests/all.js', _this.getTestFile());
        }).then(function() {
          return _this.makeFile('.travis.yml', _this.getTravisFile());
        })
      });
      
    }
    
    mkdir(dirname){
      return new BbPromise(function(resolve, reject) {
        fs.mkdirAsync(dirname).then(function(dirname) { 
          return resolve(dirname);
        }).catch(function (error) {
          return reject('Already exists '+dirname+' folder');
        })
      });
    }
    
    makeFile(filepath, data){
      return new BbPromise(function(resolve, reject) {
        fs.writeFileAsync(filepath, data).then(function() { 
          return resolve();
        }).catch(function (error) {
          return reject('Already exists '+filepath+' file');
        })
      });
    }
    
    getTestFile() {
      return `'use strict';
// Unit tests for Serverless
// Generated by Serverless UnitTestBoilplate
const path       = require('path'),
      chai       = require('chai'),
      should     = chai.should(),
      Serverless = require('serverless')
      
describe('ServerlessProjectTest', function() {
  beforeEach(function(done) {
    this.timeout(0);

    s = new Serverless();

    s.init().then(function() {
      s.config.projectPath = __dirname + '/../';
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
      
      s.getProject().setFunction(new s.classes.Function(
        {
          name:"hello",
          runtime:"nodejs4.3"
        },
        __dirname + '/../hello/s-function.json'));
 
      done();
    });
    
  });
  
   describe('#funciton hello()', function() {
    it('should be funciton hello success', function() {
      return s.getProject().getFunction('hello').run('dev', 'ap-northeast-1', {})
      .then(result => {
        result.response.message.should.equal('Go Serverless! Your Lambda function executed successfully!')
      });
    });
  });
});
`;
    }

    getTravisFile(){
      return `
language: node_js

node_js:
  - '4'

sudo: false

install:
  - npm install -g serverless
  - npm install

script:
  - npm test
`;
    }

  }

  return UnitTestBoilplate;

};