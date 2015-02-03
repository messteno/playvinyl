'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.controller('MainCtrl', function ($scope) {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr.push({
            author: 'Diarmaid O\'Meara',
            name: 'Supernatural Occurences Ep',
        });
    }
    $scope.vinyls = arr;
});

app.directive('owlCarousel', function () {
    return {
        templateUrl: 'static/app/main/carousel.html',
        link: function(scope, element) {
            window.$(element).owlCarousel({
                items: 1,
                autoplay: true,
                loop: true,
            });
        }
    };
});
