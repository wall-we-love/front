/**
 * Created by Jordan on 5/29/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.constants';

var angular = require('../../adapters/angular');

angular.module(moduleName, [])
    .constant('FB', {
        'APP_ID': '/* @echo FB_APP_ID */'
    })
    .constant('API', {
        'URI': '/* @echo API_URI */'
    });