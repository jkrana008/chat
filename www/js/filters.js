angular.module('starter')
    .filter('timeFilter', timeFilter)
    .filter('friendsFilter',friendsFilter)
    .filter('dayFilter', dayFilter)
    .filter('chatFilter', chatFilter);

function friendsFilter() {
    return function(input,userId) {
        return input.filter(function(item){
            if(item.userId != userId){
                return item;
            }
        })
    }

}

function timeFilter(){
    return function(input){
        return Date.parse(input);
    }
}

function dayFilter() {
    
    var flag1 = '';
    var flag2 = '';
    return function (messageTime, type) {
        console.log(type);
        var currentTime = new Date();
        messageTime = Date.parse(messageTime);
        messageTime = new Date(messageTime);
        if(type == 'ng-if'){
            if(currentTime.getDay() == messageTime.getDay()){
                if(flag1 != 'Today'){
                    flag1 = 'Today';
                    return true;
                }
            }else if(currentTime.getDay() -1 == messageTime.getDay()){
                if(flag1 != 'Yesterday'){
                    flag1 = 'Yesterday';
                    return true;
                }
            }
        }else{
            if(currentTime.getDay() == messageTime.getDay()){
                if(flag2 != 'Today'){
                    flag2 = 'Today';
                    return flag2;
                }
            }else if(currentTime.getDay() -1 == messageTime.getDay()){
                if(flag2 != 'Yesterday'){
                    flag2 = 'Yesterday';
                    return flag2;
                }
            }
        }

    }
}

function chatFilter($ionicScrollDelegate){
    return function (input, senderID, receiverID) {
        return input.filter(function (item) {
            //console.log(item);
            if((item.receiverID == senderID && item.senderID == receiverID)
                ||
                (item.senderID == senderID && item.receiverID == receiverID)){
                $ionicScrollDelegate.scrollBottom();
                return item;
            }
        })
    }
}