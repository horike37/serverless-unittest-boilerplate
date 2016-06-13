[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
# Serverless UnitTest Boilerplate
## Overview
This module is Serverless Framework plugin. Create UnitTest boilerplate in a Serverless Project.
Generated `.travis.yml` and `tests/all.js`.

## Install
Execute npm install in your Serverless project.

    $ npm install serverless-unittest-boilerplate

Add the plugin to your s-project.json file

    "plugins": [
      "serverless-unittest-boilerplate"
    ]

Add the scripts to pakage.json file

    "scripts": {
        "test": "export NODE_PATH=`npm root -g` && mocha tests/all"
    }
    
Install `mocha` and `chai`. Run command below;

    $ npm install chai --save-dev
    $ npm install mocha --save-dev

## Usage
Run command below.

    $ serverless test scaffold
    
## Sample Screen
The screen is succeed to build in travis
<img src="https://raw.githubusercontent.com/horike37/serverless-unittest-boilerplate/master/screenshot-1.png" title="travis"/>
