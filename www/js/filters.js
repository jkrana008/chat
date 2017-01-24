angular.module('starter')
    .filter('timeFilter', timeFilter)
    .filter('userFilter',userFilter);

function userFilter() {
    return function(input,userId) {

        return input.filter(function(item){
            if(item.uid == userId){
                console.log(userId);
                item.name = 'Self';
                return item;
            }else{
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