(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('MembersCtrl', MembersController);

  function MembersController($scope, $ionicModal, UserService) {
    var self = this;

    self.loggedIn = UserService.loggedIn;
    self.members = [];
    self.loaded = false;

    self.getMembers = function() {
      if(self.loaded === false) {
        firebase.database().ref('members/').on('value', function(snapshot) {
          self.members = snapshot.val();
          self.loaded = true;
        });
      }
    };

    self.getMembers();

    self.activeMember = {};

    self.show = {
      'sir_name' : {
        'text' : 'Sir Name',
        'value' : true,
        'show' : true
      },
      'position' : {
        'text' : 'Position',
        'value' : true,
        'show' : true
      },
      'email' : {
        'text' : 'Email Address',
        'value' : false,
        'show' : true
      },
      'phone' : {
        'text' : 'Phone Number',
        'value' : false,
        'show' : false
      },
      'status' : {
        'text' : 'Status',
        'value' : false,
        'show' : true
      }
    };

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.loggedIn = value;
      self.show.phone.show = value;
    });

    self.memberTypes = {
      'active' : {
        'text': 'Active',
        'value': 'active',
        'show': true
      },
      'inactive' : {
        'text': 'Inactive',
        'value': 'inactive',
        'show': false
      },
      'alumni' : {
        'text': 'Alumni',
        'value': 'alumni',
        'show': false
      },
      'sponsor' : {
        'text': 'Sponsor',
        'value': 'sponsor',
        'show': false
      }
    };

    self.showStatus = function(status) {
      return self.memberTypes[status].text;
    };

    self.active = function(member) {
      if(self.data.value == member.status) {
        return true;
      }else {
        return false;
      }
    };

    $ionicModal.fromTemplateUrl('components/members/member-info-view.html', {
      scope: $scope
    }).then(function(modal) {
      self.memberInfoModal = modal;
    });

    self.openInfoView = function(member) {
      self.activeMember = member;
      self.memberInfoModal.show();
    };

    self.closeInfoModal = function() {
      self.activeMember = {};
      self.memberInfoModal.hide();
    };

    $ionicModal.fromTemplateUrl('components/members/memberFilter.html', {
      scope: $scope
    }).then(function(modal) {
      self.chooseModal = modal;
    });

    self.openChooseView = function() {
      self.chooseModal.show();
    };

    self.closeChooseModal = function() {
      self.chooseModal.hide();
    };
  }
})();
