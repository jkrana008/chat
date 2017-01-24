angular.module('starter')
    .controller('friendsCtrl', friendsCtrl);

function friendsCtrl($state, currentUser, firebaseService, $localForage, friendsService, $interval){
    
    var friends = this;

    friends.usersArray = firebaseService.usersArray;
    friends.user = currentUser.info;
    friends.friendsList = friendsService.friendsList;

    $interval(function () {
        friends.usersArray.$loaded()
            .then(function(){
                angular.forEach(friends.usersArray, function(user){
                    var bool = false;
                    if(user.uid != friends.user.userId) {
                        angular.forEach(friends.friendsList, function (friendsList) {
                            if (user.uid == friendsList.uid) {
                                bool = true;
                            }
                        })
                        if (!bool) {
                            friends.friendsList.push(user);
                            $localForage.setItem('friendsList', friends.friendsList);
                        }
                    }
                })
            });
    },10000);

    friends.chat = chat;

    function chat(firstName, lastName,chatID){
        var name = firstName + ' ' + lastName;
        $state.go('tab.friendsChat',{name : name, id : chatID});
    }

}
