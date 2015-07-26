angular.module('starter.services', ['btford.socket-io'])

.factory('socket', function(socketFactory){
  //Create socket and connect to http://chat.socket.io 
  var myIoSocket = io.connect('http://localhost:1337/chat');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
