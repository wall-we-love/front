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
                return $http.get(globalService.apiUrl + '/posters');
            }
        }
    ])
    .directive('wall', [
        '$compile',
        'wallService',
        function ($compile, wallService) {
            return {
                restrict: 'E',
                templateUrl: 'assets/html/wall.html',
                replace: true,
                link: function ($scope, $element) {
                    wallService.getPosters()
                        .then(function (posters) {
                            console.log(posters);
                            posters.data.forEach(function (poster) {
                                console.log($element[0]);
                                console.log(poster);
                                var posterTag = $compile('<poster poster-id="' + poster.id + '"></poster>')($scope);
                                //$element[0].appendChild(posterTag);
                                $element.append(posterTag);
                                console.log(posterTag);
                            });
                        });
                }
            }
        }
    ]);