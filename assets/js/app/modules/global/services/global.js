/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var angular = require('../../../../adapters/angular');

var serviceName = module.exports = 'globalService';

var globalModule = angular.module('wwlGlobal');

globalModule.service(serviceName, [function () {
    this.apiUrl = '/* @echo API_URI */';
    //@ifndef API_URI
    this.apiUrl = '';
    //@endif
}]);