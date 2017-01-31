angular.module('starter')
    .filter('timeFilter', timeFilter)
    .filter('friendsFilter',friendsFilter)
    .filter('chatFilter', chatFilter);

function friendsFilter() {
    return function(input,userId) {

        return input.filter(function(item){
            if(item.uid != userId){
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