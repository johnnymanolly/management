myApp.controller('setCategoryCtl', function($scope, $routeParams, $location, httpClient, schemaForms, dataService, account, time, authSig)
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
            vm.imgSrc = "https://web.scriptr.io/apsdb/rest/" + account + "/GetFile?apsws.time=" + time + "&apsws.authSig=" + authSig + "&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
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
        vm.showLoading = true;
    }

    vm.onSuccess = function(resp)
    {
        vm.showLoading = false;
        vm.image = resp.response.data.response.result.fileName;
        vm.key = resp.response.data.response.result.key;
        vm.imgSrc = "https://web.scriptr.io/apsdb/rest/" + account + "/GetFile?apsws.time=" + time + "&apsws.authSig=" + authSig + "&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
    }

    vm.delete = function()
    {
        var params = {};
        params.action = "delete";
        params.key = vm.key;
        params.attachment = vm.image;
        vm.showLoading = true;
        httpClient
            .get('management/api/categories', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLoading = false;   
                vm.image = null;
                vm.imgSrc = "/";
            },
            function(err) 
            {
                console.log(err);
                vm.showLoading = false; 
            });   
    }

    vm.submit = function(form)
    {
        if(!vm.categoryModel.name)
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


        vm.showLoading = true;
        httpClient
            .post('management/api/categories', params).then(
            function(data, response)
            {
                console.log("success");
                dataService.showAlert("success", "Successfully updated category.", "alert_msg", true);
                vm.showLoading = false;   
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
                vm.showLoading = false; 
            });   
    }
    
    vm.newCat = function()
    {
        $location.url("/setCategory?"+Math.floor((Math.random() * 100) + 1))
    }

});