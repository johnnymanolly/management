myApp.controller('manageItemsCtl', function($scope, $location, httpClient)
{
   var vm = this;
    
   vm.sub_cats = [];
    
   getSubCats(); 
    
   vm.manageItemsColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Category", field: "category", cellEditor: "select", hide: true,
         cellEditorParams: {
             values: []
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
    
    vm.uploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            data.data["formType"] = "item";
            if(params.data.key){
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" upload-button url="/management/api/uploadImage?upload=image" data="data" on-upload="$ctrl.onUpload(data)">Upload</div>'
            }
            else
            {
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1" ng-click="$ctrl.stopEditing()">Upload</div>'
            }
        }     
    }
    
    vm.viewImageCellRenderer  = function(params)
    {
        if(params.data)
        {
            var key = params.data.key;
            var img = (params.data.image) ? params.data.image : ""; 
            return '<div><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'
    
        }
    }
    
    vm.viewBarcodeCellRenderer  = function(params)
    {
        var key = params.data.key;
        var img = params.data.barcode; 
        return ''
    }    
    
    vm.publishItemCellRenderer = function(params)
    {
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
    
    vm.outOfStockItemCellRenderer =  function(params)
    {
        if(params.value)
        {
            if(params.value && params.value == "true")
            {
                return '<span class="unpublish">Available</span>'
            }
            else if(params.value && params.value == "false")
            {
                return '<button class="confirm-order">Out of stock</button>'
            }
            else
            {
                return '<button class="confirm-order disabled">Out of stock</button>'
        	}
        }
    }
    
    vm.showAsPromotionCellRenderer =  function(params)
    {
        if(params.value)
        {
            if(params.value && params.value == "true")
            {
                return '<span class="unpublish">Yes</span>'
            }
            else if(params.value && params.value == "false")
            {
                return '<button class="confirm-order">No</button>'
            }
            else
            {
                return '<button class="confirm-order">No</button>'
            }
        }
        else
        {
          return '<button class="confirm-order">No</button>'  
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
    
    vm.manageItemsSelectionChanged = function(scope)
    {
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Item")
        {
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
        else if(scope.api.getFocusedCell().column.colDef.headerName == "Out Of Stock")
        {
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
        else if(scope.api.getFocusedCell().column.colDef.headerName == "Show as Promotion")
        {
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
    
    function getSubCats()
    {
         var items = {};
         httpClient
            .get('management/api/getCategories', {}).then(
            function(data, response){
                data = data.documents;
                for(var i = 0; i < data.length; i++)
                {
                    vm.sub_cats.push(data[i].subCategory);
                    items[data[i].subCategory] = {};
                    items[data[i].subCategory] = (data[i].category);

                }
                console.log("success");
            },
            function(err) 
            {
                console.log(err);
            });  
    
    }

    
   
});