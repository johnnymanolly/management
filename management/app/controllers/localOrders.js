myApp.controller('localOrdersCtl', function($scope)
{    
    var vm = this;
    
    vm.localOrdersColDef = [
        {headerName: "Table", field: "tableId"},
        {headerName: "Total Order Amount (€)", field: "totalNewItems"},
        {headerName: "Order Date", field: "orderDate"},
        {headerName: "Ordered By", field: "assignee"},
        {headerName: "View Order", editable : false, cellRenderer: function (params) {  
            return vm.viewLocalOrder(params);
        }}
    ];
    
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
    
    vm.localOrdersStartDateOnSetTime = function(date)
    {
        vm.localOrdersStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.localOrdersStartDate != null && vm.localOrdersEndDate != null)
        {
            var params = {startDate : vm.localOrdersStartDate, endDate : vm.localOrdersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    
    vm.localOrdersEndDateOnSetTime = function(date)
    {
        vm.localOrdersEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.localOrdersStartDate != null && vm.localOrdersEndDate != null)
        {
            var params = {startDate : vm.localOrdersStartDate, endDate : vm.localOrdersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    
    vm.viewLocalOrder = function(params)
    {
        return '<div><a target="_blank" href="/management/templates/viewLocalOrder.html?table='+params.data.tableId+'&assignee='+params.data.assignee+'&orderDate='+params.data.orderDate+'&key='+params.data.key+'&totalNewItems='+params.data.totalNewItems+'">view order</a></div>' 
    }

    
});