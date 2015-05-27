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
                return $http.get(globalService.apiUrl + '/posters/' + posterId);
            }
        }
    ])
    .directive('poster', [
        'posterService',
        function (posterService) {
            return {
                restrict: 'E',
                templateUrl: 'assets/html/poster.html',
                replace: true,
                scope: {
                    posterId: '@'
                },
                link: function ($scope, $element) {
                    $scope.yolo = function () {
                        console.log('HELLO');
                    };
                    posterService.getPoster($scope.posterId)
                        .then(function (data) {
                            var imgTag = new Image();
                            imgTag.src = data.data.fileData;
                            imgTag.style.position = 'absolute';
                            imgTag.style.top = data.data.pos_y + 'px';
                            imgTag.style.left = data.data.pos_x + 'px';
                            imgTag.style.width = data.data.width + 'px';
                            imgTag.style.height = data.data.height + 'px';
                            $element.append(imgTag);
                            console.log(imgTag);
                            console.log(data);
                        })
                }
            }
        }
    ]);