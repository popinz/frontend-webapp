(function(){
    var kids = angular.module("kidsInfo", []);

    kids.directive("kids", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/kids.html"/*,
            controller: ["$scope", function($scope){
                $scope.ages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

                $scope.addChild = function(){
                    $scope.parent.kidsInfo.push({age : 0});
                    $scope.parent.numberOfChildren++;
                }
            }]*/
        }
    });
})();