angular.module('starter.controllers', [])

.constant('spiceRef', new Firebase('https://spicewords.firebaseio.com/'))
.constant('chatsRef', new Firebase('https://spicewords.firebaseio.com/opened_chats'))

.controller('AppCtrl', function($scope, $location, $ionicModal, $timeout, spiceRef) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.loginStatus = {
    status: 'logout'
  };

  $scope.auth = new FirebaseSimpleLogin(spiceRef, function (error, user) {
    if (error) {
      console.log(error);
      alert(error);
      $scope.loginStatus.error = error;
      $scope.loginStatus.status = 'error'
      /*
      switch(error.code) {
        case 'INVALID_EMAIL':
        case 'INVALID_PASSWORD':
        default:
      }
      */
    } else if (user) {
      console.log(user.uid);
      $scope.loginStatus.user = user;
      $scope.loginStatus.status = 'login';
      $location.path('/app/message');
    } else {
      // user is logged out
      $scope.loginStatus.user = null;
      $scope.loginStatus.status = 'logout';
      $scope.login();
    }
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (data) {
    console.log('Doing login', $scope.loginData);

    $scope.auth.login('password', $scope.loginData);
  };

  $scope.doSignup = function (data) {
    console.log('Doing signup', $scope.loginData);

    $scope.auth.createUser($scope.loginData.email, $scope.loginData.password, function (error, user) {
      if (!error) {
        console.log('User Id: ' + user.uid + ', Email: ' + user.email);
        //$scope.auth.login('password', $scope.loginData);
      } else {
        console.log(error);
        alert(error);
        $scope.loginStatus.error = error;
        $scope.loginStatus.status = 'error'
      }
    });
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MessageCtrl', function($scope, $stateParams, $location, chatsRef) {
  $scope.chats = $firebase(chatsRef);

  $scope.favorites = [
    'Yuri S.',
    'Penn S.',
    'Venkytesh B.',
    'Golly A.',
    'Jessica V.'
  ]

  $scope.openOrCreateChat = function (chatId) {

    if (typeof chatId == 'undefined') {

      chatId = Math.floor(Math.random() * 5000001);
      $scope.chats.$add({
        id: chatId,
        title: $scope.favorites[Math.floor(Math.random() * $scope.favorites.length)]
      });
    }

    $location.path('/chats/' + chatId);
  }
})

.controller('ChatListCtrl', function($scope, $stateParams) {
  $scope.chats = [
    'Yuri S.',
    'Penn S.',
    'Venkytesh B.',
    'Golly A.',
    'Jessica V.',
    'Pe4nn A.',
    'Pe8nn Z.',
    'F6ire B.',
    'J1essica V.',
    'P2enn A.',
    'P3enn Z.',
    'F4ire B.',
    'A5mazing A.',
    'Balls D.',
    '99F4ire B.',
    '2A5mazing A.',
    '1Balls D.',
    'Chicken F.'
  ]

})

.controller('ChatCtrl', function($scope, $stateParams) {
})
