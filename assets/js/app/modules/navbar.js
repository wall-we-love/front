/**
 * Created by Jordan on 5/28/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.navbar';

var angular = require('../../adapters/angular');

angular.module(moduleName, [])
    .controller('navbarController', [
        '$location', '$scope', '$rootScope',
        function ($location, $scope, $rootScope) {
            var self = this;
            this.panelDisplay = false;

            this.models = {};

            $scope.$watch(function () {
                return $location.search();
            }, function (res) {
                self.models.filter = res.tag;
            }, true);

            var updateTag = function () {
                $location.search('tag', self.models.filter);
            };

            this.searchKeyPress = updateTag;

            this.clickDismiss = function () {
                self.models.filter = '';
                updateTag();
            };

            this.togglePanel = function () {
                self.panelDisplay = !self.panelDisplay;
                $rootScope.$broadcast('togglePanel', self.panelDisplay);
            };
        }
    ])
    .directive('navbar', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/assets/html/navbar.html',
                controller: 'navbarController',
                controllerAs: 'navbarCtrl'
            }
        }
    ]);