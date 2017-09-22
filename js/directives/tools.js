(function(){
    var toolsModule = angular.module("tools", []);
    toolsModule.directive('tooltip', ["$timeout", function($timeout){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                $(element).hover(function(){
                    // on mouseenter
                    $(element).tooltip('show');
                }, function(){
                    // on mouseleave
                    $(element).tooltip('hide');
                });
                $(element).click(function(){
                    $(element).tooltip('show');
                    $timeout(function(){
                        $(element).tooltip('hide');
                    }, 1500);
                });
            }
        };
    }]);
})();