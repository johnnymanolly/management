myApp.controller('setCategoryCtl', function($scope, $routeParams, $location, httpClient, schemaForms, dataService)
                 {
    var vm = this;

    vm.data = {};
    vm.data["action"] = "set";

    vm.frmGlobalOptions = {
        "destroyStrategy" : "remove",
        "formDefaults": {"feedback": false}
    }
    vm.categorySchema = schemaForms.category.schema;
    vm.categoryForm = schemaForms.category.form;
    vm.categoryModel = {};

    if($routeParams.key)
    {
        vm.key = $routeParams.key;

        vm.data["row"] = {};
        vm.data["row"] = JSON.stringify({key: vm.key});

        if($routeParams.image)
        {
            vm.image = $routeParams.image;
            vm.imgSrc = "https://web.scriptr.io/apsdb/rest/WFD499DDB3/GetFile?apsws.time=1543232599796&apsws.authSig=a2fb22cc1557dd6cd34de201d0c440b0&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
        }    
        if($routeParams.name)
        {
            vm.categoryModel.name =  $routeParams.name;
        }
        if($routeParams.type)
        {
            vm.categoryModel.type =  $routeParams.type;
        }
        if($routeParams.subCats)
        {
            vm.categoryModel.subCats =  $routeParams.subCats.split(",");
        }
    }

    vm.onUpload = function(data)
    {
        vm.showLoadingUpload = true;
    }

    vm.onSuccess = function(resp)
    {
        vm.showLoadingUpload = false;
        vm.image = resp.response.data.response.result.fileName;
        vm.key = resp.response.data.response.result.key;
        vm.imgSrc = "https://web.scriptr.io/apsdb/rest/WFD499DDB3/GetFile?apsws.time=1543232599796&apsws.authSig=a2fb22cc1557dd6cd34de201d0c440b0&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
    }

    vm.delete = function()
    {
        var params = {};
        params.action = "delete";
        params.key = vm.key;
        params.attachment = vm.image;
        vm.showLoadingDelete = true;
        httpClient
            .get('management/api/categories', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLoadingDelete = false;   
                vm.image = null;
                vm.imgSrc = "/";
            },
            function(err) 
            {
                console.log(err);
                vm.showLoadingDelete = false; 
            });   
    }

    vm.submit = function(form)
    {
        if(!vm.categoryModel.name || !vm.categoryModel.type)
        {
            dataService.showAlert("warning", "Please fill in required fields.", "alert_msg", true);
            return;
        }
        var params = {};
        params["action"] = "set";
        if(vm.key)
        {
            params["key"] = vm.key;
        }
        params["row"] = {};
        params["row"]["key"] = vm.key;
        params["row"]["name"] = vm.categoryModel.name;
        params["row"]["type"] = vm.categoryModel.type;
        params["row"]["subCats"] = vm.categoryModel.subCats;


        vm.showLoadingSubmit = true;
        httpClient
            .post('management/api/categories', params).then(
            function(data, response)
            {
                console.log("success");
                dataService.showAlert("success", "Successfully updated category.", "alert_msg", true);
                vm.showLoadingSubmit = false;   
                vm.key = data.key;

                if(vm.key)
                {
                    vm.data["row"] = {};
                    vm.data["row"] = JSON.stringify({key: vm.key});
                }

            },
            function(err) 
            {
                console.log(err);
                vm.showLoadingSubmit = false; 
            });   
    }
    
    vm.newCat = function()
    {
        $location.url("/setCategory?"+Math.floor((Math.random() * 100) + 1))
    }

});