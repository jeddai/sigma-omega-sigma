angular.module('sigmaomegasigma')

.controller('SettingsCtrl', function($scope, $ionicModal) {
  $scope.passwordResetSent = false;
  $scope.error = false;
  $scope.subscribedToMemberNotifications = false;

  $scope.init = function() {
    //check for subscription
  };

  $scope.init();

  $scope.passwordReset = {
    'key' : '',
    'newPassOne' : '',
    'newPassTwo' : ''
  };

  $scope.sendPassResetEmail = function() {
    if(!$scope.passwordResetSent) {
      $scope.passwordResetSent = true;
      auth.sendPasswordResetEmail($scope.loginData.username);
    }
  };

  $scope.subscribeToMemberNotifications = function() {
    window.FirebasePlugin.getInstanceId(function(token) {
      if(!$scope.subscribedToMemberNotifications) {
        window.FirebasePlugin.subscribe("members");
        $scope.subscribedToMemberNotifications = true;
      } else {
        window.FirebasePlugin.unsubscribe("members");
        $scope.subscribedToMemberNotifications = false;
      }
    }, function(error) {
        console.error(error);
    });
  };

});
