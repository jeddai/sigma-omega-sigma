angular.module('sigmaomegasigma')

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.inputStyle = {
    'color' : '#e6b500'
  };

  // Form data for the login modal
  $scope.loginData = {
    'username' : '',
    'password' : ''
  };

  $scope.loggedIn = false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('components/menu/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var error;
    auth.signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password).catch(function(fireError) {
      // Handle Errors here.
      error = fireError;
      console.log('Invalid login ' + error);
      $scope.loggedIn = false;
      $scope.closeLogin();
      return;
    });
    if(!error) {
      $scope.loggedIn = true;
      $scope.closeLogin();
    }
  };

  $scope.logout = function() {
    auth.signOut()
    .then(function() {
      console.log('User has been logged out.');
      $scope.loggedIn = false;

      $scope.loginData = {
        'username' : '',
        'password' : ''
      };
    }, function(error) {
      console.log('Unable to log out user');
    });
  };
});
