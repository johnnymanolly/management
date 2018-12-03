myApp.controller('manageItemsCtl', function($scope, $location, httpClient)
                 {
    var vm = this;

    vm.productsApiUrl = "management/api/products";

    vm.sub_cats = [];

    getSubCats(); 
    
    vm.onCatsFilterData = function(data)
    {
        /*
        var filter = [];
        filter.push({key: "all", name: "all"});
        filter.push(data.documents);
        return filter;
        */
        var array = [];
        var datas = data.documents;
        for(var i = 0; i < datas.length; i++)
        {
            if(datas[i].subCats)
            {
                var subCats = datas[i].subCats;
                if(typeof subCats == 'string') subCats = [subCats];
                for(var x = 0; x < subCats.length; x++)
                {
                    var obj = {};
                    obj["key"] = datas[i]["key"];
                    obj["cat"] = datas[i]["name"];
                    obj["subCat"] = subCats[x];
                    array.push(obj);
                }                    
            }
        }
        vm.subCatsData = array;
        
        return data.documents;
    }
    
    vm.onCatsfilterSet = function(obj)
    {
        vm.gridParams = {};
        
        if(obj.originalObject.key != "all")
        {
            vm.gridParams["catKey"] = obj.originalObject.key
        }
        else
        {
            vm.gridParams["queryFilter"] = null
        }
        $scope.$broadcast('updateGridData', {params: vm.gridParams});
    }
    
    vm.onSubCatsfilterSet = function(obj)
    {
        vm.gridParams = {};
        
        if(obj.originalObject.key != "all")
        {
            vm.gridParams["subCategory"] = obj.originalObject.subCat
        }
        else
        {
            vm.gridParams["queryFilter"] = null
        }
        $scope.$broadcast('updateGridData', {params: vm.gridParams});
    }

    vm.manageItemsColDef = [
        {headerName: "Name", field: "name"},
        {headerName: "Category", field: "category", hide: false, editable : false},
        {headerName: "Form Type", field: "formType", hide: true},
        {headerName: "Sub Category", field: "subCategory", cellEditor: "select", editable : false,
         cellEditorParams: {
             values: vm.sub_cats
         }},
        {headerName: "Brand", field: "brand", hide: true},
        {headerName: "Description", field: "description",  hide: true, cellEditor: 'agLargeTextCellEditor'},
        {headerName: "Price", field: "price"},
        {headerName: "Price Offer", field: "priceOffer"},
        {headerName: "Unit", field: "unit"},
        {headerName: "Upload Image", hide: true, editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Default Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "Barcode ID", field: "barcodeID", hide: "true"},
        {headerName: "Barcode image", field: "barcode", hide: "true", editable : false, cellRenderer: function (params) {  
            return vm.viewBarcodeCellRenderer(params);
        }},
        /*
        {headerName: "Publish Item", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishItemCellRenderer(params);
        }},
        */
        //  {headerName: "Out Of Stock", field: "outOfStock", editable : false, cellRenderer: function (params) {  
        //      return vm.outOfStockItemCellRenderer(params);
        //  }},
        {headerName: "Edit", editable : false, cellRenderer: function (params) { 
            return vm.editCellRenderer(params);

        }},
        {headerName: "Publish", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishCellRenderer(params);
        }},
        {headerName: "Promotion", field: "promotion", editable : false, cellRenderer: function (params) {  
            return vm.promotionCellRenderer(params);
        }}
    ]; 

    vm.editCellRenderer = function(params)
    {
        if(params.data)
        {
            var data = '?key='+params.data.key;

            return '<div class="ag-cell-inner"><span><a href="#/setItem'+data+'"><i class="fa fa-edit"></i> Edit</a></span></div>';  
        }

    }

    vm.uploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            if(params.data.image)
            {
                data.data["replace_image"] = params.data.image;
            }


            if(params.data.key)
            {
                return '<div class="success-btn btn-upload ag-cell-inner" upload-button upload-button url="/'+vm.productsApiUrl+'?action=set" data="data" on-upload="$ctrl.onUpload()" on-success="$ctrl.onSuccess()">Upload</div>'
            }
            else
            {
                return '<div class="btn-edited btn btn-primary btn-upload mrgt1 ag-cell-inner" ng-click="$ctrl.stopEditing()">Upload</div>'
            }
        }    
    }

    vm.viewImageCellRenderer  = function(params)
    {
        if(params.data)
        {
            var key = params.data.key;
            var img = (params.data.image) ? params.data.image : ""; 
            return '<div class="ag-cell-inner"><a target="_blank" href="https://web.scriptr.io/apsdb/rest/WFD499DDB3/GetFile?apsws.time=1543232599796&apsws.authSig=a2fb22cc1557dd6cd34de201d0c440b0&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'

        }
    }

    vm.viewBarcodeCellRenderer  = function(params)
    {
        var key = params.data.key;
        var img = params.data.barcode; 
        return ''
    }    

    vm.publishCellRenderer = function(params)
    {
        if(params.data)
        {
            if(params.data.name && params.data.subCategory && params.data.price)
            {
                if(params.value == "Published")
                {
                    return '<label id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishData(data)" type="checkbox" checked><span class="slider round"></span></label>'
                }
                else if(params.value == "Unpublished" || typeof params.value == 'undefined')
                {
                    return '<label id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishData(data)" type="checkbox"><span class="slider round"></span></label>'
                }
            }
            else
            {
                return '<label tooltip-placement="left" uib-tooltip="No Image Uploaded!" id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishData(data)" type="checkbox" disabled><span class="slider silder-disabled round"></span></label>'
            }
        }

    }

    vm.outOfStockItemCellRenderer =  function(params)
    {
        if(params.value)
        {
            if(params.value && params.value == "true")
            {
                return '<span class="unpublish ag-cell-inner">Available</span>'
            }
            else if(params.value && params.value == "false")
            {
                return '<button class="publish ag-cell-inner">Out of stock</button>'
            }
            else
            {
                return '<button class="publish disabled ag-cell-inner">Out of stock</button>'
            }
        }
    }

    vm.promotionCellRenderer =  function(params)
    {
        if(params.data && params.data.priceOffer)
        {
            if(params.value && params.value == "true")
            {
                return '<label id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishPromotion(data)" type="checkbox" checked><span class="slider round"></span></label>'
            }
            else if(params.value && params.value == "false")
            {
                return '<label id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishPromotion(data)" type="checkbox"><span class="slider round"></span></label>'
            }
            else
            {
                return '<label id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input ng-click="$ctrl.publishPromotion(data)" type="checkbox"><span class="slider round"></span></label>'
            }
        }
        else
        {
            return '<label tooltip-placement="left" uib-tooltip="No price offer set!" style="top: 25%;" class="switch"><input type="checkbox" disabled><span class="slider slider-disabled round"></span></label>'
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
        if(scope.api.getFocusedCell().column.colDef.field == "outOfStock")
        {
            var selectedRow = scope.api.getSelectedNodes()[0];
            var params = {};
            params["row"] = selectedRow.data;
            params["action"] = "set";
            var outOfStock = (selectedRow.data.outOfStock == "true") ? "false" : "true"; 
            params["row"]["outOfStock"] = outOfStock;
            scope.api.showLoadingOverlay();
            httpClient
                .post(vm.productsApiUrl, params).then(
                function(data, response)
                {
                    console.log("success");
                    scope.api.hideOverlay();
                    scope.api.refreshInfiniteCache();
                },
                function(err) 
                {
                    console.log(err);
                    scope.api.hideOverlay();
                });   
        }
        
    }

    vm.onAddRowClick = function()
    {
        $location.url('/setItem')
    }

    function getSubCats()
    {

        httpClient
            .get('management/api/categories', {}).then(
            function(data, response){
                data = data.documents;

                for(var i = 0; i < data.length; i++)
                {
                    if(data[i].subCats)
                    {
                        var subCats = data[i].subCats;
                        if(typeof subCats == 'string') subCats = [subCats];
                        for(var x = 0; x < subCats.length; x++)
                        {
                            vm.sub_cats.push(subCats[x]);  
                        }

                    }

                }

                //    vm.subCats = _.union.apply(_, vm.sub_cats);
                //   vm.sub_cats.push("d");
                console.log(vm.sub_cats);
            },
            function(err) 
            {
                console.log(err);
            });  

    }

    vm.onPublish = function(data, scope)
    {
        var params = {};
        params["row"] = data
        params["action"] = "set";
        var action = (data.publish == "Published") ? "Unpublished" : "Published"; 
        params["row"]["publish"] = action;

        scope.api.showLoadingOverlay();
        httpClient
            .post(vm.productsApiUrl, params).then(
            function(data, response)
            {
                console.log("success");
                scope.api.hideOverlay();
                scope.api.refreshInfiniteCache();
            },
            function(err) 
            {
                console.log(err);
                scope.api.hideOverlay();
            });   
    }

    vm.onPromotion = function(data, scope)
    {
        var params = {};
        params["row"] = data
        params["action"] = "set";
        var promotion = (data.promotion == "true") ? "false" : "true"; 
        params["row"]["promotion"] = promotion;
        
        scope.api.showLoadingOverlay();
        httpClient
            .post(vm.productsApiUrl, params).then(
            function(data, response)
            {
                console.log("success");
                scope.api.hideOverlay();
                scope.api.refreshInfiniteCache();
            },
            function(err) 
            {
                console.log(err);
                scope.api.hideOverlay();
            });    


    }




});