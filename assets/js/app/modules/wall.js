/**
 * Created by Jordan on 5/24/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlWall';

var angular = require('../../adapters/angular');

angular.module(moduleName, [require('../modules/global')])
    .service('wallService', [
        '$http',
        'globalService',
        function ($http, globalService) {
            this.getPosters = function () {
                return $http.get(globalService.apiUrl + '/posters')
                    .then(function (res) {
                        return res.data;
                    });
            }
        }
    ])
    .filter('search', function () {
        return function (posters, tagsString) {
            if (!posters) return posters;
            var tags = tagsString.split(' ');
            if (tags.length === 0) return posters;
            return posters.filter(function (poster) {
                for (var tag in tags) {
                    if (poster.tags.search(tags[tag]) >= 0) return true;
                }
                return false;
            });
        }
    })
    .directive('wall', [
        'wallService',
        function (wallService) {
            return {
                restrict: 'E',
                templateUrl: 'assets/html/wall.html',
                replace: true,
                controller: ['$scope', function ($scope) {

                    this.models = {
                        filter: ''
                    };
                    var self = this;

                    $scope.$on('filterChange', function (e, filter) {
                        self.models.filter = filter;
                    });

                    wallService.getPosters()
                        .then(function (posters) {
                            self.models.posters = posters;
                        });
                }],
                controllerAs: 'wallCtrl'
            }
        }
    ]);