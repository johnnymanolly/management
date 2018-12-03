myApp.controller('promotionCtl', function($scope, httpClient)
{    
    var vm = this;
    
    vm.promotionColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Category", field: "category", hide: false, editable : false},
        {headerName: "Sub Category", field: "subCategory"},
        {headerName: "Description", field: "description"},
        {headerName: "Price (€)", field: "price"},
        {headerName: "Price Offer", field: "priceOffer"},
        {headerName: "Upload Image", editable : false, hide: true, cellRenderer: function (params) {  
            return vm.promotionUploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image",editable : false, cellRenderer: function (params) {  
            return vm.promotionViewImageCellRenderer(params);
        }},
        {headerName: "Notification Message", field: "notification", hide: true},
        {headerName: "Publish Promotion", field: "publish", editable : false, hide: true, cellRenderer: function (params) {  
            return vm.promotionPublishItemCellRenderer(params);
        }}];
    
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
    
    vm.promotionUploadImageButtonRenderer = function(params)
    {
        var data = {data : params.data};
        if(params.data.key)
        {
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImagePromotion?upload=image" data="data" on-upload="$ctrl.onUpload(data)" on-success="$ctrl.onSuccess(res)">Upload</div>'
        }
        else
        {
            return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
        }
    }
    
    vm.promotionViewImageCellRenderer = function(params)
    {
        var key = params.data.key;
        var img = (params.data.image) ? params.data.image : ""; 
        return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'
    }
    
    vm.onPromotionFormatData = function(data)
    {
        return data;
    }
    
    vm.promotionOnCellClicked = function(scope)
    {
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Promotion")
        {
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
                    if(data.notification)
                    {
                        vm.sendPromotionNotification(data);
                    }
                    scope.api.refreshInfiniteCache();
                },
                function(err) 
                {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
    }
    
     vm.promotionPublishItemCellRenderer = function(params)
     {
        if(params.value && params.value == "Published")
        {
            return '<span class="unpublish">Unpublish</span>'
        }
        else if(params.value && params.value == "Unpublished")
        {
            return '<button class="confirm-order">Publish</button>'
        }
        else
        {
            return '<button class="confirm-order disabled">Publish</button>'
        }
    }

    
});