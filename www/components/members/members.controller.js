(function() {

  'use strict';

  angular.module('sigmaomegasigma')
  .controller('MembersCtrl', MembersController);

  function MembersController($scope, $ionicPlatform, $ionicModal, UserService, FirebaseFactory, $cordovaFile, $cordovaFileTransfer, $timeout, $ionicLoading) {
    var self = this;

    self.getMembers = getMembers;
    self.showStatus = showStatus;
    self.active = active;
    self.openInfoModal = openInfoModal;
    self.closeInfoModal = closeInfoModal;
    self.openChooseModal = openChooseModal;
    self.closeChooseModal = closeChooseModal;

    self.percentage = 0;
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

    function loading(val) {
      if(val) {
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner><p class="energized">This could take a while...</p>'
        });
      } else {
        $ionicLoading.hide();
      }
    }

    loading(true);

    function getMembers() {
      if(self.loaded === false) {
        FirebaseFactory.getItems('/members').on('value', function(snapshot) {
          self.members = snapshot.val();
          self.loaded = true;
          getImages(0);
        });
      } else {
        getImages(0);
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

    function getImage(member, url, fileString, targetPath, trustHosts, options, num) {
      $cordovaFile.checkFile(cordova.file.dataDirectory, fileString)
      .then(function (success) {
        member.dlimage = targetPath;
        getImages(num+1);
      }, function (error) {
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function(result) {
          member.dlimage = targetPath;
          getImages(num+1);
        }, function(err) {
          console.log(err);
          member.dlimage = 'http://placehold.it/100x100?text=None';
          getImages(num+1);
        }, function (progress) {
          $timeout(function () {
            self.downloadProgress = (progress.loaded / progress.total) * 100;
          });
        });
      });
    }

    function getImages(num) {
      if(num < self.members.length) {
        var member = self.members[num];
        var url,
            fileString,
            targetPath,
            trustHosts = true,
            options = {};

        if(!!member.image && member.image.length > 0) {
          url = member.image;
          fileString = member.first_name.toLowerCase() + '-' + member.last_name.toLowerCase() + '.jpg';
          targetPath = cordova.file.dataDirectory + fileString;
        } else {
          url = 'http://placehold.it/150x150?text=None';
          fileString = 'placeholder.png';
          targetPath = cordova.file.dataDirectory + fileString;
        }
        getImage(member, url, fileString, targetPath, trustHosts, options, num);
      } else {
        loading(false);
      }
    }

    self.getMembers();

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
