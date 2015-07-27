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
      Chat.create(data_from_client)
        .exec(function(error,data_from_client){
          console.log(data_from_client);
          Chat.publishCreate({id: data_from_client.id, message: data_from_client.message, time: data_from_client.time, user: data_from_client.user});
        }); 
    }
    else if(req.isSocket){
      // subscribe client to model changes 
      Chat.watch(req.socket);
      console.log( 'User subscribed to ' + req.socket.id );
    }
  }
};
