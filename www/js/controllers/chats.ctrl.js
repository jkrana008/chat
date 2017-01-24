angular.module('starter')
    .controller('chatsCtrl', chatsCtrl);

function chatsCtrl(firebaseService, currentUser, $state){
    var chats = this;

    chats.user = currentUser.info;
    chats.usersArray = firebaseService.usersArray;
    chats.chatsArray = firebaseService.chatsArray;
    chats.chatFriends = [];
    chats.chat = chat;

    chats.chatsArray.$loaded()
        .then(function () {
            angular.forEach(chats.chatsArray, function (message) {
               if(message.senderID == chats.user.userId){
                   var friend = chats.usersArray.$getRecord(message.receiverID);
                   if(chats.chatFriends.indexOf(friend) == -1){
                        chats.chatFriends.push(friend);
                   }
               }else if(message.receiverID == chats.user.userId){
                   var friend = chats.usersArray.$getRecord(message.senderID);
                   if(chats.chatFriends.indexOf(friend) == -1){
                       chats.chatFriends.push(friend);
                   }
               }
            });
        });

    function chat(firstName, lastName, chatId){
        var name = firstName + ' ' + lastName;
        $state.go('tab.chatsChat',{name : name, id : chatId});
    }
}
