/**
 * Created by Jordan on 5/21/2015.
 */
'use strict';

var angular = require('../adapters/angular');

var app = angular.module('wwl', [
    require('./modules/user'),
    require('./modules/panel'),
    require('./modules/posterUpload'),
    require('./modules/wall'),
    require('./modules/poster'),
    require('./modules/navbar'),
    require('./modules/poster-modal'),
    require('../adapters/angular-bootstrap'),
    require('../adapters/angular-animate')
]);

app.run(['$window', 'userFactory',
    function($window, userFactory) {

        $window.fbAsyncInit = function() {

            FB.init({
                appId: '1582722468643540',
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

    }]);