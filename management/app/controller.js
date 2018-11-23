myApp.controller('appCtrl', function($scope, $timeout, $location, $sce, httpClient, headerItemsJson, menuItemsJson, imageSrc, categories) {
    var vm = this;

    vm.headerItems = headerItemsJson;
    vm.imageSrc = imageSrc;
    vm.user = {login: atob($.cookie('device_token').replace("==","")).split(":")[1]};
    vm.menuItems = menuItemsJson;

    vm.onMenuItemClick = function(item){
        if(item.label == "Online Orders"){
            vm.clientSet = false;
            var endDate = moment(new Date()).format("YYYY-MM-DDT23:59:59+0000");    
            vm.gridParams = {};
            vm.gridParams["endDate"] = endDate;
            vm.ordersStartDate = null;
            vm.ordersEndDate = null;
        }
        /*
        if(item.label == "Order Online"){
            vm.clientSet = false;
            vm.name = null;
            vm.email = null;
            vm.address = null;
            vm.number = null;
        }
        */
    }
});

myApp.controller('notificationCtrl', function($scope, httpClient) {
    var vm = this;
    vm.params = {} 

	 httpClient
            .get("management/api/getNotificationsSettings", null)
            .then(
            function(data, response) {
                vm.showLoadingSubmit = false;
                if(data && (data.emails || data.mobiles)){
                    var emailsArray = JSON.parse(data.emails);
                    var mobilesArray = JSON.parse(data.mobiles);
                    if(typeof emailsArray == "string") emailsArray = [emailsArray];
                    if(typeof mobilesArray == "string") mobilesArray = [mobilesArray];
                    vm.emails= emailsArray;
                    vm.mobiles = mobilesArray;
                }else{
                    vm.emails = [];
                    vm.mobiles = [];
                }
                console.log('SUCCESS');
            },
            function(err) {
                vm.showLoadingSubmit = false;
                console.log('ERROR');
            });

    vm.buildParams = function(){
        var emailsArray = [];
        var mobilesArray = [];
        if(vm.emails){
            for(var i = 0; i < vm.emails.length; i++){
                emailsArray.push(vm.emails[i]["text"]);
            }  
        }
        if(vm.mobiles){
            for(var i = 0; i < vm.mobiles.length; i++){
                mobilesArray.push(vm.mobiles[i]["text"]);
            }
        }
        vm.params["emails"] = emailsArray;
        vm.params["mobiles"] = mobilesArray;
    } 

    vm.submit = function()
    {
        vm.buildParams();
        vm.showLoadingSubmit = true;
        
        httpClient
            .get("management/api/updateNotificationsSettings", vm.params)
            .then(
            function(data, response) {
                vm.showLoadingSubmit = false;
                
                console.log('SUCCESS');
            },
            function(err) {
                vm.showLoadingSubmit = false;
                console.log('ERROR');
            });

       
    }

});