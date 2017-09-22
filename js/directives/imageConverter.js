(function(){
    var imageConverter = angular.module("imageConverter", ['ngImgCrop']);
    imageConverter.service("imageService", ["$q", "$rootScope", function($q, $rootScope){
        this.imgToBase64 = function(url, newImage)
        {
            var deferred = $q.defer();
            //desirable height of the image in px
            var size = 200;
            var img = new Image();
            if(!newImage)
                img.crossOrigin = 'Anonymous';
            img.onload = function()
            {
                if(img.height > size) {
                    img.width *= size / img.height;
                    img.height = size;
                }
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                dataURL = canvas.toDataURL().replace("data:image/png;base64,", '');
                deferred.resolve(dataURL);
            };
            img.src = url;
            return deferred.promise;
        };

    }]);

    imageConverter.directive("uploadImage",["imageService", function(imageService){
        return{
            restrict:'E',
            templateUrl: "partials/directives/image-upload.html",
            controller: ["$scope", function($scope)
            {
                $scope.myImage='';
                $scope.myCroppedImage='';
                $scope.wait = false;

                var handleFileSelect=function(evt) {
                    setWait();
                    $scope.sitter.img = "";
                    var file=evt.currentTarget.files[0];
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        $scope.$apply(function($scope){
                            $scope.myImage=evt.target.result;
                        });
                    };
                    if(file === undefined)
                    {
                        $scope.wait = false;
                        $scope.$apply();
                    }
                    else
                        reader.readAsDataURL(file);
                };

                var setWait = function(){
                    $scope.imgInvalid = false;
                  //  $scope.myImage = '';
                    $scope.wait = true;
                    $scope.$apply();

                }

                angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
               // angular.element(document.querySelector('#fileInput')).on('click',setWait);

                $scope.loadDone = function(){
                    $scope.wait = false;
                }

                $scope.$on("resizeImage", function(e){
                    if((!$scope.myImage && !$scope.sitter.img) || $scope.wait)
                    {
                        $scope.imgInvalid = true;
                        $scope.$emit('imageReady', false);
                        return;
                    }
                    if($scope.sitter.img === undefined || $scope.sitter.img === '')
                    {
                        imageService.imgToBase64($scope.myCroppedImage, true).then(function(response){
                            $scope.$emit("imageReady", true, response);
                        });
                    }
                    else
                    {
                        $scope.$emit("imageReady", true, $scope.sitter.img);
                    }
                });
            }]
        };
    }]);
})();