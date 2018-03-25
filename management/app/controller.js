
myApp.controller('appCtrl', function($scope, $timeout, $location, $sce, httpClient, headerItemsJson, menuItemsJson, imageSrc, categories) {
    var vm = this;
    vm.obj = [""];
    vm.sub_cats = [];
    vm.gridParams = {};
    vm.scheduledGridParams = {};

    var endDate = moment(new Date()).format("YYYY-MM-DDT23:59:59+0000");    
    vm.gridParams["endDate"] = endDate;
    vm.scheduledGridParams["startDate"] = moment(new Date()).add(1, "day").format("YYYY-MM-DDT00:00:00+0000");

    httpClient
        .get('management/api/getDeliveryMotors', {}).then(
        function(data, response){
            data = data.documents;
            for(var i = 0; i < data.length; i++){
                vm.obj.push(data[i].name);
            }
            console.log("success");
        },
        function(err) {
            console.log(err);
        });   
    
     var items = {};
     httpClient
        .get('management/api/getCategories', {}).then(
        function(data, response){
            data = data.documents;
            for(var i = 0; i < data.length; i++){
                vm.sub_cats.push(data[i].subCategory);
                items[data[i].subCategory] = {};
                items[data[i].subCategory] = (data[i].category);
                
            }
            console.log("success");
        },
        function(err) {
            console.log(err);
        });  
    
    
     vm.cats = [];
     httpClient
        .get('management/api/getMenu', {}).then(
        function(data, response){
            data = data.documents;
            for(var i = 0; i < data.length; i++){
                vm.cats.push(data[i].menu);                
            }
            console.log("success");
        },
        function(err) {
            console.log(err);
        });


    vm.headerItems = headerItemsJson;
    vm.imageSrc = imageSrc;
    vm.user = {login: (atob(document.cookie.split("=")[1]).split(":")[1])};
    vm.menuItems = menuItemsJson;
    vm.items = [];
    vm.mapsSrc = $sce.trustAsResourceUrl('/management/templates/location.html?deviceId='+vm.deliveryDevice);

    /* ****************************   ORDERS *************** */
    vm.showOnlyData = [
        {
            id: "all",
            label: "All"  
        },
        {
            id: "unassigned",
            label: "Unassigned"
        },
        {
            id: "confirmed",
            label: "Confirmed"
        },
        {
            id: "notDelivered",
            label: "Not delivered"
        },
        {
            id: "delivered",
            label: "Delivered"
        }
    ]

    vm.onSelectShowOnly = function(obj){
        if(obj.originalObject.label != "All"){
            vm.gridParams["queryFilter"] = obj.originalObject.label
        }else{
            vm.gridParams["queryFilter"] = null
        }
        $scope.$broadcast('updateGridData', {params: vm.gridParams});
    }

    vm.ordersStartDateOnSetTime = function(date){
        vm.ordersStartDate = moment(date).format('YYYY-MM-DDTHH:mm:ss+0000');
        if(vm.ordersStartDate != null && vm.ordersEndDate != null){
            vm.gridParams["startDate"] = vm.ordersStartDate;
            vm.gridParams["endDate"] = vm.ordersEndDate;
            $scope.$broadcast('updateGridData', {params: vm.gridParams});
        }
    }
    vm.ordersEndDateOnSetTime = function(date){
        vm.ordersEndDate = moment(date).format('YYYY-MM-DDTHH:mm:ss+0000');
        if(vm.ordersStartDate != null && vm.ordersEndDate != null){
            vm.gridParams["startDate"] = vm.ordersStartDate;
            vm.gridParams["endDate"] = moment(vm.ordersEndDate).format("YYYY-MM-DDT23:59:59+0000");
            $scope.$broadcast('updateGridData', {params: vm.gridParams});
        }
    }

    vm.assignToMeButtonRenderer = function(params){
        if(params.data.cancelled == "Yes"){
            return '<button tooltip-placement="auto" uib-tooltip="This order is cancelled" class="confirm-order disabled">Assign to me</button>'
        }
        if(params.value){
            return '<span class="processed-by">'+params.value+'</span>'
        }else{
            return '<button class="confirm-order">Assign to me</button>'
        }
    }

    vm.markAsDelivered = function(params){
        if(params.value && params.value == "Delivered"){
            return '<span class="processed-by">'+params.value+'</span>'
        }else if(params.data && params.data.orderStatus && params.data.orderStatus == "Confirmed"){
            return '<button class="confirm-order">Mark as delivered</button>'
        }else{
            return '<button  tooltip-placement="auto" uib-tooltip="Order must be confirmed to mark as delivered" class="disabled fix-inline mrgt1">Mark as delivered</button>'
        } 
    }

    vm.statusRenderer = function(params){
        return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
    }

    vm.onDeliveryfilterSet = function(obj, scope){
        if(obj.originalObject.label != "All"){
            vm.gridParams["deliveryFilter"] = obj.originalObject.name
        }else{
             vm.gridParams["deliveryFilter"] = null;
        }
        $scope.$broadcast('updateGridData', {params: vm.gridParams});
    }

    vm.dateRenderer = function(params){
        if(params.value){
            var orderDate = params.value.replace("T", " ").replace("+0000", "");
            return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ orderDate +'">'+orderDate+'</span>'
        }else{
            return "";
        }
    }

    vm.defaultCellRenderer = function(params){
        if(params.value){
            return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
        }else{
            return ''
        }
    }

    vm.onSelectionChanged = function(scope, selectedRow){

        if(scope.api.getFocusedCell().column.colDef.headerName == "Assignee"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            if(selectedRow.data && !selectedRow.data.assignee && selectedRow.data.cancelled == "No"){
                var params = selectedRow.data
                params["action"] = "edit";
                params["assignee"] = vm.user.login;
                params["orderStatus"] = "Assigned";
                delete params["creationDate"];
                scope.api.showLoadingOverlay();
                httpClient
                    .get('management/api/getOrders', params).then(
                    function(data, response){
                        console.log("success");
                        scope.api.hideOverlay();
                    },
                    function(err) {
                        //      vm.showAlert("success", "The order has been sent.");
                        console.log(err);
                        scope.api.hideOverlay();
                    });   
            }
        }else if(scope.api.getFocusedCell().column.colDef.headerName == "View Location"){
            $location.url("/maps");
        }else if(scope.api.getFocusedCell().column.colDef.headerName == "Mark as delivered"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            if(selectedRow.data && selectedRow.data.delivered != "Delivered" && selectedRow.data.orderStatus == "Confirmed"){
                var params = selectedRow.data
                params["action"] = "edit";
                params["orderStatus"] = "Delivered";
                params["delivered"] = "Delivered";
                delete params["creationDate"];
                scope.api.showLoadingOverlay();
                httpClient
                    .get('management/api/getOrders', params).then(
                    function(data, response){
                        console.log("success");
                        scope.api.hideOverlay();
                    },
                    function(err) {
                        console.log(err);
                        scope.api.hideOverlay();
                    });   
            }
        }

    }

    vm.viewOrder  = function(params){
        if(params.data && params.data.assignee){
            return '<div><a target="_blank" href="/management/templates/viewOnlineOrder.html?number='+params.data.number+'&name='+params.data.fullName+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.orderDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&total='+params.data.total+'&deliveryDate='+params.data.deliveryDate+'&orderedBy='+params.data.orderedBy+'&onlineOrderSource=true">view order</a></div>' 
        }else{
            return '<button class="disabled fix-inline mrgt1" tooltip-placement="auto" uib-tooltip="Please assign to the order first">view order</button>'
        }

    }

    vm.viewScheduledOrder  = function(params){
        if(params.data && params.data.assignee){
            return '<div><a target="_blank" href="/management/templates/viewOnlineOrder.html?number='+params.data.number+'&name='+params.data.fullName+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.orderDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&total='+params.data.total+'&deliveryDate='+params.data.deliveryDate+'&orderedBy='+params.data.orderedBy+'&scheduled='+params.data.scheduled+'">view order</a></div>' 
        }else{
            return '<button class="disabled fix-inline" tooltip-placement="auto" uib-tooltip="Please assign to the order first">view order</button>'
        }

    }

    vm.viewLocation = function(params){
        if(params.value){
            return '<div><a target="_blank" href="/management/templates/location.html?number='+params.data.number+'&name='+params.data.name+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.creationDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&location='+params.data.location+'"">view location</a></div>' 
        }else{
            return '<button class="disabled fix-inline mrgt1" tooltip-placement="auto" uib-tooltip="Client did not provide his location">view location</button>' 
        }

    }

    /* ****************************  END ORDERS *************** */


    /* *********************  ITEMS ***************** */

    vm.uploadImageButtonRenderer = function(params){
        var data = {data : params.data};
        if(params.data.key){
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
        }else{
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
        }

    }
    vm.viewImageCellRenderer  = function(params){
        var key = params.data.key;
        var img = (params.data.image) ? params.data.image : ""; 
        return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'
    }

    vm.publishItemCellRenderer = function(params){
        if(params.value && params.value == "Published"){
            return '<span class="unpublish">Unpublish</span>'
        }else if(params.value && params.value == "Unpublished"){
            return '<button class="confirm-order">Publish</button>'
        }else{
            return '<button class="confirm-order disabled">Publish</button>'
        }
    }

    vm.outOfStockItemCellRenderer =  function(params){
        if(params.value && params.value == "true"){
            return '<span class="unpublish">Available</span>'
        }else if(params.value && params.value == "false"){
            return '<button class="confirm-order">Out of stock</button>'
        }else{
            return '<button class="confirm-order disabled">Out of stock</button>'
        }
    }
    
    vm.manageCategoriesSelectionChanged  = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Category"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["publish"] = action;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .get('management/api/getCategories', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }
    
     vm.manageMenuSelectionChanged  = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Menu"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["publish"] = action;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .get('management/api/getMenu', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }


    vm.manageItemsSelectionChanged = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Item"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["publish"] = action;
            params["category"] = items[selectedRow.data.subCategory];
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .get('management/api/getItems', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }else if(scope.api.getFocusedCell().column.colDef.headerName == "Out Of Stock"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var outOfStock = (selectedRow.data.outOfStock == "true") ? "false" : "true"; 
            params["outOfStock"] = outOfStock;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .get('management/api/getItems', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }

    vm.viewBarcodeCellRenderer  = function(params){
        var key = params.data.key;
        var img = params.data.barcode; 
        return ''
    }        

    /* ******************** END ITEMS *********** */

    vm.init = function() {
        wsClient.onReady.then(function() {});
        vm.sources = mapConstants.sources;
        vm.icons = mapConstants.infoWindows.icons
    }

    vm.onSelectItem = function(selected){
        $scope.$broadcast('mapFoucsOnMarker', selected.originalObject.id);
    }

    vm.onSelectAsset = function(data){
        $scope.$broadcast('angucomplete-alt:changeInput', "locationList", data.details.name.value);
    }  

    vm.onMapFormatData = function(data){
        $scope.$broadcast('updateListData', data);
        return data
    } 

    vm.onDeliveryData = function(data){
        return data.documents;
    }
    
    vm.onDeliveryFilterData = function(data){
        var obj = {
           name: "All",
           label: "All"
        };
        data = data.documents;
        data.push(obj);
        return data
    }

    vm.focusOnAsset = function() {
        $scope.$broadcast('mapFoucsOnMarker', "all");
    }

    vm.onDeliveryDeviceSet = function(data, scope){
        vm.deliveryDevice = data.originalObject.deviceId;
        vm.mapsSrc = $sce.trustAsResourceUrl('/management/templates/location.html?deviceId='+vm.deliveryDevice);
    }

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


    vm.mapStartDateOnSetTime = function(date){
        vm.mapStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.mapStartDate != null && vm.mapEndDate != null){
            var params = {startDate : vm.mapStartDate, endDate : vm.mapEndDate};
            $scope.$broadcast('updateMapData', params);
        }
    }
    vm.mapEndDateOnSetTime = function(date){
        vm.mapEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.mapStartDate != null && vm.mapEndDate != null){
            var params = {startDate : vm.mapStartDate, endDate : vm.mapEndDate};
            $scope.$broadcast('updateMapData',  params);
        }
    }

    vm.promotionViewImageCellRenderer = function(params){
        var key = params.data.key;
        var img = (params.data.image) ? params.data.image : ""; 
        return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'
    }  

    vm.promotionUploadImageButtonRenderer = function(params){
        var data = {data : params.data};
        if(params.data.key){
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImagePromotion?upload=image" data="data" on-upload="$ctrl.onUpload(data)" on-success="$ctrl.onSuccess(res)">Upload</div>'
        }else{
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
        }
    }

    vm.promotionPublishItemCellRenderer = function(params){
        if(params.value && params.value == "Published"){
            return '<span class="unpublish">Unpublish</span>'
        }else if(params.value && params.value == "Unpublished"){
            return '<button class="confirm-order">Publish</button>'
        }else{
            return '<button class="confirm-order disabled">Publish</button>'
        }
    }

    vm.promotionOnCellClicked = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Promotion"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["publish"] = action;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .get('management/api/getPromotions', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                    if(data.notification){
                        vm.sendPromotionNotification(data);
                    }
                    scope.api.refreshInfiniteCache();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }

    vm.sendPromotionNotification = function(data){
        if(data.notification){
            var url = 'https://android.googleapis.com/gcm/send';
            var params = {
                "registration_ids" : data.keys,
                "data" : {
                    "m" : data.notification
                },
            }
            var token = 'AIzaSyCE-ZDpyp1gDmpnSr78TVDZYiqvBGtVCnQ';
            httpClient
                .post(url, params, null, url, token).then(
                function(data, response){
                    console.log("success");
                    vm.showAlert("success", "A notification has been sent to all clients about this promotion.");
                },
                function(err) {
                    console.log(err);
                    vm.showAlert("danger", "An error has occurred");
                });    
        }
    }

    vm.order = function(params){
        if(params.data.name){
            return '<div><a href="#/order">Order</a></div>' 
        }else{
            return '<div target="_blank" ng-click="$ctrl.stopEditing()">Order</div>'
        }
    }

    vm.onClientCellClicked = function(event, scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Order"){
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

    vm.onDeliveryOrderSetTime = function(date){
        vm.deliveryOrderDate = moment(date).format('YYYY-MM-DDTHH:mm:ss+0000');;
    }

    vm.manageItemsColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Brand", field: "brand", hide: true},
        {headerName: "Category", field: "category", cellEditor: "select", hide: true,
         cellEditorParams: {
             values: categories
         }},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Sub Category", field: "subCategory", cellEditor: "select",
         cellEditorParams: {
             values: vm.sub_cats
         }},
        {headerName: "Brand", field: "brand"},
        {headerName: "Description", field: "description"},
        {headerName: "Price", field: "price"},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image (200 x 200)", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "File", field: "file", hide: true, cellRenderer: function (params) {  
            return vm.getFile(params);
        }},
        {headerName: "Barcode ID", field: "barcodeID", hide: "true"},
        {headerName: "Barcode image", field: "barcode", hide: "true", editable : false, cellRenderer: function (params) {  
            return vm.viewBarcodeCellRenderer(params);
        }},
        {headerName: "Publish Item", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishItemCellRenderer(params);
        }},
        {headerName: "Out Of Stock", field: "outOfStock", editable : false, cellRenderer: function (params) {  
            return vm.outOfStockItemCellRenderer(params);
        }}];
    
    vm.manageCategoriesColDef = [
        {headerName: "Category Name", field: "category", cellEditor: "select",
         cellEditorParams: {
             values: vm.cats
         }},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Sub Category Name", field: "subCategory"},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "Publish Category", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishItemCellRenderer(params);
        }}
        ];
    
      vm.manageMenuColDef = [
        {headerName: "Menu Name", field: "menu"},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }}
        ];


    vm.addClientColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Number", field: "number"},
        {headerName: "Primary Address", field: "address"},
        {headerName: "Secondary Address", field: "secondaryAddress"},
        {headerName: "Order", editable : false, cellRenderer: function (params) {  
            return vm.order(params);
        }}
    ];

    vm.onlineOrdersColDef = [
        {headerName: "Name", field: "fullName", editable : false, cellStyle: function(params) {
            if (params.data.client=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": 'red', "font-weight": 'bold'};
            }
        }},
        {headerName: "Address", field: "address", editable : false, hide: false},
        {headerName: "Maps", field: "location", editable : false, cellRenderer: function (params) {  
            return vm.viewLocation(params);
        }},
        {headerName: "Number", field: "number", editable : false,},
        {headerName: "Total", field: "total", hide: true},
        {headerName: "Ordered By", field: "orderedBy", hide: true},
        {headerName: "Client", field: "client",  hide: true, cellStyle: function(params) {
            if (params.value=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": 'red', "font-weight": 'bold'};
            }
        }},

        {headerName: "Order date", field: "orderDate", editable : false, hide: true, cellRenderer: function (params) {  
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
        {headerName: "Delivery man", field: "deliveredBy", cellEditor: "select", editable : true,
         cellEditorParams: {  
             values : vm.obj
         }},
        {headerName: "Mark as delivered", field: "delivered", editable : false, cellRenderer: function (params) {  
            return vm.markAsDelivered(params);
        }}]

    vm.getdeliveryDevices = function(){
        return {values : ["johnny"]}
    }

    vm.scheduledOrdersColDef = [
        {headerName: "Name", field: "fullName", cellStyle: function(params) {
            if (params.data.client=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": 'red', "font-weight": 'bold'};
            }
        }},
        {headerName: "Address", field: "address", hide: false},
        {headerName: "Maps", field: "location", editable : false, cellRenderer: function (params) {  
            return vm.viewLocation(params);
        }},
        {headerName: "Number", field: "number"},
        {headerName: "Total", field: "total", hide: true},
        {headerName: "Ordered By", field: "orderedBy", hide: true},
        {headerName: "Client", field: "client",  hide: true, cellStyle: function(params) {
            if (params.value=='Previous Client') {
                return {"color" : 'green', "font-weight": 'bold'};
            } else {
                return {"color": 'red', "font-weight": 'bold'};
            }
        }},

        {headerName: "Order date", field: "orderDate", editable : false, cellRenderer: function (params) {  
            return vm.dateRenderer(params);
        }}, 

        {headerName: "Delivery Date", field: "deliveryDate", editable : false, cellRenderer: function (params) {  
            if(params.value){
                return vm.dateRenderer(params);
            }
        }},
        {headerName: "Cancelled", field: "cancelled", editable : false, hide: true},
        {headerName: "Scheduled", field: "scheduled", editable : false, hide: true},   
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
            return vm.viewScheduledOrder(params);
        }}]

    vm.promotionColDef = [
        {headerName: "Name", field: "name"},
        //  {headerName: "Brand", field: "brand"},
        //    {headerName: "Category", field: "category"},
        {headerName: "Description", field: "description"},
        {headerName: "Price (€)", field: "price"},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.promotionUploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image",editable : false, cellRenderer: function (params) {  
            return vm.promotionViewImageCellRenderer(params);
        }},
        {headerName: "Notification Message", field: "notification"},
        {headerName: "Publish Promotion", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.promotionPublishItemCellRenderer(params);
        }}];


    /* ************************** Order Online *********************/
    vm.orderListCallback = function(data){
        var items = [];
        for(var i = 0; i < data.length; i++){
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
            item["pic"] = vm.imageSrc.orderImg;
            items.push(item);
        }
        return items;
    }

    vm.orderListClientsCallback = function(data){
        var items = [];
        if(data.users){
            var users = data.users;
            for(var i = 0; i < users.length; i++){
                var item = {};
                items["id"] = i;
                item["name"] = users[i].name[0];
                item["number"] = users[i].id[0];
                item["address"] = (users[i].address) ? users[i].address[0] : "";
                item["email"] = users[i].email[0];
                item["pic"] = vm.imageSrc.userImg;
                items.push(item);
            }
        }
        if(data.clients){
            var clients = data.clients;
            for(var i = 0; i < clients.length; i++){
                var item = {};
                items["id"] = i;
                item["name"] = clients[i].name;
                item["number"] = clients[i].number;
                item["address"] = clients[i].address;
                item["email"] = clients[i].email;
                item["pic"] = vm.imageSrc.userImg;
                items.push(item);
            }
        }
        if(vm.clientSet){
            $scope.$broadcast('angucomplete-alt:changeInput', "clientsList", vm.name);
        }
        return items;
    }

    vm.onClientSelect = function(data, scope){
        vm.clientSet = true;
        vm.name = data.originalObject.name;
        vm.address = data.originalObject.address;
        vm.number = data.originalObject.number;
        vm.email = data.originalObject.email;
    }

    vm.onSelect = function(item, scope){
        console.log("test")

    }

    vm.sendOnlineOrder = function(items, self){
        var objects = JSON.parse(JSON.stringify(items));
        for(var i = 0; i < objects.length; i++){
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
        params["orderDate"] = moment(new Date).format('YYYY-MM-DDTHH:mm:ss+0000');
        params["deliveryDate"] = vm.deliveryOrderDate || params["orderDate"];
        vm.showLoading = true;
        httpClient
            .get('management/api/publishOrderFromDashboard', params).then(
            function(data, response){
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
            function(err) {
                console.log(err);
                vm.showLoading = false;
            }); 
    }

    vm.closeAlert = function() {
        vm.show = false;
    };

    vm.showAlert = function(type, content) {
        vm.message = {
            "type" : type,
            "content" : content
        }
        vm.showError = true;
        $timeout(function(){
            vm.showError = false;
        }, 5000);
    }

});

myApp.controller('notificationCtrl', function($scope, httpClient) {
    var vm = this;
    vm.params = {} 

    httpClient
        .get("management/api/getNotificationsSettings", null)
        .then(
        function(data, response) {
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

});