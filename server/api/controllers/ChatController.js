/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addMessage: function (req, res) {
    var data_from_client = req.params.all();
    if(req.isSocket && req.method === 'POST'){
      // This is the message from connected client
      // So add new conversation
      if (data_from_client.message) {
        Chat.create(data_from_client)
        .exec(function(error,data_from_client){
          console.log(data_from_client);
          Chat.publishCreate({id: data_from_client.id, message: data_from_client.message, time: data_from_client.time, user: data_from_client.user});
        }); 
      }
    } else if (req.isSocket){
      // subscribe client to model changes 
      Chat.watch(req.socket);
      
      sails.sockets.emit(req.socket.id, 'connect');
      

      
      sails.sockets.join(req.socket, '');
      var subscribers = sails.sockets.subscribers('');
      console.log(sails.sockets.subscribers(''));
      sails.sockets.emit(req.socket.id, 'login', {numUsers: subscribers.length});
      sails.sockets.broadcast('', 'user_joined', {numUsers: subscribers.length, user: data_from_client.user});

      console.log( 'User subscribed to ' + req.socket.id );
    }
  }
};
