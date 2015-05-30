/**
 * Created by Jordan on 5/29/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.posterModal';

var angular = require('../../adapters/angular');

angular.module(moduleName, [])
    .directive('posterModal', [
        function () {
            return {
                restrict: 'E',
                controller: [
                    '$scope', '$modal', '$location',
                    function ($scope, $modal, $location) {

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

                                    $scope.clickTag = function (tag) {
                                        $location.search('tag', tag);
                                        modalInstance.dismiss();
                                    }
                                }]
                            });
                        });
                    }
                ],
                controllerAs: 'posterModalCtrl'
            }
        }
    ]);