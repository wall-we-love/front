/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var moduleName = module.exports = 'wwlPosterUpload';

var angular = require('../../../adapters/angular');

var interact = require('../../../../../bower_components/interact/interact');

angular.module(moduleName, ['wwlUser'])
    .directive('posterUpload', [
        '$document',
        'userFactory',
        function ($document, userFactory) {
            return {
                restrict: 'E',
                link: function (scope, element) {

                    scope.poster = {
                        ready: false
                    };

                    var dropZone = element[0].querySelector('.drop-zone');
                    var canvas = document.createElement('canvas');

                    function dragMoveListener (event) {
                        var target = event.target,
                        // keep the dragged position in the data-x/data-y attributes
                            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // translate the element
                        target.style.webkitTransform =
                            target.style.transform =
                                'translate(' + x + 'px, ' + y + 'px)';

                        // update the posiion attributes
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }

                    dropZone.addEventListener('dragover', function (evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        evt.dataTransfer.dropEffect = 'copy';
                    });

                    dropZone.addEventListener('drop', function (evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        var file = evt.dataTransfer.files[0];

                        if (file.type.match('image.*')) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var img = new Image;
                                img.onload = function () {
                                    canvas.setAttribute('width', this.width + 'px');
                                    canvas.setAttribute('height', this.height + 'px');
                                    var dropZonePosition = dropZone.getBoundingClientRect();
                                    console.log(dropZonePosition);
                                    canvas.style.position = 'absolute';
                                    canvas.style.top = dropZonePosition.top + 10 + 'px';
                                    canvas.style.left = dropZonePosition.left + 'px';
                                    dropZone.style.height = this.height + 'px';
                                    canvas.className = 'draggable';
                                    $document[0].body.insertBefore(canvas, null);
                                    var canvasCtx = canvas.getContext('2d');
                                    canvasCtx.drawImage(this, 0, 0, this.width, this.height);
                                    var interactable = interact('.draggable');
                                    interactable
                                        .draggable({
                                            onmove: dragMoveListener,
                                            // call this function on every dragend event
                                            onend: function (event) {}
                                        })
                                        .resizable({
                                            edges: { left: true, right: true, bottom: true, top: true }
                                        })
                                        .on('resizemove', function (event) {
                                            var target = event.target,
                                                x = (parseFloat(target.getAttribute('data-x')) || 0),
                                                y = (parseFloat(target.getAttribute('data-y')) || 0);

                                            // update the element's style
                                            target.style.width  = event.rect.width + 'px';
                                            target.style.height = event.rect.height + 'px';

                                            // translate when resizing from top or left edges
                                            x += event.deltaRect.left;
                                            y += event.deltaRect.top;

                                            //target.style.webkitTransform = target.style.transform =
                                            //    'translate(' + x + 'px,' + y + 'px)';

                                            target.setAttribute('data-x', x);
                                            target.setAttribute('data-y', y);
                                        });
                                };
                                img.src = e.target.result;
                            };
                            reader.readAsDataURL(file);

                            scope.$apply(function () {
                                scope.poster.ready = true;
                            });

                            scope.clickPost = function () {
                                var tmpImg = canvas.toDataURL("image/png");
                                var pos = canvas.getBoundingClientRect();
                                userFactory.postPoster({
                                    fileData: tmpImg,
                                    pos_x: pos.left,
                                    pos_y: pos.top,
                                    height: pos.height,
                                    width: pos.width
                                })
                                    .then(function () {
                                        console.log("YOLO");
                                    });
                                console.log('penis');
                            };
                        }

                    }, false);
                },
                templateUrl: 'assets/html/poster/poster.html',
                replace: true
            };
        }
    ]);