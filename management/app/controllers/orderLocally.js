myApp.controller('orderLocallyCtl', function($scope, $location, $routeParams, httpClient, imageSrc)
{    
    var vm = this;
    
    vm.user = {login: atob($.cookie('device_token').replace("==","")).split(":")[1]};
    
    if($routeParams.label && $routeParams.id)
    {
		vm.selectedTable = $routeParams.label;
        vm.selectedTableId = $routeParams.id;
        
        var params = {tableId : vm.selectedTableId}  
        if($routeParams.busy)
        {
            vm.showLocalOrdersLoading = true;  
            httpClient
                .get('management/api/getTableOrderById', params).then(
                function(data, response)
                {
                    console.log("success");
                    var items = data;
                    for(var i = 0; i < items.length; i++)
                    {
                        items[i]["icon"] = "glyphicon glyphicon-glass";
                    }

                    vm.defaultSetOrders = items;
                    vm.showLocalOrdersLoading = false;
                },
                function(err) 
                {
                    console.log(err);
                    vm.showLocalOrdersLoading = false;
                });  
       }
       else
       {
            vm.defaultSetOrders = [];
        }
    }
    
    vm.sendLocalOrder = function(items, self)
    {
        var objects = JSON.parse(JSON.stringify(items));
        var newObjects = JSON.parse(JSON.stringify(self.newObjects));
        for(var i = 0; i < objects.length; i++)
        {
            delete objects[i]["pic"];
            delete objects[i]["icon"];
            delete objects[i]["id"];
        }
        for(var i = 0; i < newObjects.length; i++)
        {
            delete newObjects[i]["pic"];
            delete newObjects[i]["icon"];
            delete newObjects[i]["id"];
        }
        var params = {};
        params["tableId"] = vm.selectedTableId;
        params["assignee"] = vm.user.login;
        params["total"] = self.total;
        params["totalNewItems"] = self.totalNewObjects;
        params["items"] = objects;
        params["newItems"] = newObjects;
        vm.showLocalOrdersLoading = true;
        httpClient
            .get('management/api/publishLocalOrderFromDashboard', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLocalOrdersLoading = false;
                self.objects = [];
          //      vm.showAlert("success", "The order has been sent.");
                $location.url("/listTables");
                vm.updatetables();
            },
            function(err) 
            {
                console.log(err);
                vm.showLocalOrdersLoading = false;
            }); 
    }

    vm.onMarkAsPaid = function()
    {
        var params = {tableId: vm.selectedTableId, tableStatus: "paid"}
        vm.showLocalOrdersLoading = true;
        httpClient
            .get('management/api/getTableOrderById', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLocalOrdersLoading = false;
                self.objects = [];
                $location.url("/listTables");
                vm.updatetables();
            },
            function(err) 
            {
                console.log(err);
                vm.showLocalOrdersLoading = false;
            });  
    }
    
    vm.updatetables = function(){
        vm.tableSelected = false;
        vm.showLocalOrdersLoading = true;
        var params = {};
        httpClient
            .get('management/api/getLocalOrders', params).then(
            function(data, response){
                console.log("success");
                for(var x = 0; x < vm.tables.length; x++){
                    vm.tables[x]["busy"] = false;
                }
                for(var y = 0; y < data.length; y++){
                    vm.tables[data[y].tableId - 1]["busy"] = true; 
                }
                vm.showLocalOrdersLoading = false;
            },
            function(err) {
                console.log(err);
                vm.showLocalOrdersLoading = false;
            });  
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