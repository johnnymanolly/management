myApp.controller('manageGalleryCtl', function($scope, $location, httpClient)
{
    var vm = this;
    
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
    
    vm.galleryUploadImageButtonRenderer = function(params)
    {        
        if(params.data)
        {
            var data = {data : params.data};
            data.data["formType"] = "menu";
            if(params.data.key)
            {
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
    
    vm.publishGalleryCellRenderer = function(params)
    {
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
        if(scope.api.getFocusedCell().column.colDef.headerName == "Publish Menu")
        {
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
 
});