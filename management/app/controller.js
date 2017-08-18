
myApp.controller('appCtrl', function($scope, $timeout, $location, httpClient, headerItemsJson, menuItemsJson, imageSrc) {
    var vm = this;
    vm.tables = [];
    var tablesCount = 24;

    vm.$onInit = function() {
        console.log("hello");

        for(var x = 1; x <= tablesCount; x++){
            var table = {};
            table["id"] = x;
            table["label"] = "Table " + x;
            table["imgSrc"] = imageSrc.table;
            vm.tables.push(table);
        }

    }

    vm.headerItems = headerItemsJson;
    vm.imageSrc = imageSrc;
    vm.user = vm.user = (atob(document.cookie.split("=")[1]).split(":")[1]);
    vm.menuItems = menuItemsJson;
    vm.items = [];

    vm.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: false,
        autoplaySpeed: 3000,
        method: {},
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
            }
        }
    }; 

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
            var params = {
                queryFilter : obj.originalObject.label
            } 
            }else{
                var params = {};
            }
        $scope.$broadcast('updateGridData', {params: params});
    }

    vm.ordersStartDateOnSetTime = function(date){
        vm.ordersStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.ordersStartDate != null && vm.ordersEndDate != null){
            var params = {startDate : vm.ordersStartDate, endDate : vm.ordersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    vm.ordersEndDateOnSetTime = function(date){
        vm.ordersEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.ordersStartDate != null && vm.ordersEndDate != null){
            var params = {startDate : vm.ordersStartDate, endDate : vm.ordersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }

    vm.localOrdersStartDateOnSetTime = function(date){
        vm.localOrdersStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.localOrdersStartDate != null && vm.localOrdersEndDate != null){
            var params = {startDate : vm.localOrdersStartDate, endDate : vm.localOrdersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    vm.localOrdersEndDateOnSetTime = function(date){
        vm.localOrdersEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.localOrdersStartDate != null && vm.localOrdersEndDate != null){
            var params = {startDate : vm.localOrdersStartDate, endDate : vm.localOrdersEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }

    vm.servedTablesStartDateOnSetTime = function(date){
        vm.servedTablesStartDate = moment(date).format('YYYY-MM-DD');
        if(vm.servedTablesStartDate != null && vm.servedTablesEndDate != null){
            var params = {startDate : vm.servedTablesStartDate, endDate : vm.servedTablesEndDate};
            $scope.$broadcast('updateGridData', {params: params});
        }
    }
    vm.servedTablesEndDateOnSetTime = function(date){
        vm.servedTablesEndDate = moment(date).format('YYYY-MM-DD');
        if(vm.servedTablesStartDate != null && vm.servedTablesEndDate != null){
            var params = {startDate : vm.servedTablesStartDate, endDate : vm.servedTablesEndDate};
            $scope.$broadcast('updateGridData', {params: params});
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
            return '<button  tooltip-placement="auto" uib-tooltip="Order must be confirmed to mark as delivered" class="disabled fix-inline">Mark as delivered</button>'
        } 
    }

    vm.statusRenderer = function(params){
        return '<span class="ag-cell-inner" tooltip-placement="auto" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
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
            if(selectedRow.data && !selectedRow.data.assignee && !selectedRow.data.cancelled == "Yes"){
                var params = selectedRow.data
                params["action"] = "edit";
                params["assignee"] = vm.user;
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
            return '<div><a target="_blank" href="/management/templates/viewOnlineOrder.html?number='+params.data.number+'&name='+params.data.fullName+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.orderDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&total='+params.data.total+'&deliveryDate='+params.data.deliveryDate+'&orderedBy='+params.data.orderedBy+'">view order</a></div>' 
        }else{
            return '<button class="disabled fix-inline" tooltip-placement="auto" uib-tooltip="Please assign to the order first">view order</button>'
        }

    }
    vm.viewLocation = function(params){
        if(params.value){
            return '<div><a target="_blank" href="/management/templates/location.html?number='+params.data.number+'&name='+params.data.name+'&assignee='+params.data.assignee+'&client='+params.data.client+'&orderDate='+params.data.creationDate+'&address='+params.data.address+'&key='+params.data.key+'&status='+params.data.orderStatus+'&location='+params.data.location+'"">view location</a></div>' 
        }else{
            return '<button class="disabled fix-inline" tooltip-placement="auto" uib-tooltip="Client did not provide his location">view location</button>' 
        }

    }

    vm.viewLocalOrder = function(params){
        return '<div><a target="_blank" href="/management/templates/viewLocalOrder.html?table='+params.data.tableId+'&assignee='+params.data.assignee+'&orderDate='+params.data.orderDate+'&key='+params.data.key+'&totalNewItems='+params.data.totalNewItems+'">view order</a></div>' 
    }

    vm.viewOccupiedTableOrders = function(params){
        return '<div><a target="_blank" href="/management/templates/viewServedTableOrders.html?table='+params.data.tableId+'&assignee='+params.data.assignee+'&orderDate='+params.data.orderDate+'&key='+params.data.key+'&total='+params.data.total+'">view order</a></div>' 
    }


    /* ****************************  END ORDERS *************** */


    /* *********************  ITEMS ***************** */

    vm.uploadImageButtonRenderer = function(params){
        var data = {data : params.data};
        if(params.data.key){
            return '<div class="btn-edited btn btn-primary btn-upload" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
        }else{
            return '<div class="btn-edited btn btn-primary btn-upload" ng-click="$ctrl.onImageUpload()">Upload</div>'
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

    vm.manageItemsSelectionChanged = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Item"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["publish"] = action;
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

    vm.listCallback = function(data){
        vm.tripsData = [
            {
                "id" : "all",
                "name": "all",
                "number": "all",
                "label" : "All"
            }
        ];
        var assets = data;
        for (var key in assets) {
            if (assets.hasOwnProperty(key)) {
                console.log(key, assets[key]);
                vm.pushAssets(key, assets[key])
            }
        }
        return vm.tripsData;
    }
    vm.pushAssets = function(assetId, trips) {

        var assetSource = trips.source;
        var key = assetSource + "_" + assetId;
        var number = trips["0"][0].number.value;
        var name = trips["0"][0].name.value;
        var img = trips["0"][0].img.value;

        var assetModel = null;
        var assetMake = null;

        //Asset Trips
        var tripsOrder = trips.order;

        // Loop on asset trips
        for (var t = tripsOrder.length - 1; t >= 0; t--) {
            var tripKey = tripsOrder[t];
            if (trips.hasOwnProperty(tripKey)) {
                var trip = trips[tripKey];

                // Loop on trips points
                for (var i = trip.length - 1; i >= 0; i--) {
                    var tripPoint = trip[i];

                    var tripMarker = {};

                    tripMarker.tripKey = tripKey;

                    tripMarker.details = tripPoint;

                    assetModel = (tripMarker.details && tripMarker.details.model) ? tripMarker.details.model.value : "";
                    assetMake = (tripMarker.details && tripMarker.details.make) ? tripMarker.details.make.value : "";
                    tripMarker.label = vm.buildAssetLabel(assetMake, assetModel, assetId);


                } //End looping on asset's trip's points
            }// End check for Availble tripKey in trips
        }//End looping on asset's trips
        vm.addAssetToSourceList(assetSource, assetId, key, tripMarker.label, number, name, img);
    };

    vm.addAssetToSourceList = function(assetSource, assetId, assetKey, label, number, name, img) {

        vm.tripsData.push({
            "name" : name,
            "number" : number,
            "id" : assetKey,
            "img": img,
            "label" : label
        });

    };
    vm.buildAssetLabel = function(make, model, assetId) {
        var assetLabel = (make) ? (make + " ") : "";
        assetLabel += (model) ? (model + "-") : "";
        assetLabel += assetId;
        return assetLabel;
    }

    vm.showAssetDashboard = function(id) {
        alert(id)
    }

    vm.focusOnAsset = function() {
        $scope.$broadcast('mapFoucsOnMarker', "all");
    }

    vm.onMenuItemClick = function(item){
        if(item.label == "Order Locally"){
            vm.updatetables();
        } 
        if(item.label == "Order Online"){
            vm.clientSet = false;
        }
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

    vm.confirmReservationSelectionChanged = function(scope, selectedRow){

        if(scope.api.getFocusedCell().column.colDef.headerName == "Confirm Reservation"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            if(selectedRow.data && selectedRow.data.confirmed != "Confirmed"){
              //  var self = vm;
                var params = selectedRow.data;
                params["action"] = "edit";
                params["confirmed"] = "Confirmed";
                delete params["creationDate"];
                scope.api.showLoadingOverlay();
                httpClient
                    .get('management/api/getReservations', params).then(
                    function(data, response){
                        console.log("success");
                        vm.showAlert("success", "A notification has been sent to the client that the reservation is confirmed.");
                        scope.api.hideOverlay();
                    },
                    function(err) {
                        console.log(err);
                        scope.api.hideOverlay();
                    });   
            }
        }

    }

    vm.promotionUploadImageButtonRenderer = function(params){
        var data = {data : params.data};
        if(params.data.key){
            return '<div class="btn-edited btn btn-primary btn-upload" upload-button url="/management/api/uploadImagePromotion?upload=image" data="data" on-upload="$ctrl.onUpload(data)" on-success="$ctrl.onSuccess(res)">Upload</div>'
        }else{
            return '<div class="btn-edited btn btn-primary btn-upload" ng-click="$ctrl.stopEditing()">Upload</div>'
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

    vm.confirmReservationButtonRenderer = function(params){
        if(params.value && params.value == "Confirmed"){
            return '<span class="processed-by">'+params.value+'</span>'
        }else{
            return '<button class="confirm-order">Confirm order</button>'
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
                    scope.api.refreshInfiniteCache();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }

    vm.orderSourceRenderer = function(params){

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
            vm.$broadcast('angucomplete-alt:changeInput', "clientsList", event.data.name);
        }
    }

    vm.onDeliveryOrderSetTime = function(date){
        vm.deliveryOrderDate = date;
    }

    vm.manageItemsColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Brand", field: "brand", hide: true},
        {headerName: "Category", field: "category"},
        {headerName: "Description", field: "description"},
        {headerName: "Price", field: "price"},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
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
        }}];

    vm.reservationColDef = [
        {headerName: "Name", field: "fullName"},
        {headerName: "Number", field: "number"},
        {headerName: "Client", field: "client", hide: true},
        {headerName: "Reservation date", field: "reservationDate"},
        {headerName: "Reservation time", field: "reservationTime"},
        {headerName: "Persons", field: "numberOfPersons"},
        {headerName: "Comments", field: "comments"},
        {headerName: "Cancelled", field: "cancelled"},
        {headerName: "Confirm Reservation", field: "confirmed", editable : false, cellRenderer: function (params) {  
            return vm.confirmReservationButtonRenderer(params);
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

    vm.localOrdersColDef = [
        {headerName: "Table", field: "tableId"},
        {headerName: "Total Order Amount (€)", field: "totalNewItems"},
        {headerName: "Order Date", field: "orderDate"},
        {headerName: "Ordered By", field: "assignee"},
        {headerName: "View Order", editable : false, cellRenderer: function (params) {  
            return vm.viewLocalOrder(params);
        }}
    ];

    vm.servedTablesColDef = [
        {headerName: "Table", field: "tableId"},
        {headerName: "Total (€)", field: "total"},
        {headerName: "Order Date", field: "orderDate"},
        {headerName: "Ordered By", field: "assignee"},
        {headerName: "View Order", editable : false, cellRenderer: function (params) {  
            return vm.viewOccupiedTableOrders(params);
        }}
    ];

    vm.onlineOrdersColDef = [
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
                return '<span>' + params.value + '</span>'
            }else {
                 params.data.deliveryDate = "asap";
                 return '<span>' + params.data.deliveryDate + '</span>'
            }
        }},
        {headerName: "Cancelled", field: "cancelled", editable : false},
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
        {headerName: "Mark as delivered", field: "delivered", editable : false, cellRenderer: function (params) {  
            return vm.markAsDelivered(params);
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
        {headerName: "Publish Promotion", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.promotionPublishItemCellRenderer(params);
        }}];


    /* ************************** Order Online *********************/
    vm.orderListCallback = function(data){
        var items = [];
        for(var i = 0; i < data.length; i++){
            var item = {};
            item["id"] = i;
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
                item["address"] = users[i].address[0];
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

    }

    vm.onTableSelect = function(table){
        vm.tableSelected = true;
        vm.selectedTable = table.label;
        vm.selectedTableId = table.id;
        $location.url("/orderLocally");
        if(table.busy){
            vm.showLocalOrdersLoading = true; 
            var params = {tableId : table.id}  
            httpClient
                .get('management/api/getTableOrderById', params).then(
                function(data, response){
                    console.log("success");
                    var items = data;
                    for(var i = 0; i < items.length; i++){
                        items[i]["icon"] = "glyphicon glyphicon-glass";
                    }

                    vm.defaultSetOrders = items;
                    vm.showLocalOrdersLoading = false;
                },
                function(err) {
                    console.log(err);
                    vm.showLocalOrdersLoading = false;
                });  
        }else{
            vm.defaultSetOrders = [];
        }
    }

    vm.sendOnlineOrder = function(items, self){
        var objects = JSON.parse(JSON.stringify(items));
        for(var i = 0; i < objects.length; i++){
            delete objects[i]["pic"];
            delete objects[i]["icon"];
            delete objects[i]["id"];
        }
        var params = {};
        params["name"] = vm.name;
        params["number"] = vm.number;
        params["address"] = vm.address;
        params["orderedBy"] = vm.user;
        params["total"] = self.total;
        params["items"] = objects;
        params["deliveryDate"] = vm.deliveryOrderDate || "asap";
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
                vm.onDeliveryOrderSetTime = null;
                vm.showAlert("success", "The order has been sent.");
            },
            function(err) {
                console.log(err);
                vm.showLoading = false;
            }); 
    }

    vm.sendLocalOrder = function(items, self){
        var objects = JSON.parse(JSON.stringify(items));
        var newObjects = JSON.parse(JSON.stringify(self.newObjects));
        for(var i = 0; i < objects.length; i++){
            delete objects[i]["pic"];
            delete objects[i]["icon"];
            delete objects[i]["id"];
        }
        for(var i = 0; i < newObjects.length; i++){
            delete newObjects[i]["pic"];
            delete newObjects[i]["icon"];
            delete newObjects[i]["id"];
        }
        var params = {};
        params["tableId"] = vm.selectedTableId;
        params["assignee"] = vm.user;
        params["total"] = self.total;
        params["totalNewItems"] = self.totalNewObjects;
        params["items"] = objects;
        params["newItems"] = newObjects;
        vm.showLocalOrdersLoading = true;
        httpClient
            .get('management/api/publishLocalOrderFromDashboard', params).then(
            function(data, response){
                console.log("success");
                vm.showLocalOrdersLoading = false;
                self.objects = [];
                vm.showAlert("success", "The order has been sent.");
                $location.url("/listTables");
                vm.updatetables();
            },
            function(err) {
                console.log(err);
                vm.showLocalOrdersLoading = false;
            }); 
    }

    vm.onMarkAsPaid = function(){
        var params = {tableId: vm.selectedTableId, tableStatus: "paid"}
        vm.showLocalOrdersLoading = true;
        httpClient
            .get('management/api/getTableOrderById', params).then(
            function(data, response){
                console.log("success");
                vm.showLocalOrdersLoading = false;
                self.objects = [];
                $location.url("/listTables");
                vm.updatetables();
            },
            function(err) {
                console.log(err);
                vm.showLocalOrdersLoading = false;
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