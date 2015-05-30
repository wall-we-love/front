/**
 * Created by Jordan on 5/24/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.wall';

var angular = require('../../adapters/angular');

angular.module(moduleName, [
    require('./constants')
])
    .service('wallService', [
        '$http', 'API',
        function ($http, API) {
            this.getPosters = function () {
                return $http.get(API.URI + '/posters')
                    .then(function (res) {
                        return res.data;
                    });
            }
        }
    ])
    .filter('search', function () {
        return function (posters, tagsString) {
            if (!posters || !tagsString) return posters;
            var tags = tagsString.split(' ');
            if (tags.length === 0) return posters;
            return posters.filter(function (poster) {
                for (var tag in tags) {
                    if (tags.hasOwnProperty(tag) && poster.tags.search(tags[tag]) >= 0) return true;
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
                controller: ['$scope', '$location', function ($scope, $location) {

                    this.models = {
                        filter: ''
                    };
                    var self = this;

                    $scope.$watch(function () {
                        return $location.search();
                    }, function (value) {
                        self.models.filter = value.tag;
                    }, true);

                    wallService.getPosters()
                        .then(function (posters) {
                            self.models.posters = posters;
                        });
                }],
                controllerAs: 'wallCtrl'
            }
        }
    ]);