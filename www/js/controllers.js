angular.module('starter.controllers', [])

.constant('spiceRef', new Firebase('https://spicewords.firebaseio.com/'))

.controller('AppCtrl', function($scope, $ionicModal, $timeout, spiceRef) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.loginStatus = {
    status: 'logout'
  };

  var auth = new FirebaseSimpleLogin(spiceRef, function (error, user) {
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

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
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
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    if ($scope.loginStatus.status == 'logout') {
      auth.login('password', $scope.loginData);
    }
  };

  $scope.doSignup = function () {
    auth.createUser($scope.loginData.email, $scope.loginData.password, function (error, user) {
      if (!error) {
        console.log('User Id: ' + user.uid + ', Email: ' + user.email);
        auth.login('password', $scope.loginData);
      }
    });
  };
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

.controller('MessageCtrl', function($scope, $stateParams) {
  $scope.favorites = [
    'Yuri S.',
    'Penn S.',
    'Venkytesh B.',
    'Golly A.',
    'Jessica V.'
  ]

})

.controller('ChatCtrl', function($scope, $stateParams) {
})
