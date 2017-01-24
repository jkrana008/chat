angular.module('starter')
    .controller('chatCtrl', chatCtrl);

function chatCtrl($scope, $stateParams, currentUser, firebaseService, $localForage) {

    var chat = this;

    chat.receiverName = $stateParams.name;
    chat.receiverID = $stateParams.id;
    chat.senderID = currentUser.info.userId;
    chat.chatsArray = firebaseService.chatsArray;

    chat.sendMessage = sendMessage;
    chat.chatArray = [];

    chat.chatsArray.$loaded()
        .then(function () {
            angular.forEach(chat.chatsArray, function (chatMessage) {
                if ((chatMessage.receiverID == chat.senderID && chatMessage.senderID == chat.receiverID) || (chatMessage.senderID == chat.senderID && chatMessage.receiverID == chat.receiverID)  ){
                    chat.chatArray.push(chatMessage);
                }
            });
        })




    function sendMessage(message) {
        if (message) {
            var temp = {
                senderID: chat.senderID,
                receiverID: chat.receiverID,
                text: message,
                time: Date(),
                status: false,
            }
            chat.chatsArray.$add(temp);
            chat.chatArray.push(temp);

            chat.message = '';
        }
    }
    ;
}