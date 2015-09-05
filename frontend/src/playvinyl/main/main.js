'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app
.controller('MainCtrl', function ($scope, Vinyl) {
    $scope.vinyls = Vinyl.query(function() {
        $scope.htmlReady();
    });
})
.directive('owlCarousel', function () {
    return {
        templateUrl: 'static/html/main/carousel.html',
        link: function(scope, element) {
            window.$(element).owlCarousel({
                items: 1,
                autoplay: true,
                loop: true,
            });
        }
    };
})
;
