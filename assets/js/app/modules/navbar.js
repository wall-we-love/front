/**
 * Created by Jordan on 5/28/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlNavbar';

var angular = require('../../adapters/angular');

angular.module(moduleName, [])
    .controller('navbarController', [
        '$scope',
        '$rootScope',
        function ($scope, $rootScope) {
            var self = this;
            this.panelDisplay = false;

            this.models = {};

            this.togglePanel = function () {
                self.panelDisplay = !self.panelDisplay;
                $rootScope.$broadcast('togglePanel', self.panelDisplay);
            };

            $scope.$watch(function () { return self.models.filter }, function (current) {
                $rootScope.$broadcast('filterChange', current);
            }, true);
        }
    ])
    .directive('navbar', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'assets/html/navbar.html',
                controller: 'navbarController',
                controllerAs: 'navbarCtrl'
            }
        }
    ]);