/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.panel';

var angular = require('../../adapters/angular');

angular.module(moduleName, [
    require('./user')
])
    .factory('panelFactory', [
        function () {

            var pages = {
                'home': 'assets/html/panel/panel-home.html',
                'not-logged': 'assets/html/panel/panel-not-logged.html',
                'register': 'assets/html/panel/panel-register.html',
                'login': 'assets/html/panel/panel-login.html'
            };

            return {
                pages: pages
            };

        }
    ])
    .controller('panelController', [
        '$scope', 'panelFactory', 'userFactory',
        function ($scope, panelFactory, userFactory) {

            var self = this;
            self.display = false;

            this.setPage = function (page) {
                if (page == 'home') {
                    userFactory.isLogged()
                        .then(function (status) {
                            if (status) {
                                self.page = panelFactory.pages['home'];
                            } else {
                                self.page = panelFactory.pages['not-logged']
                            }
                        });
                } else {
                    self.page = panelFactory.pages[page];
                }
            };

            $scope.$on('togglePanel', function (e, data) {
                self.display = data;
            });

            $scope.$on('loggedIn', function () {
                self.setPage('home');
            });

            $scope.$on('loggedOff', function () {
                self.setPage('home');
            });

            this.register = {
                success: function () {},
                cancel: function () {
                    self.setPage('home');
                }
            };

            this.facebookLogin = function () {
                userFactory.initFacebookLogin();
            };

            self.setPage('home');

        }
    ])
    .directive('wwlPanel', [
        function () {
            return {
                templateUrl: 'assets/html/panel/index.html',
                restrict: 'E',
                controller: 'panelController',
                controllerAs: 'panelCtrl'
            }
        }
    ]);

