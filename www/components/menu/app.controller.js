(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('AppCtrl', AppController);

  function AppController($scope, $ionicModal, $timeout, $cordovaFile, $ionicPlatform, UserService, FirebaseFactory, SlackFactory) {
    var self = this;

    $ionicPlatform.ready(function() {
      if(window.FirebasePlugin) {
        window.FirebasePlugin.getInstanceId(function(token) {
          window.FirebasePlugin.grantPermission();
          UserService.fcmToken = token;
        }, function(error) {
          console.error(error);
        });
      }

      // if(!!window.cordova) {
      //   UserService.user = $cordovaFile.readAsText(cordova.file.dataDirectory, 'user');
      //   console.log(user);
      //   if(!!UserService.user) {
      //     self.loggedIn = UserService.setLoggedIn(true);
      //   }
      // }
    });

    self.loggedIn = UserService.loggedIn;
    self.admin = false;

    FirebaseFactory.getItems('/admins').on('value', function (snapshot) {
      UserService.admins = snapshot.val();
    });

    function checkAdmin() {
      return UserService.admins.indexOf(UserService.uid) != -1 && !!UserService.uid
    }

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.loggedIn = value;
      self.admin = checkAdmin();
    });

    $scope.$watch(function() {
      return UserService.admins;
    }, function(value) {
      self.admin = checkAdmin();
    });

    self.inputStyle = {
      'color' : '#e6b500'
    };

    // Form data for the login modal
    self.loginData = {
      'username' : '',
      'password' : ''
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('components/menu/login.html', {
      scope: $scope
    }).then(function(modal) {
      self.modal = modal;
    });

    // Triggered in the login modal to close it
    self.closeLogin = function() {
      self.modal.hide();
    };

    // Open the login modal
    self.login = function() {
      self.modal.show();
    };

    // Perform the login action when the user submits the login form
    self.doLogin = function() {
      var error;
      auth.signInWithEmailAndPassword(self.loginData.username, self.loginData.password).catch(function(fireError) {
        // Handle Errors here.
        error = fireError;
        console.log('Invalid login ' + error);
        SlackFactory.log(SlackFactory.loginEvent(self.loginData.username, false), '');
        self.loggedIn = UserService.setLoggedIn(false);
        self.closeLogin();
        return;
      });
      if(!!error == false) {
        self.loggedIn = UserService.setLoggedIn(true);
        UserService.loginData = self.loginData;
        SlackFactory.log(SlackFactory.loginEvent(true), '');
        checkAdmin();
        self.closeLogin();
      }
    };

    self.logout = function() {
      auth.signOut()
      .then(function() {
        console.log('logging out user');
        SlackFactory.log(SlackFactory.logoutEvent(UserService.uid), '');
        self.loggedIn = UserService.setLoggedIn(false);
        self.loginData = {
          'username' : '',
          'password' : ''
        };
        console.log('User has been logged out.');
      }, function(error) {
        console.log('Unable to log out user');
      });
    };


    $ionicModal.fromTemplateUrl('components/menu/adminModal.html', {
      scope: $scope
    }).then(function(modal) {
      self.adminModal = modal;
    });

    // Triggered in the login modal to close it
    self.closeAdmin = function() {
      self.adminModal.hide();
    };

    // Open the login modal
    self.openAdmin = function() {
      self.adminModal.show();
    };
  }
})();
