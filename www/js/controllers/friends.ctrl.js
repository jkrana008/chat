angular.module('starter')
    .controller('friendsCtrl', friendsCtrl);

function friendsCtrl($state, currentUser, firebaseService, $localForage, $interval, $rootScope, $scope){

    if(window.cordova){
        FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
                //Notification was received on device tray and tapped by the user.
                alert( JSON.stringify(data) );
            }else{
                //Notification was received in foreground. Maybe the user needs to be notified.
                alert( JSON.stringify(data) );
            }
        });
    }

    var friends = this;

    friends.user = currentUser.info;
    friends.friendsList = firebaseService.usersArray;

    friends.chat = chat;

    function chat(firstName, lastName,chatID){
        var name = firstName + ' ' + lastName;
        $state.go('tab.friendsChat',{name : name, id : chatID});
    }

}
