angular.module('sigmaomegasigma')

.controller('MembersCtrl', function($scope, $ionicModal) {

  $scope.members = [];

  $scope.getMembers = function() {
    firebase.database().ref('members/').on('value', function(snapshot) {
      $scope.members = snapshot.val();
    });
  };

  $scope.getMembers();

  $scope.activeMember = {};

  $scope.show = {
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

  $scope.$watch(function($scope) {
    return $scope.loggedIn;
  }, function() {
    if($scope.loggedIn) {
      $scope.show.phone.show = true;
    }else {
      $scope.show.phone.show = false;
      $scope.show.phone.value = false;
    }
  }, true);

  $scope.memberTypes = {
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

  $scope.showStatus = function(status) {
    return $scope.memberTypes[status].text;
  };

  $scope.active = function(member) {
    if($scope.data.value == member.status) {
      return true;
    }else {
      return false;
    }
  };

  $ionicModal.fromTemplateUrl('components/members/member-info-view.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.memberInfoModal = modal;
  });

  $scope.openInfoView = function(member) {
    $scope.activeMember = member;
    $scope.memberInfoModal.show();
  };

  $scope.closeInfoModal = function() {
    $scope.activeMember = {};
    $scope.memberInfoModal.hide();
  };

  $ionicModal.fromTemplateUrl('components/members/memberFilter.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.chooseModal = modal;
  });

  $scope.openChooseView = function() {
    $scope.chooseModal.show();
  };

  $scope.closeChooseModal = function() {
    $scope.chooseModal.hide();
  };
});
