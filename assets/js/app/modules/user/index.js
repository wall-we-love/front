/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var angular = require('../../../adapters/angular');

var moduleName = module.exports = 'wwlUser';

angular.module(moduleName, [
    require('../global/index'),
    require('../../../adapters/base64')
]).factory('userFactory', [
    '$q',
    '$http',
    '$base64',
    require('../global/services/global'),
    function ($q, $http, $base64, globalService) {

        var user = {};

        var login = function (options) {
            return $http.post(globalService.apiUrl + '/user/token/email', {}, {
                headers: { 'Authorization': 'Basic ' + $base64.encode(options.email + ':' + options.password) }
            })
                .then(function (body) {
                    user.token = body.value;
                    return true;
                });
        };

        var register = function (options) {
            return $http.post(globalService.apiUrl + '/user/register/email', options)
                .catch(function () {
                    return false;
                })
                .then(function () {
                    return login(options);
                });
        };

        var getMe = function () {
            return $http.get(globalService.apiUrl + '/me', { headers: { 'Authorization': 'Bearer ' + user.token } })
                .then(function (me) {
                    user.id = me.id;
                    user.email = me.email;
                    return user;
                });
        };

        var isLogged = function () {
            return $q(function (resolve, reject){
                if (!user.token) return reject();
                return resolve(getMe());
            });
        };

        return {
            user: user,
            login: login,
            register: register,
            isLogged: isLogged
        };

}]).controller('registerController', [
    'userFactory',
    '$scope',
    function (userFactory, $scope) {

        var self = this;

        this.submit = function () {
            userFactory.register({ email: self.email, password: self.password })
                .then($scope.onSuccess);
        };

        this.cancel = $scope.onCancel;

    }
]).directive('wwlRegister', [
    function () {
        return {
            restrict: 'E',
            controller: 'registerController',
            controllerAs: 'registerCtrl',
            templateUrl: 'assets/html/user/register.html',
            scope: {
                onCancel: '=',
                onSuccess: '='
            }
        }
    }
]);