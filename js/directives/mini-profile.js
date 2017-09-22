(function(){
    var miniProfileModule = angular.module("miniProfile", ["tools", "translateModule"]);

     miniProfileModule.directive("miniProfile", function(){
        return{
            restrict:'E',
            templateUrl: "partials/directives/mini-profile.html",
            controller:["$scope", "$rootScope", "$location", "translateService", function($scope, $rootScope, $location,translateService){
                $scope.aboutMeLimit = 60;
                $scope.redirect = function(sitter){
                    if($rootScope.user && $rootScope.user.userType){
                        //$rootScope.sitterToShow = sitter;
                        $location.path('/sitter-profile/'+$rootScope.lang).search(sitter.id);
                        $scope.$emit("saveFilters", sitter);
                    }
                    else{
                        $location.path('/signup/'+$rootScope.lang);
                    }
                }

                $scope.getLinkText = function(){
                    var res = "";
                    if($rootScope.user && $rootScope.user.userType)
                        res = translateService.getTranslation('READ_MORE', $rootScope.lang);
                    else
                        res = translateService.getTranslation('READ_MORE_UNREG', $rootScope.lang);
                    return res;
                }

                $scope.getLocation = function(sitter){
                    var location = '';
                    if(sitter.city)
                    {
                        location = $scope.getName("City", sitter.city, $rootScope.lang);
                        if(sitter.neighborhood)
                            location = location + ", " + $scope.getNeighborhoodName(sitter.city, sitter.neighborhood, $rootScope.lang);
                    }
                    return location;
                }

                $scope.getMiniName = translateService.getBestName;
            }]
        }
    });
})();