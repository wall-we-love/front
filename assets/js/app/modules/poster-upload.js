/**
 * Created by Jordan on 5/22/2015.
 */
'use strict';

var moduleName = module.exports = 'wwl.posterUpload';

var angular = require('../../adapters/angular');

var interact = require('../../../../bower_components/interact/interact');

angular.module(moduleName, ['wwl.user'])
    .directive('posterUpload', [
        '$document', 'userFactory',
        function ($document, userFactory) {
            return {
                restrict: 'E',
                link: function (scope, element) {

                    scope.poster = {
                        ready: false,
                        hideDrop: false,
                        link: '',
                        description: '',
                        tags: ''
                    };

                    var dropZone = element[0].querySelector('.drop-zone');
                    var canvas = document.createElement('canvas');


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
                                    var dropZonePosition = dropZone.getBoundingClientRect();
                                    console.log(dropZonePosition);
                                    canvas.setAttribute('width', (dropZonePosition.width - 26 - 10) + 'px');
                                    canvas.setAttribute('height', (this.height * (dropZonePosition.width - 26 - 10) / this.width) + 'px');
                                    canvas.style.position = 'absolute';
                                    canvas.style.top = dropZonePosition.top + 'px';
                                    canvas.style.left = dropZonePosition.left + 3 + 'px';
                                    canvas.className = 'draggable';
                                    canvas.style.zIndex = 1302;
                                    dropZone.style.border = 'none';
                                    $document[0].body.insertBefore(canvas, null);
                                    var canvasBounding = canvas.getBoundingClientRect();
                                    dropZone.style.height = canvasBounding.height + 'px';
                                    var canvasCtx = canvas.getContext('2d');
                                    canvasCtx.drawImage(this, 0, 0, canvasBounding.width, canvasBounding.height);
                                    var interactable = interact('.draggable');
                                    interactable
                                        .draggable({
                                            onmove: function dragMoveListener (event) {
                                                var target = event.target,
                                                // keep the dragged position in the data-x/data-y attributes
                                                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                                                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                                                if (x < -260 && y > -50) {
                                                    target.style.zIndex = 2;
                                                    scope.$apply(function () {
                                                        scope.poster.hideDrop = true;
                                                    });
                                                }
                                                // translate the element
                                                target.style.webkitTransform =
                                                    target.style.transform =
                                                        'translate(' + x + 'px, ' + y + 'px)';

                                                // update the posiion attributes
                                                target.setAttribute('data-x', x);
                                                target.setAttribute('data-y', y);
                                            },
                                            // call this function on every dragend event
                                            onend: function (event) {}
                                        })
                                        .resizable({
                                            edges: { left: true, right: true, bottom: true }
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
                                var documentPosition = $document[0].body.getBoundingClientRect();
                                console.log(documentPosition);
                                var pos = canvas.getBoundingClientRect();
                                userFactory.postPoster({
                                    fileData: tmpImg,
                                    pos_x: pos.left * 100 / documentPosition.width,
                                    pos_y: pos.top * 100 / documentPosition.height,
                                    height: pos.height,
                                    width: pos.width,
                                    link: scope.poster.link,
                                    description: scope.poster.description,
                                    tags: scope.poster.tags
                                });
                            };
                        }

                    }, false);
                },
                templateUrl: 'assets/html/poster/poster.html',
                replace: true
            };
        }
    ]);