angular.module('starter')
    .controller('friendsCtrl', friendsCtrl);

function friendsCtrl($state, currentUser, firebaseService, $localForage, $interval, $rootScope, $scope){
    var friends = angular.extend(this, {
        user : currentUser.info,
        friendsList : firebaseService.usersArray,
        chat : chat
    });
    
    activate();
    
    function activate() {
        if(window.cordova){
            FCMPlugin.onNotification(function(data){
                if(data.wasTapped){
                    //Notification was received on device tray and tapped by the user.
                    alert( JSON.stringify(data) );
                }else{
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    //alert( JSON.stringify(data) );
                }
            });
        }
    }


    function chat(firstName, lastName,chatID){
        var name = firstName + ' ' + lastName;
        $state.go('tab.friendsChat',{name : name, id : chatID});
    }

}
