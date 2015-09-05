'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app
.directive('audioPlayer', function(angularPlayer, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/static/html/player/player.html',
        scope: {
            'vinyl': '=',
            'tracks': '=',
        },
        link: function (scope) {
            scope.$on('track:id', function() {
                scope.$apply(function() {
                    scope.currentPlaying = angularPlayer.currentTrackData();
                });
            });
            scope.$on('track:progress', function(event, data) {
                scope.$apply(function() {
                    if (angularPlayer.vinyl === scope.vinyl) {
                        scope.progress = data;
                    } else {
                        scope.progress = 0;
                    }
                });
            });
            var loadTracks = function(callback) {
                angularPlayer.stop();
                angularPlayer.setCurrentTrack(null);
                angularPlayer.clearPlaylist(function() {
                    angular.forEach(scope.tracks, function(t) {
                        var song = {
                            id: t.id,
                            title: t.name,
                            url: t.track,
                        };
                        angularPlayer.addTrack(song);
                    });
                    callback();
                });
            };
            scope.setPosition = function(event) {
                if (angularPlayer.vinyl !== scope.vinyl) {
                    return;
                }
                if (angularPlayer.getCurrentTrack() === null) {
                    return;
                }

                $timeout(function() {
                    var sound = window.soundManager.getSoundById(angularPlayer.getCurrentTrack());
                    var element = event.currentTarget;
                    var rect = element.getBoundingClientRect();
                    var x = event.clientX - rect.left,
                        width = element.clientWidth,
                        duration = sound.durationEstimate;
                    sound.setPosition((x / width) * duration);
                }, 0);
            };
            scope.isPlaying = function() {
                if (angularPlayer.vinyl !== scope.vinyl || !angularPlayer.isPlayingStatus()) {
                    return false;
                }
                return true;
            };
            scope.progress = function() {
                if (angularPlayer.vinyl !== scope.vinyl) {
                    return '0';
                }
                console.log(angularPlayer.trackProgress);
                return angularPlayer.trackProgress + '%';
            };
            scope.playToggle = function() {
                $timeout(function() {
                    if (angularPlayer.vinyl !== scope.vinyl) {
                        angularPlayer.vinyl = scope.vinyl;
                        loadTracks(function() {
                            angularPlayer.playTrack(scope.tracks[0].id);
                        });
                    } else {
                        if(angularPlayer.isPlayingStatus()) {
                            angularPlayer.pause();
                        } else {
                            angularPlayer.play();
                        }
                    }
                }, 0);
            };
            scope.playTrack = function(track) {
                $timeout(function() {
                    if (angularPlayer.vinyl !== scope.vinyl) {
                        angularPlayer.vinyl = scope.vinyl;
                        loadTracks(function() {
                            angularPlayer.playTrack(track.id);
                        });
                    } else {
                        angularPlayer.playTrack(track.id);
                    }
                }, 0);
            };
        }
    };
})
.directive('audioPlayerSeek', function(angularPlayer) {
    return {
        restict: 'A',
        link: function (scope, element) {
            element.bind('click', function (event) {
                if (angularPlayer.vinyl !== scope.vinyl) {
                    return;
                }
                if (angularPlayer.getCurrentTrack() === null) {
                    return;
                }
                var sound = window.soundManager.getSoundById(angularPlayer.getCurrentTrack());
                var getXOffset = function (event) {
                    var x = 0, element = event.target;
                    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
                        x += element.offsetLeft - element.scrollLeft;
                        element = element.offsetParent;
                    }
                    return event.clientX - x;
                };
                var x = event.offsetX || getXOffset(event),
                    width = element[0].clientWidth,
                    duration = sound.durationEstimate;

                sound.setPosition((x / width) * duration);
            });
        }
    };
})
;
