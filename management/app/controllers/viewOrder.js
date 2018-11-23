myApp.controller('viewOrderCtl', function($scope, $routeParams, $timeout, httpClient) {
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
        {headerName: "Category", field: "subCategory"},
        {headerName: "Quantity", field: "quantity"},
        {headerName: "Client Notes", field: "comments"},                      
        {headerName: "Price (€)", field: "price"},
        {headerName: "View image",  field: "image", cellRenderer: function (params) {  
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

    vm.rejectOrder = function(){
        var params = {};
        params["key"] = $routeParams.key;
        params["action"] = "edit";
        params["orderStatus"] = "Rejected";
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

});