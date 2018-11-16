myApp.controller('servedTablesCtl', function($scope)
{    
    var vm = this;
    
    vm.servedTablesStartDateOnSetTime = function(date)
    {
        vm.servedTablesStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.servedTablesStartDate != null && vm.servedTablesEndDate != null)
        {
            var params = {startDate : vm.servedTablesStartDate, endDate : vm.servedTablesEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    
    vm.servedTablesEndDateOnSetTime = function(date)
    {
        vm.servedTablesEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.servedTablesStartDate != null && vm.servedTablesEndDate != null)
        {
            var params = {startDate : vm.servedTablesStartDate, endDate : vm.servedTablesEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    
    vm.servedTablesColDef = [
        {headerName: "Table", field: "tableId"},
        {headerName: "Total (€)", field: "total"},
        {headerName: "Order Date", field: "orderDate"},
        {headerName: "Ordered By", field: "assignee"},
        {headerName: "View Order", editable : false, cellRenderer: function (params) {  
            return vm.viewOccupiedTableOrders(params);
        }}
    ];
    
    vm.viewOccupiedTableOrders = function(params)
    {
        return '<div><a target="_blank" href="/management/templates/viewServedTableOrders.html?table='+params.data.tableId+'&assignee='+params.data.assignee+'&orderDate='+params.data.orderDate+'&key='+params.data.key+'&total='+params.data.total+'">view order</a></div>' 
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
    

    
});