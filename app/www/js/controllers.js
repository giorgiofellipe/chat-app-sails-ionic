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

.controller('ChatController', function($scope, $rootScope, $stateParams, $http, $sails, $ionicScrollDelegate, $ionicPlatform) {
  $scope.messages = [];

  $sails.get('/chat/addMessage/');
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

  $sails.on('connect',function(){
    //Add user called nickname
    $sails._raw.emit('add user', $scope.user.name);
  });
  $sails.on('new message', function (data) {
    addMessageToList(data.username, true, data.message)
  });

  //function called when user hits the send button
  $scope.sendMessage = function() {
    console.log('post message');
    $sails.post('/chat/addMessage/',{message: $scope.message, time: new Date(), user: $rootScope.user.id});
    $sails._raw.emit('stop typing');
    $scope.message = "";
  }


  function addMessageToList(username, style_type, message){
    $scope.messages.push({content: message, style:style_type, username:username})  // Push the messages to the messages list.
    $ionicScrollDelegate.scrollBottom(); // Scroll to bottom to read the latest
  }

  // Whenever the server emits 'user joined', log it in the chat body
  $sails.on('user joined', function (data) {
    addMessageToList("", false, data.username + " joined")
    addMessageToList("", false, message_string(data.numUsers)) 
  });

  // Whenever the server emits 'user left', log it in the chat body
  $sails.on('user left', function (data) {
    addMessageToList("",false,data.username+" left")
    addMessageToList("",false,message_string(data.numUsers))
  });

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
