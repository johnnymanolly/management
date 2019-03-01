myApp.controller('viewOrderCtl', function($scope, $routeParams, $timeout, $uibModal, httpClient) {
    var vm = this;

    var promise;

    if($routeParams.key)
    {
        vm.loading = true;
        vm.apiParams = {key : $routeParams.key}
    }

    vm.colDefs = [
        {headerName: "Item key", field: "key", hide: true},  
        {headerName: "Item Name", field: "name"},
        {headerName: "Category", field: "subCategory", hide: true},
        {headerName: "Quantity", field: "quantity"},
        {headerName: "Portion", field: "portion"},
        {headerName: "Ingredients", field: "ingredients"},
        {headerName: "Client Notes", field: "comments"},                      
        {headerName: "Price (€)", field: "price"},
        {headerName: "View image", hide: true, field: "image", cellRenderer: function (params) {  
            return vm.myImageCellRenderer(params);
        }},
        {headerName: "View Barcode", hide: "true", field: "barcode", cellRenderer: function (params) {  
            return vm.barCodeCellRenderer(params);
        }},
        {headerName: "Barcode ID", hide: "true", field: "barcodeID"}];

    vm.confirmOrder = function(){
        var params = {};
        params["key"] = $routeParams.key;
        params["action"] = "edit";
        params["orderStatus"] = "Confirmed";
        var self = vm;
        vm.showLoadingConfirmed = true;
        httpClient
            .get('management/api/confirmOrder', params).then(
            function(data, response){
                console.log("success");
                vm.showLoadingConfirmed = false;
                vm.orderStatus = "Confirmed";
                if(data && data.GCMKey){
                    //    vm.sendNotification(data.GCMKey);
                }
                //   window.print();
                self.showAlert("success", "A notification has been sent to " + vm.name + " that the order is confirmed.");
            },
            function(err) {
                console.log(err);
                vm.showLoadingConfirmed = false;
                self.showAlert("danger", "An error has occurred");
            });   
    }

    vm.rejectOrder = function(rejectionDetails){
        var params = {};
        params["key"] = $routeParams.key;
        params["action"] = "edit";
        params["orderStatus"] = "Rejected";
        params["rejectionDetails"] = JSON.stringify(rejectionDetails);

        var self = vm;
        vm.showLoadingRejected = true;
        httpClient
            .get('management/api/confirmOrder', params).then(
            function(data, response){
                console.log("success");
                vm.showLoadingRejected = false;
                vm.orderStatus = "Rejected";
                if(data && data.GCMKey){
                    //      vm.sendNotification(data.GCMKey);
                }
                //   window.print();
                self.showAlert("success", "A notification has been sent to " + vm.fullName + " that the order is rejected.");
            },
            function(err) {
                console.log(err);
                vm.showLoadingRejected = false;
                self.showAlert("danger", "An error has occurred");
            });   
    }

    vm.markAsDelivered = function(){
        var params = {};
        params["key"] = $routeParams.key;
        params["action"] = "edit";
        params["orderStatus"] = "Delivered";
        var self = vm;
        vm.showLoadingRejected = true;
        httpClient
            .get('management/api/confirmOrder', params).then(
            function(data, response){
                console.log("success");
                vm.showLoadingRejected = false;
                vm.orderStatus = "Delivered";
                if(data && data.GCMKey){
                    //      vm.sendNotification(data.GCMKey);
                }
                //   window.print();
                self.showAlert("success", "A notification has been sent to " + vm.fullName + " that the order is rejected.");
            },
            function(err) {
                console.log(err);
                vm.showLoadingRejected = false;
                self.showAlert("danger", "An error has occurred");
            });   
    }

    vm.sendNotification = function(GCMKey){
        var url = 'https://android.googleapis.com/gcm/send';
        var params = {
            "to" : GCMKey,
            "data" : {
                "m" : "Your order has been confimred"
            },
        }
        var token = 'AIzaSyCE-ZDpyp1gDmpnSr78TVDZYiqvBGtVCnQ';
        httpClient
            .post(url, params, null, url, token).then(
            function(data, response){
                console.log("success");
                vm.showLoading = false;
                window.print();
                self.showAlert("success", "A notification has been sent to " + vm.fullName + " that the order is confirmed.");
            },
            function(err) {
                console.log(err);
                vm.showLoading = false;
                self.showAlert("danger", "An error has occurred");
            });   
    }

    vm.myImageCellRenderer = function(params)
    {
        if(params.data)
        {
            var key = params.data.key;
            var img = params.data.image; 
            return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">View Image</a></div>'
        }

    };

    vm.print = function(){
        window.print();
    }

    vm.closeAlert = function() {
        vm.show = false;
    };

    vm.formatData = function(data){
        vm.loading = false;
        if(data.status == "success" && data.documents)
        {
            vm.products       = data.documents;
            vm.total_amount   = data.details.total;
            vm.total_items    = data.details.total_items;
            vm.orderType 	  = data.details.orderType;
            vm.payment_method = data.details.payment_method;
            vm.address        = data.details.address;
            vm.orderStatus    = data.details.orderStatus;
            vm.fullName       = data.details.fullName;
            vm.number         = data.details.number;
            vm.orderedDate    = data.details.deliveryDate.replace("T", " ").replace("+0000", "");
            vm.deliveryDate   = data.details.orderedDate.replace("T", " ").replace("+0000", "");
            vm.orderId        = data.details.orderId;
        }
        return data;
    }

    vm.showAlert = function(type, content) {
        vm.message = {
            "type" : type,
            "content" : content
        }
        vm.showError = true;
        $timeout(function(){
            vm.showError = false;
        }, 10000);
    }

    vm.open = function() {
        var modalInstance =  $uibModal.open({
            templateUrl: "templates/rejectModalContent.html",
            controller: "rejectModalContentCtrl as vm",
            size: '',
        });

        modalInstance.result.then(function(editedRows){
            vm.rejectOrder(editedRows);
        });

    }
    
    vm.openRejectedOrder = function() {
        var modalInstance =  $uibModal.open({
            templateUrl: "templates/ViewRejection.html",
            controller: "viewRejectionModalCtrl as vm",
            size: '',
        });

        modalInstance.result.then(function(rejectionDetails){
            vm.rejectOrder(rejectionDetails);
        });

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
myApp.controller('rejectModalContentCtrl', function($scope, $routeParams, $uibModalInstance) {
    
    var vm = this;   
    
    vm.scope = {};

    vm.apiParams = {key : $routeParams.key}

    vm.colDefs = [
        {headerName: "Item key", field: "key", hide: true},  
        {headerName: "Item Name", field: "name"},
        {headerName: "Category", field: "subCategory"},
        {headerName: "Image", field: "image", hide: true},
        {headerName: "Set Available Quantity", field: "quantity", cellRenderer: function (params) {  
            return vm.quantityCellRenderer(params);
        }},
        {headerName: "Comments", field: "rejection_comments", cellRenderer: function (params) {  
            return vm.commentsCellRenderer(params);
        }},
        {headerName: "Client Notes", field: "comments", hide: true},                      
        {headerName: "Price (€)", hide: true, field: "price"},
        {headerName: "Available", hide: true, field: "available", cellRenderer: function (params) {  
            return vm.availableCellRenderer(params);
        }}];
    
    vm.availableCellRenderer = function(params)
    {
        return '<input class="ag-cell-inner" type="checkbox"  />'
    }
    
    vm.quantityCellRenderer = function(params)
    {
        return '<input id="' + params.data.key + '" class="ag-cell-inner" name="' + params.data.name + '"  image="' + params.data.image + '" subCategory="' + params.data.subCategory + '"  comments="' + params.data.rejection_comments + '" min="0" max="' + params.value + '" style="width: 44px;padding-left: 3px;" type="number" value="' + params.value + '" />'
    }
    
    vm.commentsCellRenderer = function(params)
    {
        return '<input id="comments_' + params.data.key + '" class="ag-cell-inner" min="0" max="' + params.value + '" style="width: 90%;padding-left: 3px;" type="text" />'
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
    
    vm.formatData = function(data)
    {
        vm.defaultRows = data;
        return data;
    }

    $scope.ok = function()
    {
        
        var editedRows = [];
        
        $( "[type=number]" ).each(function( index ) {
            if(vm.defaultRows["documents"][index]["quantity"] != $( this ).val()){
                var row = {};
                row["key"] = $( this ).attr('id');
                row["name"] = $( this ).attr('name');
                row["image"] = $( this ).attr('image');
                row["subCategory"] = $( this ).attr('subCategory');
                row["quantity"] = vm.defaultRows["documents"][index]["quantity"];
                row["availableQuantity"] = $( this ).val();
                row["rejection_comments"] = $( '#comments_' + row["key"] ).val();
                editedRows.push(row);
            }
            

        });
        /*
        $( "[type=checkbox]" ).each(function( index ) {
            editedRows[index]["avaialble"] = $( this ).val();
        });
        */
        var rejectionDetails = {};
        if($scope.comments)
        {
            rejectionDetails["comments"] = $scope.comments;
        }
        
        rejectionDetails["editedRows"] = editedRows;
        
        $uibModalInstance.close(rejectionDetails);
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    } 

});

myApp.controller('viewRejectionModalCtrl', function($scope, $routeParams, $uibModalInstance) {
    
    var vm = this;   
    
    vm.scope = {};

    vm.apiParams = {key : $routeParams.key}

    vm.colDefs = [
        {headerName: "Item key", field: "key", hide: true},  
        {headerName: "Item Name", field: "name"},            
        {headerName: "Quantity", field: "quantity"},                   
        {headerName: "Available Quantity", field: "availableQuantity"},
        {headerName: "Comments", field: "rejection_comments"}
    ];
    
    vm.availableCellRenderer = function(params)
    {
        return '<input class="ag-cell-inner" type="checkbox"  />'
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
    
    vm.formatData = function(data)
    {
        var rejectionDetails = JSON.parse(data.details.rejectionDetails);
        if(rejectionDetails.comments)
        {
            $scope.comments = rejectionDetails.comments;
        }
        return {documents : rejectionDetails.editedRows};
    }

    $scope.ok = function()
    {
        $uibModalInstance.dismiss();
    }

});