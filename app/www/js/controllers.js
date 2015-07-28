angular.module('starter.controllers', ['ngSails'])

.controller('DashCtrl', function($scope) {})

.controller('LoginController', function($scope, $rootScope, $state, $ionicPlatform, $http) {
  $scope.login = function() {
    $http.post('http://localhost:1337/auth/loginApp', {username: $scope.email, password: $scope.password})
    .success(function(data, status, headers, config) {
      $rootScope.user = data;
      $state.go('tab.dash');
    })
    .error(function(data, status, headers, config) {
      console.log('error', status, data);
    });
  };
  $scope.loginFB = function() {
    $http.get('http://localhost:1337/auth/facebook', {})
    .success(function(data, status, headers, config) {
      console.log('success', status, data);
    })
    .error(function(data, status, headers, config) {
      console.log('error', status, data);
    });
  };
  $scope.signUp = function() {
    console.log({fullName: $scope.username, email: $scope.email, password: $scope.password});
    $http.post('http://localhost:1337/auth/signupApp', {fullName: $scope.username, email: $scope.email, password: $scope.password})
    .success(function(data, status, headers, config) {
      $scope.login();
    })
    .error(function(data, status, headers, config) {
      console.log('error', status, data);
    });
  };
  $scope.signUpUI = function() {
    $state.go('signup');
  };
  $scope.loginUI = function() {
    $state.go('login');
  };
})

.controller('ChatController', function($scope, $rootScope, $stateParams, $sails, $ionicScrollDelegate, $ionicPlatform) {
  $scope.messages = [];
  $scope.connected = true

  $sails.get('/chat/addMessage/', {user: $rootScope.user});

  $sails.on('connect',function() {

    $sails.on('chat', function(obj){
      console.log(obj);
      //Check whether the verb is created or not
      if(obj.verb === 'created') {
        var username = null;
        console.log('/user?id='+obj.data.user);
        $sails.get('/user?id='+obj.data.user)
        .success(function (data, status, headers, jwr) {
          username = data.name;
          addMessageToList(username, true, obj.data.message);
        })
        .error(function (data, status, headers, jwr) {
          console.log(data, status, headers, jwr);
        });
      }
    });

    // On login display welcome message
    $sails.on('login', function (data) {
      //Set the value of connected flag
      $scope.connected = true
      $scope.peopleQtyMessage = message_string(data.numUsers);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    $sails.on('user_joined', function (data) {
      if (data.user.name != $rootScope.user.name) {
        addMessageToList("", false, data.user.name + " joined");
        $scope.peopleQtyMessage = message_string(data.numUsers);
      }
    });

    // Whenever the server emits 'user left', log it in the chat body
    $sails.on('user_left', function (data) {
      addMessageToList("", false, data.name +" left")
      addMessageToList("", false, message_string(data.numUsers))
    });

    //Whenever the server emits 'typing', show the typing message
    $sails.on('typing', function (data) {
      addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    $sails.on('stop_typing', function (data) {
      removeChatTyping(data.name);
    }); 
  })
  //function called when user hits the send button
  $scope.sendMessage = function() {
    if ($scope.message) {
      $sails.post('/chat/addMessage/',{message: $scope.message, time: new Date(), user: $rootScope.user.id});
      $sails._raw.emit('stop typing');
      $scope.message = "";
    }
  }

  function addMessageToList(username, style_type, message){
    $scope.messages.push({content: message, style:style_type, username:username})  // Push the messages to the messages list.
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true); // Scroll to bottom to read the latest
  }

  // Return message string depending on the number of users
  function message_string(number_of_users) {
    return number_of_users === 1 ? "there's 1 participant":"there are " + number_of_users + " participants"
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
