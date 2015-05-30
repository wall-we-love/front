/**
 * Created by Jordan on 5/24/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.poster';

var angular = require('../../adapters/angular');

angular.module(moduleName, [
    require('./constants')
])
    .factory('Poster', function () {
        function Article (data) {
            angular.extend(this, {
                id: '',
                name: '',
                fileData: '',
                description: '',
                tags: '',
                pos_x: 0,
                pos_y: 0,
                width: 0,
                height: 0,
                link: ''
            }, data)
        }

        Article.prototype.getTagsArray = function () {
            return this.tags.split(' ');
        };

        return Article;
    })
    .service('posterService', [
        '$http', 'Poster', 'API',
        function ($http, Poster, API) {
            this.getPoster = function (posterId) {
                return $http.get(API.URI + '/posters/' + posterId)
                    .then(function (res) {
                        return new Poster(res.data);
                    });
            }
        }
    ])
    .directive('poster', [
        '$rootScope', 'posterService',
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
                            imgTag.style.top = poster.pos_y + '%';
                            imgTag.style.left = poster.pos_x + '%';
                            imgTag.style.width = poster.width + 'px';
                            imgTag.style.height = poster.height + 'px';
                            $element.append(imgTag);
                        })
                }
            }
        }
    ]);