myApp.controller('appCtrl', function($scope, $timeout, $location, $sce, httpClient, headerItemsJson, menuItemsJson, imageSrc, categories) {
    var vm = this;
    vm.obj = [""];
    vm.sub_cats = [];
    vm.gridParams = {};
    vm.scheduledGridParams = {};

    var endDate = moment(new Date()).format("YYYY-MM-DDT23:59:59+0000");    
    vm.gridParams["endDate"] = endDate;
    vm.scheduledGridParams["startDate"] = moment(new Date()).add(1, "day").format("YYYY-MM-DDT00:00:00+0000");
    
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
        params["assignee"] = vm.user.login;
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
                        vm.pushreservationNotification(data);
                        scope.api.hideOverlay();
                    },
                    function(err) {
                        console.log(err);
                        scope.api.hideOverlay();
                    });   
            }
        }

    }

    vm.pushreservationNotification = function(data){
        if(data.GCMKey){
            var url = 'https://android.googleapis.com/gcm/send';
            var params = {
                "to" : data.GCMKey,
                "data" : {
                    "m" : "Your reservation has been confirmed"
                },
            }
            var token = 'AIzaSyCE-ZDpyp1gDmpnSr78TVDZYiqvBGtVCnQ';
            httpClient
                .post(url, params, null, url, token).then(
                function(data, response){
                    console.log("success");
                    vm.showAlert("success", "A notification has been sent to the client that the reservation is confirmed.");
                },
                function(err) {
                    console.log(err);
                    vm.showAlert("danger", "An error has occurred");
                });    
        }
    }
    
    vm.confirmReservationButtonRenderer = function(params){
        if(params.value && params.value == "Confirmed"){
            return '<span class="processed-by">'+params.value+'</span>'
        }else{
            return '<button class="confirm-order">Confirm order</button>'
        }
    }
    
    
    vm.viewLocalOrder = function(params){
        return '<div><a target="_blank" href="/management/templates/viewLocalOrder.html?table='+params.data.tableId+'&assignee='+params.data.assignee+'&orderDate='+params.data.orderDate+'&key='+params.data.key+'&totalNewItems='+params.data.totalNewItems+'">view order</a></div>' 
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    



    httpClient
        .get('management/api/getDeliveryMotors', {}).then(
        function(data, response){
            data = data.documents;
            for(var i = 0; i < data.length; i++){
                vm.obj.push(data[i].name+"-"+data[i].deviceId);
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
    vm.user = {login: atob($.cookie('device_token').replace("==","")).split(":")[1]};
    vm.menuItems = menuItemsJson;
    vm.items = [];
    vm.mapsSrc = $sce.trustAsResourceUrl('/management/templates/location.html?deviceId='+vm.deliveryDevice);

    /* ****************************   ORDERS *************** */
    vm.showOnlyData = [
        {
            id: "today",
            label: "Today's orders"  
        },
        {
            id: "all",
            label: "Show All Orders"
        },
        {
            id: "notConfirmed",
            label: "Not Confimed"
        },
        {
            id: "Confirmed",
            label: "Confirmed"
        },
        /*
        {
            id: "notDelivered",
            label: "Not delivered"
        },
        */
        {
            id: "Delivered",
            label: "Delivered"
        }
    ]

    vm.onSelectShowOnly = function(obj){
        if(obj.originalObject.id != "today"){
            vm.gridParams["queryFilter"] = obj.originalObject.id
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
            return '<span class="ag-cell-inner" tooltip-placement="top" uib-tooltip="'+ params.value +'">'+params.value+'</span>'
        }else{
            return ''
        }
    }

    vm.onSelectionChanged = function(scope, selectedRow){

        if(scope.api.getFocusedCell().column.colDef.headerName == "Assignee"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            if(selectedRow.data && !selectedRow.data.assignee && selectedRow.data.cancelled == "No"){
                var params = {};
                params["action"] = "edit";
                params["row"] = selectedRow.data;
                params["row"]["assignee"] = vm.user.login;
                params["row"]["orderStatus"] = "Assigned";
                delete params["creationDate"];
                scope.api.showLoadingOverlay();
                httpClient
                    .post('management/api/getOrders', params).then(
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
                var params = {};
                params["row"] = selectedRow.data;
                params["action"] = "edit";
                params["row"]["orderStatus"] = "Delivered";
                params["row"]["delivered"] = "Delivered";
                delete params["creationDate"];
                scope.api.showLoadingOverlay();
                httpClient
                    .post('management/api/getOrders', params).then(
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

    vm.uploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            data.data["formType"] = "item";
            if(params.data.key){
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
            }else{
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
            }
        }     
    }
    vm.categoriesUploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            data.data["formType"] = "categories";
            if(params.data.key){
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
            }else{
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
            }
        }     
    }
    vm.galleryUploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            data.data["formType"] = "menu";
            if(params.data.key){
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
            }else{
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
            }
        }     
    }
    vm.viewImageCellRenderer  = function(params){
         if(params.data)
        {
            var key = params.data.key;
            var img = (params.data.image) ? params.data.image : ""; 
            return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'
    
        }
        }

    vm.publishItemCellRenderer = function(params){
        if(params.value && params.data.name && params.data.subCategory && params.data.price)
        {
            if(params.value == "Published")
            {
                return '<span class="unpublish">Unpublish</span>'
            }
            else if(params.value == "Unpublished")
            {
                return '<button class="confirm-order">Publish</button>'
            }
            
        }
    	else
        {
            return '<button class="confirm-order disabled" tooltip-placement="auto" uib-tooltip="Please fill in required field to publish">Publish</button>'
        }
    }
    
    vm.publishGalleryCellRenderer = function(params){
        if(params.value && params.data.menu && params.data.categoryType && params.data.image)
        {
            if(params.value == "Published")
            {
                return '<span class="unpublish">Unpublish</span>'
            }
            else if(params.value == "Unpublished")
            {
                return '<button class="confirm-order">Publish</button>'
            }
            
        }
    	else
        {
            return '<button class="confirm-order disabled" tooltip-placement="auto" uib-tooltip="Please fill in required field to publish">Publish</button>'
        }
    }
    
    vm.publishCategoryCellRenderer = function(params){
        if(params.data.category && params.data.subCategory)
        {
            if(params.value == "Published")
            {
                return '<span class="unpublish">Unpublish</span>'
            }
            else if(params.value == "Unpublished")
            {
                return '<button class="confirm-order">Publish</button>'
            }
            
        }
    	else
        {
            return '<button class="confirm-order disabled" tooltip-placement="auto" uib-tooltip="Please fill in required field to publish">Publish</button>'
        }
    }


    vm.outOfStockItemCellRenderer =  function(params){
        if(params.value)
        {
            if(params.value && params.value == "true"){
                return '<span class="unpublish">Available</span>'
            }else if(params.value && params.value == "false"){
                return '<button class="confirm-order">Out of stock</button>'
            }else{
                return '<button class="confirm-order disabled">Out of stock</button>'
        }
        }
    }
    
     vm.showAsPromotionCellRenderer =  function(params){
        if(params.value)
            {
            if(params.value && params.value == "true"){
                return '<span class="unpublish">Yes</span>'
            }else if(params.value && params.value == "false"){
                return '<button class="confirm-order">No</button>'
            }else{
                return '<button class="confirm-order">No</button>'
            }
        }
        else
        {
          return '<button class="confirm-order">No</button>'  
        }
    }
    
    vm.manageCategoriesSelectionChanged  = function(scope){
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Category"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            if(!selectedRow.data.category && !selectedRow.data.subCategory)
        	{
                return;
            }
            var params = {};
            params["row"] = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["row"]["publish"] = action;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .post('management/api/getCategories', params).then(
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
            if(!selectedRow.data.menu || !selectedRow.data.categoryType || !selectedRow.data.image)
        	{
                return;
            }
            var params = {};
            params["row"] = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["row"]["publish"] = action;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .post('management/api/getMenu', params).then(
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
            if(!selectedRow.data.name || !selectedRow.data.subCategory || !selectedRow.data.price)
        	{
                return;
            }
            var params = {};
            params["row"] = selectedRow.data
            params["action"] = "edit";
            var action = (selectedRow.data.publish == "Published") ? "Unpublished" : "Published"; 
            params["row"]["publish"] = action;
        //    params["rows"]["category"] = items[selectedRow.data.subCategory];
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .post('management/api/getItems', params).then(
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
            var params = {};
            params["row"] = selectedRow.data;
            params["action"] = "edit";
            var outOfStock = (selectedRow.data.outOfStock == "true") ? "false" : "true"; 
            params["row"]["outOfStock"] = outOfStock;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .post('management/api/getItems', params).then(
                function(data, response){
                    console.log("success");
                    scope.api.hideOverlay();
                },
                function(err) {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }else if(scope.api.getFocusedCell().column.colDef.headerName == "Show as Promotion"){
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = {};
            params["row"] = selectedRow.data
            params["action"] = "edit";
            var promotion = (selectedRow.data.promotion == "true") ? "false" : "true"; 
            params["row"]["promotion"] = promotion;
            delete params["creationDate"];
            scope.api.showLoadingOverlay();
            httpClient
                .post('management/api/getItems', params).then(
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
        if(typeof data == 'string')
        {
			vm.deliveryDevice = data;
        }
        else
        {
			vm.deliveryDevice = data.originalObject.deviceId;
        }
        $('#myModal').modal('hide');
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
        vm.deliveryOrderDate = moment(date).format('YYYY-MM-DDTHH:mm:ss+0000');
    }
    
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

    vm.manageItemsColDef = [
        {headerName: "Name", field: "name"},
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
        {headerName: "Description", field: "description", cellEditor: 'agLargeTextCellEditor'},
        {headerName: "Price", field: "price"},
        {headerName: "Price Offer", field: "priceOffer"},
        {headerName: "Unit", field: "unit"},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image (200 x 200)", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "Barcode ID", field: "barcodeID", hide: "true"},
        {headerName: "Barcode image", field: "barcode", hide: "true", editable : false, cellRenderer: function (params) {  
            return vm.viewBarcodeCellRenderer(params);
        }},
        {headerName: "Publish Item", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishItemCellRenderer(params);
        }},
      //  {headerName: "Out Of Stock", field: "outOfStock", editable : false, cellRenderer: function (params) {  
      //      return vm.outOfStockItemCellRenderer(params);
      //  }},
        {headerName: "Show as Promotion", field: "promotion", editable : false, cellRenderer: function (params) {  
            return vm.showAsPromotionCellRenderer(params);
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
    
    vm.manageCategoriesColDef = [
        {headerName: "Category Name", field: "category", cellEditor: "select",
         cellEditorParams: {
             values: vm.cats
         }},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Sub Category Name", field: "subCategory"},
        /*
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.categoriesUploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        */
        {headerName: "Publish Category", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishCategoryCellRenderer(params);
        }}
        ];
    
      vm.manageMenuColDef = [
        {headerName: "Menu Name", field: "menu"},
        {headerName: "Category Type", field: "categoryType", cellEditor: "select", editable : true,
         cellEditorParams: {  
             values : ["Food", "Drinks", "Fruits", "Veggies", "Others"]
        }},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.galleryUploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "Publish Menu", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishGalleryCellRenderer(params);
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
        */]

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
        params["orderedDate"] = moment(new Date).format('YYYY-MM-DDTHH:mm:ss+0000');
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