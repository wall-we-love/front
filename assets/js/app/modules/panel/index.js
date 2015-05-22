/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlPanel';

var angular = require('../../../adapters/angular');

angular.module(moduleName, [require('../user/index')])
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
        'panelFactory',
        'userFactory',
        function (panelFactory, userFactory) {

            var self = this;

            this.setPage = function (page) {
                if (page == 'home') {
                    userFactory.isLogged()
                        .then(function () {
                            self.page = panelFactory.pages['home'];
                        })
                        .catch(function () {
                            self.page = panelFactory.pages['not-logged']
                        });
                } else {
                    self.page = panelFactory.pages[page];
                }
            };

            this.register = {
                success: function () {
                    self.setPage('home');
                },
                cancel: function () {
                    self.setPage('home');
                }
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

