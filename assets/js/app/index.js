/**
 * Created by Jordan on 5/21/2015.
 */
'use strict';

var angular = require('../adapters/angular');

angular.module('wwl', [
    require('./modules/user'),
    require('./modules/panel')
]);