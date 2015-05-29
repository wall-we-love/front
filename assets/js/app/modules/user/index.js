/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var angular = require('../../../adapters/angular');

var moduleName = module.exports = 'wwlUser';

angular.module(moduleName, [
    require('../global/index'),
    require('../../../adapters/base64'),
    require('../../../adapters/angular-cookies')
]).factory('userFactory', [
    '$q',
    '$http',
    '$base64',
    '$cookies',
    '$rootScope',
    require('../global/services/global'),
    function ($q, $http, $base64, $cookies, $rootScope, globalService) {

        var user = {
            token: $cookies.token
        };

        var setToken = function (data) {
            $cookies.token = user.token = data.value;
            $rootScope.$broadcast('loggedIn');
            return true;
        };

        var login = function (options) {
            return $http.post(globalService.apiUrl + '/user/token/email', {}, {
                headers: { 'Authorization': 'Basic ' + $base64.encode(options.email + ':' + options.password) }
            })
                .then(function (res) {
                    return setToken(res.data);
                });
        };

        var facebookLogin = function (opts) {
            return $http.post(globalService.apiUrl + '/user/token/facebook', {
                access_token: opts.access_token
            })
                .then(function (res) {
                    return setToken(res.data);
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
                .then(function (res) {
                    user.id = res.data.id;
                    user.email = res.data.email;
                    return user;
                });
        };

        var isLogged = function () {
            return $q(function (resolve){
                if (!user.token) return resolve(false);
                return getMe()
                    .then(function () {
                        return resolve(true);
                    })
                    .catch(function () {
                        return resolve(false);
                    });
            });
        };

        var postPoster = function (poster) {
            return $http.post(globalService.apiUrl + '/posters', {
                name: poster.name,
                description: poster.description,
                pos_x: poster.pos_x,
                pos_y: poster.pos_y,
                height: poster.height,
                width: poster.width,
                fileData: poster.fileData
            }, { headers: { 'Authorization': 'Bearer ' + user.token } });
        };

        var startFacebook = function () {
            FB.getLoginStatus(function(res) {
                isLogged()
                    .then(function (status) {
                        if (!status && res.status === 'connected') {
                            facebookLogin({ access_token: res.authResponse.accessToken })
                        }
                    });
            });
        };
        
        var initFacebookLogin = function () {
            FB.login(function (res) {
                facebookLogin({ access_token: res.authResponse.accessToken });
            }, { scope: 'email' });
        };

        return {
            user: user,
            login: login,
            register: register,
            isLogged: isLogged,
            postPoster: postPoster,
            startFacebook: startFacebook,
            initFacebookLogin: initFacebookLogin
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
]).controller('loginController', [
    'userFactory',
    '$scope',
    function (userFactory, $scope) {

        var self = this;

        this.submit = function () {
            userFactory.login({ email: self.email, password: self.password })
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
]).directive('wwlLogin', [
    function () {
        return {
            restrict: 'E',
            controller: 'loginController',
            controllerAs: 'loginCtrl',
            templateUrl: 'assets/html/user/login.html',
            scope: {
                onCancel: '=',
                onSuccess: '='
            }
        }
    }
]);