(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('MembersCtrl', MembersController);

  function MembersController($scope, $ionicModal, UserService) {
    var self = this;

    self.getMembers = getMembers;
    self.showStatus = showStatus;
    self.active = active;
    self.openInfoModal = openInfoModal;
    self.closeInfoModal = closeInfoModal;
    self.openChooseModal = openChooseModal;
    self.closeChooseModal = closeChooseModal;

    self.loggedIn = UserService.loggedIn;
    self.members = [];
    self.loaded = false;
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

    function getMembers() {
      if(self.loaded === false) {
        firebase.database().ref('members/').on('value', function(snapshot) {
          self.members = snapshot.val();
          self.loaded = true;
        });
      }
    }

    function showStatus(status) {
      return self.memberTypes[status].text;
    }
    
    function active(member) {
      if(self.data.value == member.status) {
        return true;
      }else {
        return false;
      }
    }

    function openInfoModal(member) {
      self.activeMember = member;
      self.memberInfoModal.show();
    }

    function closeInfoModal() {
      self.activeMember = {};
      self.memberInfoModal.hide();
    }

    function openChooseModal() {
      self.chooseModal.show();
    }

    function closeChooseModal() {
      self.chooseModal.hide();
    }

    getMembers();

    $scope.$watch(function() {
      return UserService.loggedIn;
    }, function(value) {
      self.loggedIn = value;
      self.show.phone.show = value;
      self.show.phone.value = value;
    });

    $ionicModal.fromTemplateUrl('components/members/member-info-view.html', {
      scope: $scope
    }).then(function(modal) {
      self.memberInfoModal = modal;
    });

    $ionicModal.fromTemplateUrl('components/members/memberFilter.html', {
      scope: $scope
    }).then(function(modal) {
      self.chooseModal = modal;
    });
  }
})();
