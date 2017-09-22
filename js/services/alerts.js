(function(){
    var alerts = angular.module("alertsModule", ["translateModule"]);
    alerts.service("alertsService", ["translateService", "$rootScope", function(translateService, $rootScope){
        this.showAlert = function(message)
        {
            if(message.code !== undefined) {
                alert(message.message);
                return;
            }
            if(message.startsWith("java.security.AccessControlException")){
                alert(translateService.getTranslation("WRONG_PASSWORD_ALERT", $rootScope.lang));
            }
            else if(message === "Profile exists as a sitter profile"){
                alert(translateService.getTranslation("SECOND_ACCOUNT_ALERT1", $rootScope.lang)+
                    translateService.getTranslation("SITTER", $rootScope.lang) +
                        translateService.getTranslation("SECOND_ACCOUNT_ALERT2", $rootScope.lang));
            }
            else if(message === "Profile exists as a parent profile"){
                alert(translateService.getTranslation("SECOND_ACCOUNT_ALERT1", $rootScope.lang)+
                    translateService.getTranslation("PARENT", $rootScope.lang) +
                        translateService.getTranslation("SECOND_ACCOUNT_ALERT2", $rootScope.lang));
            }
            else if(message === "Email/Username or password is incorrect"){
                alert(translateService.getTranslation('EMAIL_OR_PASSWORD_INCORRECT', $rootScope.lang));
            }
            else if(message === "First time user"){
                alert(translateService.getTranslation('FIRST_TIME_USER_ALERT', $rootScope.lang));
            }
            else if(message === "Invalid confirmation code"){
                alert(translateService.getTranslation('INVALID_CONFIRMATION', $rootScope.lang));
            }
            else{
                alert(translateService.getTranslation("GENERAL_ALERT", $rootScope.lang));
            }
        }

    }]);
})();