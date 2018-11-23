myApp.controller('manageCategoriesCtl', function($scope, $location, $timeout, httpClient)
                 {
    var vm = this;



    vm.onPublish = function(data, scope)
    {
        var params = {};
        params["action"] = "set";
        params["row"] = data;
        
        var action = (data.publish == "Published") ? "Unpublished" : "Published"; 
        params["row"]["publish"] = action;

        scope.api.showLoadingOverlay();
        httpClient
            .post('management/api/categories', params).then(
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

    vm.manageMenuColDef = [
        {headerName: "Category Name", field: "name"},
        {headerName: "Category Type", field: "type", cellEditor: "select", editable : false,
         cellEditorParams: {  
             values : ["Food", "Drinks", "Fruits", "Veggies", "Others"]
         }},
        {headerName: "Sub Categories", field: "subCats", hide: true},
        {headerName: "Upload Image", editable : false, cellRenderer: function (params) {  
            return vm.uploadImageButtonRenderer(params);
        }},
        {headerName: "Image", field: "image", editable : false, cellRenderer: function (params) {  
            return vm.viewImageCellRenderer(params);
        }},
        {headerName: "Edit", editable : false, cellRenderer: function (params) { 
            return vm.editCellRenderer(params);

        }},
        {headerName: "Publish", field: "publish", editable : false, cellRenderer: function (params) {  
            return vm.publishGalleryCellRenderer(params);
        }}
    ];

    vm.onAddRowClick = function()
    {
        $location.url('/setCategory')
    }

    vm.editCellRenderer = function(params)
    {
        if(params.data)
        {
            var data = '?key='+params.data.key;
            if(params.data.name)
            {
                data += '&name='+params.data.name;
            }
            if(params.data.type)
            {
                data += '&type='+params.data.type;
            }
            if(params.data.image)
            {
                data += '&image='+params.data.image;
            }
            if(params.data.subCats)
            {
                data += '&subCats='+params.data.subCats;
            }
            return '<div class="ag-cell-inner"><span><a href="#/setCategory'+data+'"><i class="fa fa-edit"></i> Edit</a></span></div>';  
        }

    }

    vm.uploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};

            if(params.data.key)
            {
                return '<div class="success-btn btn-upload ag-cell-inner" upload-button upload-button url="/management/api/categories?action=set" data="data" on-upload="$ctrl.onUpload()" on-success="$ctrl.onSuccess()">Upload</div>'
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
            return '<div class="ag-cell-inner"><a target="_blank" href=" https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1493564512784&apsws.authSig=5b79a9b6edfc57904b07e2b1d5fa653a&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName='+img+'&apsdb.fieldName=attachments&apsdb.documentKey='+key+'&apsdb.store=DefaultStore">'+img+'</a></div>'

        }
    }

    vm.publishGalleryCellRenderer = function(params)
    {
        if(params.data)
        {
            if(params.data.name && params.data.type && params.data.image)
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
                return '<label tooltip-placement="left" uib-tooltip="No Image Uploaded!" id="publish_'+params.data.key+'" style="top: 25%;" class="switch"><input type="checkbox" disabled><span class="slider silder-disabled round"></span></label>'
            }
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

    vm.manageMenuSelectionChanged  = function(scope)
    {
       
    }

});