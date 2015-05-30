/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var angular = require('../../adapters/angular');

var moduleName = module.exports = 'wwl.user';

angular.module(moduleName, [
    require('./constants'),
    require('../../adapters/base64'),
    require('../../adapters/angular-cookies')
]).run([
    '$window', 'userFactory', 'FB',
    function($window, userFactory, FB_CONST) {

        $window.fbAsyncInit = function() {

            FB.init({
                appId: FB_CONST.APP_ID,
                status: true,
                xfbml: true,
                version: 'v2.3'
            });

            userFactory.startFacebook();

        };

        (function(d){
            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

    }
]).factory('userFactory', [
    '$q', '$http', '$base64', '$cookies', '$rootScope', 'API',
    function ($q, $http, $base64, $cookies, $rootScope, API) {

        var user = {
            token: $cookies.token
        };

        var setToken = function (data) {
            $cookies.token = user.token = data.value;
            $rootScope.$broadcast('loggedIn');
            return true;
        };

        var login = function (options) {
            return $http.post(API.URI + '/user/token/email', {}, {
                headers: { 'Authorization': 'Basic ' + $base64.encode(options.email + ':' + options.password) }
            })
                .then(function (res) {
                    return setToken(res.data);
                });
        };

        var facebookLogin = function (opts) {
            return $http.post(API.URI + '/user/token/facebook', {
                access_token: opts.access_token
            })
                .then(function (res) {
                    return setToken(res.data);
                });
        };

        var register = function (options) {
            return $http.post(API.URI + '/user/register/email', options)
                .catch(function () {
                    return false;
                })
                .then(function () {
                    return login(options);
                });
        };

        var getMe = function () {
            return $http.get(API.URI + '/me', { headers: { 'Authorization': 'Bearer ' + user.token } })
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
            console.log('post', poster);
            return $http.post(API.URI + '/posters', poster, { headers: { 'Authorization': 'Bearer ' + user.token } });
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
    'userFactory', '$scope',
    function (userFactory, $scope) {

        var self = this;

        this.submit = function () {
            userFactory.register({ email: self.email, password: self.password })
                .then($scope.onSuccess);
        };

        this.cancel = $scope.onCancel;

    }
]).controller('loginController', [
    'userFactory', '$scope',
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
            templateUrl: '/assets/html/user/register.html',
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
            templateUrl: '/assets/html/user/login.html',
            scope: {
                onCancel: '=',
                onSuccess: '='
            }
        }
    }
]);