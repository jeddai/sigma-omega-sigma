(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('SettingsCtrl', SettingsController);

  function SettingsController($scope, UserService, $ionicModal) {
    var self = this;

    self.passwordResetSent = false;
    self.error = false;
    self.subscribedToMemberNotifications = false;
    self.showMemberItems = false;

    self.notifications = {
      pledging: {
        'name':'pledging',
        'class':'icon ion-person-add energized',
        'value':false,
        'show':true
      },
      members: {
        'name':'members',
        'class':'icon ion-person-stalker energized',
        'value':false,
        'show':false
      }
    };

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.showMemberItems = value;
      self.notifications.members.show = value;
    }, true);

    self.init = function() {
      //check for subscription
    };

    self.init();

    self.passwordReset = {
      'key' : '',
      'newPassOne' : '',
      'newPassTwo' : ''
    };

    self.sendPassResetEmail = function() {
      if(!self.passwordResetSent) {
        self.passwordResetSent = true;
        auth.sendPasswordResetEmail(UserService.loginData.username);
      }
    };

    self.requestNotifications = function() {
      if(!!window.FirebasePlugin) {
        window.FirebasePlugin.getInstanceId(function(token) {
            window.FirebasePlugin.grantPermission();
        }, function(error) {
            self.error = 'This application requires notifications to be active in order to work properly and store your data.';
            console.error(error);
        });
      }
    };

    self.subscribeToNotifications = function(topic) {
      if(self.notifications[topic].value === false) {
        console.log('Subscribing to ' + topic);
        self.notifications[topic].value = true;
        editSubscription(topic, true);
      } else {
        console.log('Unsubscribing from ' + topic);
        self.notifications[topic].value = false;
        editSubscription(topic, true);
      }
    };

    function editSubscription(topic, value) {
      if(!!window.FirebasePlugin) {
        window.FirebasePlugin.getInstanceId(function(token) {
          if(value) {
            window.FirebasePlugin.subscribe(topic);
          } else {
            window.FirebasePlugin.unsubscribe(topic);
          }
        }, function(error) {
            console.error(error);
        });
      }
    }
  }
})();
