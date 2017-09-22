(function(){
    var jobDirectives = angular.module("jobDirectives", ['publicEnumTypes']);
    jobDirectives.directive("jobTypes", ["enumService", function(enumService){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/jobTypesFilter.html",
            controller: ["$scope", function($scope){
                $scope.jobTypes = enumService.getEnumCopy("JobType");
                //listens to 'getJobTypes' event coming from parent
                //calls getCheckedEnumsFromSitter() that returns full array of jobTypes
                //with the sitter's jobTypes prechecked
                $scope.$watch("sitter", function(){
                    if($scope.sitter && $scope.sitter.jobType)
                        $scope.jobTypes = enumService.getCheckedEnumsFromSitter($scope.jobTypes, $scope.sitter.jobType);
                });
                //listens to "gatherJobTypes" event that comes from a parent
                $scope.$on("gatherJobTypes", function(event){
                    //extract additional arguments for further actions
                    $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                    //gathers names of checked enums
                    $scope.gatheredJobTypes = enumService.gatherCheckedEnumNames($scope.jobTypes);
                });
                //listens to changes of $scope.gatheredJobTypes variable
                $scope.$watch("gatheredJobTypes", function(){
                    //publishes "gathered" event when the variable changes
                    if($scope.gatheredJobTypes !== undefined)
                        $scope.$emit("gathered", "jobTypes", $scope.gatheredJobTypes, $scope.additionalArgs);
                });
            }]
        }
    }]);
})();