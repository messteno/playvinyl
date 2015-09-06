'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app
.service('Vinyl', function($resource) {
    var Vinyl = $resource('/api/store/vinyl/:slug/', { slug: '@slug' });
    return Vinyl;
})
.factory('VinylList', function(Vinyl) {
    return function(params) {
        this.items = [];
        this.count = 0;
        this.page = 1;
        this.pages = 0;
        this.page_size = 0;
        this.params = params || {};
        this.load = function(callback) {
            this.params.page = this.page;
            var self = this;
            var response = Vinyl.get(this.params, function() {
                self.items = response.results;
                self.count = response.count;
                self.pages = response.pages;
                self.pageSize = response.page_size;
                if (callback) {
                    callback.call(self.items);
                }
            });
        };
    };
})
.service('VinylAuthors', function($resource) {
    var VinylAuthors = $resource('/api/store/authors/:slug/', { slug: '@slug' });
    return VinylAuthors;
})
.service('VinylLabels', function($resource) {
    var VinylLabels = $resource('/api/store/labels/:slug/', { slug: '@slug' });
    return VinylLabels;
})
.service('VinylCatalogs', function($resource) {
    var VinylCatalogs = $resource('/api/store/catalogs/:slug/', { slug: '@slug' });
    return VinylCatalogs;
})
.controller('VinylItemController', function($scope, $stateParams, $state, Vinyl) {
    $scope.vinyl = Vinyl.get({'slug': $stateParams.slug }, function() {
        $scope.htmlReady();
    }, function() {
        $state.go('404');
    });
})
.controller('VinylAuthorController', function($scope, $timeout, $stateParams, VinylAuthors, VinylList) {
    $timeout(function() {
        $scope.navMenu.isAuthorsCollapsed = false;
    }, 100);

    $scope.vinylList = new VinylList({'authors__slug': $stateParams.slug});
    $scope.author = VinylAuthors.get({slug: $stateParams.slug}, function() {
        $scope.listTitle = 'Исполнитель: ' + $scope.author.name;
        $scope.vinylList.load(function() {
            $scope.htmlReady();
        });
    });
})
.controller('VinylLabelController', function($scope, $timeout, $stateParams, VinylLabels, VinylList) {
    $timeout(function() {
        $scope.navMenu.isLabelsCollapsed = false;
    }, 100);

    $scope.vinylList = new VinylList({'label__slug': $stateParams.slug});
    $scope.label = VinylLabels.get({slug: $stateParams.slug}, function() {
        $scope.listTitle = 'Лейбл: ' + $scope.label.name;
        $scope.vinylList.load(function() {
            $scope.htmlReady();
        });
    });
})
.controller('VinylCatalogController', function($scope, $timeout, $stateParams, VinylCatalogs, VinylList) {
    $timeout(function() {
        $scope.navMenu.isStylesCollapsed = false;
    }, 100);

    $scope.vinylList = new VinylList({'catalog__slug': $stateParams.slug});
    $scope.catalog = VinylCatalogs.get({slug: $stateParams.slug}, function() {
        $scope.listTitle = 'Стиль: ' + $scope.catalog.name;
        $scope.vinylList.load(function() {
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
.directive('storeVinylList', function(VinylList) {
    return {
        restict: 'E',
        templateUrl: '/static/html/vinyl/list.html',
        scope: {
            listTitle: '=',
        },
        link: function(scope) {
            scope.vinylList = new VinylList();
            scope.vinylList.load(function() {
                //scope.htmlReady();
            });
        },
    };
})
;
