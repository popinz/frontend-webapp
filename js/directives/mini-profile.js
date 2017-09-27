/*
 *  Copyright (C) 2017 Popinz.co
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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