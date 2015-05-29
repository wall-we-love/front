/**
 * Created by Jordan on 5/24/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlPoster';

var angular = require('../../adapters/angular');

angular.module(moduleName, [require('./global')])
    .service('posterService', [
        '$http',
        'globalService',
        function ($http, globalService) {
            this.getPoster = function (posterId) {
                return $http.get(globalService.apiUrl + '/posters/' + posterId)
                    .then(function (res) {
                        return res.data;
                    });
            }
        }
    ])
    .directive('poster', [
        '$rootScope',
        'posterService',
        function ($rootScope, posterService) {
            return {
                restrict: 'E',
                templateUrl: 'assets/html/poster.html',
                replace: true,
                scope: {
                    posterId: '='
                },
                link: function ($scope, $element) {

                    $scope.models = {};

                    $scope.clickPoster = function () {
                        $rootScope.$broadcast('posterClick', $scope.models.poster);
                    };

                    posterService.getPoster($scope.posterId)
                        .then(function (poster) {
                            $scope.models.poster = poster;
                            var imgTag = new Image();
                            imgTag.src = poster.fileData;
                            imgTag.style.position = 'absolute';
                            imgTag.style.top = poster.pos_y + 'px';
                            imgTag.style.left = poster.pos_x + 'px';
                            imgTag.style.width = poster.width + 'px';
                            imgTag.style.height = poster.height + 'px';
                            $element.append(imgTag);
                        })
                }
            }
        }
    ]);