/**
 * Created by Jordan on 5/21/2015.
 */
'use strict';

var angular = require('../adapters/angular');

var app = angular.module('wwl', [
    require('./modules/user'),
    require('./modules/panel'),
    require('./modules/poster-upload'),
    require('./modules/wall'),
    require('./modules/poster'),
    require('./modules/navbar'),
    require('./modules/poster-modal'),
    require('../adapters/angular-bootstrap'),
    require('../adapters/angular-animate')
])
    .config(['$locationProvider',
        function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }
    ]);