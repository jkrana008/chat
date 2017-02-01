angular.module('starter')
    .controller('chatCtrl', chatCtrl)
    .directive('autoFocus', function() {
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs)
            {
                element.bind('blur', function()
                {
                    element[0].focus();
                });
            }
        }
    });

function chatCtrl($scope, $stateParams, currentUser, firebaseService, $localForage, $interval, $http) {

    var chat = this;
    chat.receiverName = $stateParams.name;
    chat.receiverID = $stateParams.id;
    chat.senderID = currentUser.info.userId;
    chat.chatsArray = firebaseService.chatsArray;


    chat.sendMessage = sendMessage;


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

            firebaseService.usersArray.$loaded()
                .then(function () {
                    var data = {
                        "to": firebaseService.usersArray.$getRecord(chat.receiverID).deviceToken,
                        "priority": "high",
                        //"content_available": true,
                        "notification": {
                            "title": "Youstart Chat",
                            "body": currentUser.info.firstName + " : " + message,
                            "sound": "default",
                            "click_action":"FCM_PLUGIN_ACTIVITY",
                            "icon": "fcm_push_icon"
                        },
                        //"data" : ""
                    };
                    
                    var url = "https://fcm.googleapis.com/fcm/send";
                    $http.post(url, data,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": "key=AIzaSyChtmm-HksUrQT4raj5HuunzIMhEn5-7gY"			// serverKey
                            }
                        }
                    )
                });



            chat.message = '';
        }
    }
    ;
}