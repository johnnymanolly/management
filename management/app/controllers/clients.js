myApp.controller('clientsCtl', function($scope, $location, httpClient)
{    
    var vm = this;
    
    vm.addClientColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Number", field: "number"},
        {headerName: "Primary Address", field: "address"},
        {headerName: "Secondary Address", field: "secondaryAddress"},
        {headerName: "Order", editable : false, cellRenderer: function (params) {  
            return vm.order(params);
        }}
    ];
    
    vm.order = function(params)
    {
        if(params.data.name)
        {
            return '<div><a href="#/order">Order</a></div>' 
        }
        else
        {
            return '<div target="_blank" ng-click="$ctrl.stopEditing()">Order</div>'
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
    
    vm.onClientCellClicked = function(event, scope)
    {
        if(scope.api.getFocusedCell().column.colDef.headerName == "Order")
        {
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data;
            var name = params.name;
            var number = params.number;
            var email = params.email;
            var address = params.address;

            vm.name = name;
            vm.address = number;
            vm.number = number;
            vm.email = email;
            $location.path("/orderOnline");
            vm.clientSet = true;
        }
    }

    
});