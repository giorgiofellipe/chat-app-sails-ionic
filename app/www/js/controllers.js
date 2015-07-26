angular.module('starter.controllers', ['btford.socket-io'])

.controller('DashCtrl', function($scope) {})

.controller('ChatController', function($scope, $stateParams, $http, socket, $ionicScrollDelegate) {
  $scope.messages = [];

  socket.on('connect',function(){
    //Add user called nickname
    socket.emit('add user',$scope.user.name);
  });
  socket.on('new message', function (data) {
    addMessageToList(data.username, true, data.message)
  });

  //function called when user hits the send button
  $scope.sendMessage = function() {
    console.log('post message');
    $http.post('http://localhost:1337/chat', {message: $scope.message, time: new Date()}).
    success(function(data, status, headers, config) {
      socket.emit('new message', data);
    }).
    error(function(data, status, headers, config) {

    });
    addMessageToList($stateParams.nickname, true, $scope.message)
    socket.emit('stop typing');
  }


  function addMessageToList(username, style_type, message){
    // username = $sanitize(username) //The input is sanitized For more info read this link
    $scope.messages.push({content: message,style:style_type,username:username})  // Push the messages to the messages list.
    $ionicScrollDelegate.scrollBottom(); // Scroll to bottom to read the latest
  }

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    addMessageToList("",false,data.username + " joined")
    addMessageToList("",false,message_string(data.numUsers)) 
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
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
