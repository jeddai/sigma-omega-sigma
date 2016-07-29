(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('AppCtrl', AppController);

  function AppController($scope, $ionicModal, $timeout, $cordovaSQLite, $ionicPlatform, UserService) {
    var self = this;

    $ionicPlatform.ready(function() {
      if(window.sqlitePlugin) {
        $cordovaSQLite.openDB({ name: 'hello-world.db', location: 'default' }, function (db) {
          db.executeSql("select length('tenletters') as stringlength", [], function (res) {
            var stringlength = res.rows.item(0).stringlength;
            console.log('got stringlength: ' + stringlength);
            document.getElementById('deviceready').querySelector('.received').innerHTML = 'stringlength: ' + stringlength;
         });
        });
      }
    });

    self.loggedIn = UserService.loggedIn;

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
        self.loggedIn = UserService.setLoggedIn(false);
        self.closeLogin();
        return;
      });
      if(!error) {
        self.loggedIn = UserService.setLoggedIn(true);
        self.closeLogin();
      }
    };

    self.logout = function() {
      auth.signOut()
      .then(function() {
        console.log('User has been logged out.');

        $scope.$apply(function() {
          self.loggedIn = UserService.setLoggedIn(false);

          self.loginData = {
            'username' : '',
            'password' : ''
          };
        });
      }, function(error) {
        console.log('Unable to log out user');
      });
    };
  }
})();
