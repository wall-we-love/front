/**
 * Created by Jordan on 5/29/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlPosterModal';

var angular = require('../../adapters/angular');

angular.module(moduleName, [])
    .directive('posterModal', [
        function () {
            return {
                restrict: 'E',
                controller: [
                    '$scope',
                    '$modal',
                    function ($scope, $modal) {

                        this.models = {};
                        var self = this;
                        var modalInstance;


                        $scope.$on('posterClick', function (e, poster) {
                            self.models.poster = poster;
                            modalInstance = $modal.open({
                                animation: true,
                                templateUrl: '/assets/html/poster-modal.html',
                                controller: ['$scope', function ($scope) {
                                    $scope.models = {
                                        poster: poster
                                    };
                                }]
                            });
                        });
                    }
                ],
                controllerAs: 'posterModalCtrl'
            }
        }
    ]);