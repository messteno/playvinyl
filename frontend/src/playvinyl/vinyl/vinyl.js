'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app
.service('Vinyl', function(djResource) {
    var Vinyl = djResource('/api/store/vinyl/:slug/', { slug: '@slug' });
    return Vinyl;
})
.service('VinylAuthors', function(djResource) {
    var VinylAuthors = djResource('/api/store/authors/:slug/', { slug: '@slug' });
    return VinylAuthors;
})
.service('VinylLabels', function(djResource) {
    var VinylLabels = djResource('/api/store/labels/:slug/', { slug: '@slug' });
    return VinylLabels;
})
.controller('VinylItemController', function($scope, $stateParams, $state, Vinyl) {
    $scope.vinyl = Vinyl.get({'slug': $stateParams.slug }, function() {
        $scope.htmlReady();
    }, function() {
        $state.go('404');
    });
})
.controller('VinylAuthorController', function($scope, $timeout, $stateParams, Vinyl, VinylAuthors) {
    $timeout(function() {
        $scope.navMenu.isAuthorsCollapsed = false;
    }, 100);

    $scope.author = VinylAuthors.get({slug: $stateParams.slug}, function() {
        $scope.title = 'Исполнитель: ' + $scope.author.name;
        $scope.vinyls = Vinyl.query({'authors__slug': $stateParams.slug}, function() {
            $scope.htmlReady();
        });
    });
})
.controller('VinylLabelController', function($scope, $timeout, $stateParams, Vinyl, VinylLabels) {
    $timeout(function() {
        $scope.navMenu.isLabelsCollapsed = false;
    }, 100);

    $scope.label = VinylLabels.get({slug: $stateParams.slug}, function() {
        $scope.title = 'Лейбл: ' + $scope.label.name;
        $scope.vinyls = Vinyl.query({'label__slug': $stateParams.slug}, function() {
            $scope.htmlReady();
        });
    });
})
.directive('storeVinylItem', function() {
    return {
        restict: 'A',
        templateUrl: '/static/html/vinyl/vinyl.html',
        scope: {
            vinyl: '=',
        },
    };
})
;
