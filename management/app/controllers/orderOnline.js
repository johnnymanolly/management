myApp.controller('orderOnlineCtl', function($scope, $location, httpClient, imageSrc)
{    
    var vm = this;
    
    vm.user = {login: atob($.cookie('device_token').replace("==","")).split(":")[1]};
    
    vm.orderListClientsCallback = function(data)
    {
        var items = [];
        if(data.users)
        {
            var users = data.users;
            for(var i = 0; i < users.length; i++)
            {
                var item = {};
                items["id"] = i;
                item["name"] = users[i].name[0];
                item["number"] = users[i].id[0];
                item["address"] = (users[i].address) ? users[i].address[0] : "";
                item["email"] = users[i].email[0];
                item["pic"] = imageSrc.userImg;
                items.push(item);
            }
        }
        if(data.clients)
        {
            var clients = data.clients;
            for(var i = 0; i < clients.length; i++)
            {
                var item = {};
                items["id"] = i;
                item["name"] = clients[i].name;
                item["number"] = clients[i].number;
                item["address"] = clients[i].address;
                item["email"] = clients[i].email;
                item["pic"] = imageSrc.userImg;
                items.push(item);
            }
        }
        if(vm.clientSet)
        {
            $scope.$broadcast('angucomplete-alt:changeInput', "clientsList", vm.name);
        }
        return items;
    }
    
     vm.onClientSelect = function(data, scope)
     {
        vm.clientSet = true;
        vm.name = data.originalObject.name;
        vm.address = data.originalObject.address;
        vm.number = data.originalObject.number;
        vm.email = data.originalObject.email;
    }
     
     vm.sendOnlineOrder = function(items, self)
     {
        var objects = JSON.parse(JSON.stringify(items));
        for(var i = 0; i < objects.length; i++)
        {
            delete objects[i]["pic"];
            delete objects[i]["icon"];
            delete objects[i]["id"];
        }
        var params = {};
        params["assignee"] = vm.user.login;
        params["fullName"] = vm.name;
        params["fullName"] = vm.name;
        params["number"] = vm.number;
        params["address"] = vm.address;
        params["orderedBy"] = vm.user.login;
        params["total"] = self.total;
        params["items"] = objects;
        params["orderedDate"] = moment(new Date).format('YYYY-MM-DDTHH:mm:ss+0000');
        params["deliveryDate"] = vm.deliveryOrderDate || params["orderDate"];
        vm.showLoading = true;
        httpClient
            .get('management/api/publishOrderFromDashboard', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLoading = false;
                self.objects = [];
                self.orderSent = false;
                $scope.$broadcast('angucomplete-alt:clearInput', "clientsList");
                vm.clientSet = false;
                vm.deliveryOrderDate = null;
                //    vm.showAlert("success", "The order has been sent.");
                $location.path("/onlineOrders")
            },
            function(err) 
            {
                console.log(err);
                vm.showLoading = false;
            }); 
    }
     
    vm.onSelect = function(item, scope){
      //  console.log("test")
    }
    
    vm.orderListCallback = function(data)
    {
        var items = [];
        for(var i = 0; i < data.length; i++)
        {
            var item = {};
            item["id"] = i;
            item["key"] = data[i].key;
            item["name"] = data[i].name;
            item["quantity"] = 1;
            item["category"] = data[i].category;0
            item["description"] = data[i].description;
            item["price"] = data[i].price;
            item["image"] = data[i].image;
            item["icon"] = "glyphicon glyphicon-glass";
            item["pic"] = imageSrc.orderImg;
            items.push(item);
        }
        return items;
    }

    
});