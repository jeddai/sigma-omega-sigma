(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('FaithCtrl', FaithController);

  function FaithController($scope, $ionicLoading, $ionicModal, $ionicPlatform, FirebaseFactory, UserService, SlackFactory) {
    var self = this;

    self.openPrayerRequestModal = openPrayerRequestModal;
    self.closePrayerRequestModal = closePrayerRequestModal;
    self.submitRequest = submitRequest;
    self.showRequest = showRequest;
    self.newRequest = newRequest;
    self.approveRequest = approveRequest;
    self.deleteRequest = deleteRequest;
    self.newPrayerRequest = {};
    resetPrayerRequest();
    self.loggedIn = UserService.loggedIn;
    self.prayerRequests = [];
    self.inputStyle = {
      'color' : '#e6b500'
    };

    function loading(val) {
      if(val) {
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>'
        });
      } else {
        $ionicLoading.hide();
      }
    }

    function getRequests() {
      loading(true);
      FirebaseFactory.getItems('/prayerRequests').on('value', function(snapshot) {
        self.prayerRequests = snapshot.val();
        loading(false);
      });
    }

    function newRequest(request) {
      var d = new Date();
      d.setDate(d.getDate()-7);
      return d.getTime() < request.timestamp;
    }

    function showRequest(request) {
      var d = new Date();
      d.setDate(d.getDate()-30);
      return (d.getTime() < request.timestamp) && !!request.approved;
    }

    if(self.loggedIn) {
      getRequests();
    }

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.loggedIn = value;
      if(self.loggedIn) {
        getRequests();
      }
    }, true);

    function submitRequest() {
      var newRequestKey = firebase.database().ref().child('prayerRequests').push().key;
      self.newPrayerRequest.timestamp = new Date().getTime();
      firebase.database().ref('prayerRequests/' + newRequestKey).set(self.newPrayerRequest);
      SlackFactory.log(SlackFactory.prayerRequestEvent(self.newPrayerRequest.request), '#prayer-request-notif');
      resetPrayerRequest();
      closePrayerRequestModal();
    }

    function resetPrayerRequest() {
      self.newPrayerRequest = {
        'approved' : false,
        'token' : UserService.fcmToken
      };
    }

    function approveRequest(key, request) {
      request.approved = true;
      var updates = {};
      updates['prayerRequests/' + key] = request;
      return firebase.database().ref().update(updates);
    }

    function deleteRequest(key, request) {
      SlackFactory.logAttachment(SlackFactory.prayerRequestApprovedEvent(request, false), '#prayer-request-notif', '#d00000', request.token);
      return firebase.database().ref('prayerRequests/' + key).remove();
    }

    $ionicModal.fromTemplateUrl('components/faith/prayerRequest.html', {
      scope: $scope
    }).then(function(modal) {
      self.prmodal = modal;
    });

    // Triggered in the login modal to close it
    function closePrayerRequestModal() {
      self.prmodal.hide();
    }

    // Open the login modal
    function openPrayerRequestModal() {
      self.prmodal.show();
    }
  }
})();
