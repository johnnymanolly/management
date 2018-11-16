myApp.controller('showScheduledOrdersCtl', function($scope, $location, httpClient)
{
    var vm = this;
    
    vm.user = {login: atob($.cookie('device_token').replace("==","")).split(":")[1]};
    
    vm.scheduledGridParams = {};
    vm.scheduledGridParams["startDate"] = moment(new Date()).add(1, "day").format("YYYY-MM-DDT00:00:00+0000");
    
     vm.onlineOrdersColDef = [
        {headerName: "Order Id", field: "orderId", editable : false},
        {headerName: "Name", field: "fullName", editable : false, cellStyle: function(params) {
            if (params.data.client=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": '#c83834', "font-weight": 'bold'};
            }
        }},
        {headerName: "Address", field: "address", editable : false, hide: false},
        {headerName: "Maps", field: "location", editable : false, hide: true,  cellRenderer: function (params) {  
            return vm.viewLocation(params);
        }},
        {headerName: "Number", field: "number", editable : false},
        {headerName: "Total", field: "total", hide: true},
        {headerName: "Ordered By", field: "orderedBy", hide: true},
        {headerName: "Client", field: "client",  hide: true, cellStyle: function(params) {
            if (params.value=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": 'red', "font-weight": 'bold'};
            }
        }},

        {headerName: "Creation date", field: "orderedDate", editable : false, cellRenderer: function (params) {  
            return vm.dateRenderer(params);
        }}, 

        {headerName: "Delivery Date", field: "deliveryDate", editable : false, cellRenderer: function (params) {  
            if(params.value){
                return vm.dateRenderer(params);
            }
        }},
        {headerName: "Cancelled", field: "cancelled", editable : false, hide: true},
        {headerName: "Assignee", field: "assignee", editable : false, cellRenderer: function (params) {  
            return vm.assignToMeButtonRenderer(params);
        }},
        {headerName: "Order Source", field: "source", hide: true, cellRenderer: function (params) {  
            return vm.orderSourceRenderer(params);
        }},
        {headerName: "Status", field: "orderStatus", editable : false, cellRenderer: function (params) {  
            return vm.statusRenderer(params);
        }},
        {headerName: "View Order", editable : false, cellRenderer: function (params) {  
            return vm.viewOrder(params);
        }},
        /*
        {headerName: "Tracking Delivery", field: "deliveredBy", cellEditor: "select", editable : true,
         cellEditorParams: {  
             values : vm.obj
         }},
        {headerName: "Mark as delivered", field: "delivered", editable : false, cellRenderer: function (params) {  
            return vm.markAsDelivered(params);
        }}
        */];
    
    vm.viewLocation = function(params)
        {
            if(params.value)
            {
                return '<div><a target="_blank" href="/management/templates/location.html?number='+params.data.number+'&name='+params.data.name+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.creationDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&location='+params.data.location+'"">view location</a></div>' 
            }
            else
            {
                return '<button class="disabled fix-inline mrgt1" tooltip-placement="auto" uib-tooltip="Client did not provide his location">view location</button>' 
            }
        }
        
        vm.dateRenderer = function(params)
        {
            if(params.value)
            {
                var orderDate = params.value.replace("T", " ").replace("+0000", "");
                return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ orderDate +'">'+orderDate+'</span>'
            }
            else
            { 
                return "";
            }
   		}
        
        vm.assignToMeButtonRenderer = function(params)
        {
            if(params.data.cancelled == "Yes")
            {
                return '<button tooltip-placement="auto" uib-tooltip="This order is cancelled" class="confirm-order disabled">Assign to me</button>'
            }
            if(params.value)
            {
                return '<span class="processed-by">'+params.value+'</span>'
            }
            else
            {
                return '<button class="confirm-order">Assign to me</button>'
            }
        }
        
        vm.statusRenderer = function(params)
        {
            return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
        }

    
    	vm.viewOrder  = function(params)
        {
            if(params.data && params.data.assignee)
            {
                return '<div><a target="_blank" href="/management/templates/viewOnlineOrder.html?number='+params.data.number+'&name='+params.data.fullName+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.orderDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&total='+params.data.total+'&deliveryDate='+params.data.deliveryDate+'&orderedBy='+params.data.orderedBy+'&onlineOrderSource=true">view order</a></div>' 
            }
            else
            {
                return '<button class="disabled fix-inline mrgt1" tooltip-placement="auto" uib-tooltip="Please assign to the order first">view order</button>'
            }
        }
        
        vm.defaultCellRenderer = function(params)
        {
            if(params.value)
            {
                return '<span class="ag-cell-inner" tooltip-placement="top" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
            }
            else
            {
                return ''
            }
    	}
        
        vm.onSelectionChanged = function(scope, selectedRow)
        {
            if(scope.api.getFocusedCell().column.colDef.headerName == "Assignee")
            {
                var selectedRow = scope.api.getSelectedNodes()[0];
                if(selectedRow.data && !selectedRow.data.assignee && selectedRow.data.cancelled == "No")
                {
                    var params = {};
                    params["action"] = "edit";
                    params["row"] = selectedRow.data;
                    params["row"]["assignee"] = vm.user.login;
                    params["row"]["orderStatus"] = "Assigned";
                    delete params["creationDate"];
                    scope.api.showLoadingOverlay();
                    httpClient
                        .post('management/api/getOrders', params).then(
                        function(data, response)
                        {
                            console.log("success");
                            scope.api.hideOverlay();
                        },
                        function(err)
                        {
                            //      vm.showAlert("success", "The order has been sent.");
                            console.log(err);
                            scope.api.hideOverlay();
                        });   
                }
            }
            else if(scope.api.getFocusedCell().column.colDef.headerName == "View Location")
            {
                $location.url("/maps");
            }
            else if(scope.api.getFocusedCell().column.colDef.headerName == "Mark as delivered")
            {
                var selectedRow = scope.api.getSelectedNodes()[0];
                if(selectedRow.data && selectedRow.data.delivered != "Delivered" && selectedRow.data.orderStatus == "Confirmed")
                {
                    var params = {};
                    params["row"] = selectedRow.data;
                    params["action"] = "edit";
                    params["row"]["orderStatus"] = "Delivered";
                    params["row"]["delivered"] = "Delivered";
                    delete params["creationDate"];
                    scope.api.showLoadingOverlay();
                    httpClient
                        .post('management/api/getOrders', params).then(
                        function(data, response)
                        {
                            console.log("success");
                            scope.api.hideOverlay();
                        },
                        function(err) 
                        {
                            console.log(err);
                            scope.api.hideOverlay();
                        });   
                }
            }
   	 	}
    
});