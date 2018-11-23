myApp.controller('setItemCtl', function($scope, $routeParams, $location, httpClient, schemaForms, dataService)
                 {
    var vm = this;
    
    vm.imgSrc1 = "/";
    vm.imgSrc2 = "/";
    vm.imgSrc3 = "/";
    vm.imgSrc4 = "/";
    vm.selectedImgSrc = '/';
    
    vm.images = [];

    vm.data = {};
    vm.data["action"] = "set";

    vm.frmGlobalOptions = {
        "destroyStrategy" : "remove",
        "formDefaults": {"feedback": false}
    }
    vm.itemSchema = schemaForms.items.schema;
    vm.itemForm = schemaForms.items.form;
    vm.itemModel = {};

    if($routeParams.key)
    {
        vm.key = $routeParams.key;
        getProductByKey(vm.key);

        vm.data["row"] = {};
        vm.data["row"] = JSON.stringify({key: vm.key});

    }

    function getProductByKey(key)
    {

        var params = {key: key}
        dataService.getProductByKey(params).then(

            function(data, response)
            {
                if(data)
                {
                    vm.product = data;
                    setItemInfo(vm.product);
                }
            },
            function(err)
            {
                console.log("reject", err);
            }
        );        
    }

    function setItemInfo(product)
    {
        if(product.attachments)
        {
            vm.images = product.attachments;
            if(typeof vm.images == 'string') vm.images = [vm.images];
            
            if(vm.images.length > 0)
            {
                if(vm.images[0] == product.image)
                {
                    vm.default_img = 0;
                }
                vm.imgSrc1 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.images[0]+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            }
            
            if(vm.images.length > 1)
            {
                if(vm.images[1] == product.image)
                {
                    vm.default_img = 1;
                }
                vm.imgSrc2 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.images[1]+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            }
            
            if(vm.images.length > 2)
            {
               if(vm.images[2] == product.image)
                {
                    vm.default_img = 2;
                } 
               vm.imgSrc3 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.images[2]+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore"; 
            }
            
            if(vm.images.length > 3)
            {
                if(vm.images[3] == product.image)
                {
                    vm.default_img = 3;
                }
                vm.imgSrc4 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.images[3]+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            }
     
        }    
        if(product.name)
        {
            vm.itemModel.name =  product.name;
        }
        if(product.brand)
        {
            vm.itemModel.brand =  product.brand;
        }
        if(product.price)
        {
            vm.itemModel.price =  parseInt(product.price);
        }
        if(product.priceOffer)
        {
            vm.itemModel.priceOffer =  parseInt(product.priceOffer);
        }
        if(product.unit)
        {
            vm.itemModel.unit =  product.unit;
        }
        if(product.description)
        {
            vm.itemModel.description =  product.description;
        }

        if(product.subCategory)
        {
            $scope.$broadcast('angucomplete-alt:changeInput', "subcats", product.subCategory);
            vm.selectedSubCat = {};
            vm.selectedSubCat["key"] = product["catKey"];
            vm.selectedSubCat["value"] = product["subCategory"];
            vm.selectedSubCat["name"] = product["category"];
        }


    }

    vm.onUpload = function(data)
    {
        vm.data["selected_frame"] = vm.selected_frame;
        if(typeof vm.images[vm.selected_frame] != "undefined")
        {
            vm.data["replace_image"] = vm.images[vm.selected_frame];
        }
        
        vm.showLoadingUpload = true;
    }

    vm.onSuccess = function(resp)
    {
        vm.showLoadingUpload = false;
        vm.image = resp.response.data.response.result.fileName;
        vm.key = resp.response.data.response.result.key;
        var selected_frame = resp.response.data.response.result.selected_frame;
        if(selected_frame == 0)
        {
            vm.images[0] = resp.response.data.response.result.fileName;
            vm.imgSrc1 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            if(selected_frame == 0 && vm.selected_frame == 0)
            {
                vm.selectedImgSrc = vm.imgSrc1;
            }
            
        }
        if(selected_frame == 1)
        {
            vm.images[1] = resp.response.data.response.result.fileName;
            vm.imgSrc2 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            if(selected_frame == 0 && vm.selected_frame == 0)
            {
                vm.selectedImgSrc = vm.imgSrc2;
            }
        }
        if(selected_frame == 2)
        {
            vm.images[2] = resp.response.data.response.result.fileName;
            vm.imgSrc3 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            if(selected_frame == 0 && vm.selected_frame == 0)
            {
                vm.selectedImgSrc = vm.imgSrc3;
            }
        }
        if(selected_frame == 3)
        {
            vm.images[3] = resp.response.data.response.result.fileName;
            vm.imgSrc4 = "https://web.scriptr.io/apsdb/rest/PF35EDE24C/GetFile?apsws.time=1521990379333&apsws.authSig=2cd615af3b002311df36b3fd5ed4834d&apsws.responseType=json&apsws.authMode=simple&apsdb.fileName="+vm.image+"&apsdb.fieldName=attachments&apsdb.documentKey="+vm.key+"&apsdb.store=DefaultStore";
            if(selected_frame == 0 && vm.selected_frame == 0)
            {
                vm.selectedImgSrc = vm.imgSrc4;
            }
        }

    }

    vm.delete = function()
    {
        var params = {};
        params.action = "delete";
        params.key = vm.key;
        params.selected_frame = vm.selected_frame;
        if(vm.selected_frame == 0)
        {
            params.attachment = vm.images[0];  
        }
        if(vm.selected_frame == 1)
        {
            params.attachment = vm.images[1];  
        } 
        if(vm.selected_frame == 2)
        {
            params.attachment = vm.images[2]; 
        } 
        if(vm.selected_frame == 3)
        {
            params.attachment = vm.images[3]; 
        } 

        vm.showLoadingDelete = true;
        httpClient
            .get('management/api/products', params).then(
            function(data, response)
            {
                console.log("success");
                vm.showLoadingDelete = false;  
                if(data.selected_frame == 0)
                {
                    vm.imgSrc1 = "/";
                }
                if(data.selected_frame == 1)
                {
                    vm.imgSrc2 = "/";
                }
                if(data.selected_frame == 2)
                {
                    vm.imgSrc3 = "/";
                }
                if(data.selected_frame == 3)
                {
                    vm.imgSrc4 = "/";
                }
            },
            function(err) 
            {
                console.log(err);
                vm.showLoadingDelete = false; 
            });   
    }

    vm.submit = function(form)
    {
        if(!vm.itemModel.name || !vm.itemModel.price || !vm.selectedSubCat)
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
        params["row"]["name"] = vm.itemModel.name;
        params["row"]["brand"] = vm.itemModel.brand; 
        params["row"]["unit"] = vm.itemModel.unit;
        params["row"]["price"] = vm.itemModel.price;
        params["row"]["description"] = vm.itemModel.description;
        params["row"]["catKey"] = vm.selectedSubCat["key"];
        params["row"]["category"] = vm.selectedSubCat["name"];
        params["row"]["subCategory"] = vm.selectedSubCat["value"];
        
        if(vm.itemModel.priceOffer)
        {
			params["row"]["priceOffer"] = vm.itemModel.priceOffer.toFixed(2);
        }

        vm.showLoadingSubmit = true;
        httpClient
            .post('management/api/products', params).then(
            function(data, response)
            {
                console.log("success");
                dataService.showAlert("success", "Successfully updated Product.", "alert_msg", true);
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
    
    vm.onImgSelect = function(id)
    {
        if(id == 0)
        {
            vm.selected_frame = 0;
        	vm.selectedImgSrc = vm.imgSrc1;
        }
        if(id == 1)
        {
            vm.selected_frame = 1;
        	vm.selectedImgSrc = vm.imgSrc2;
        }
        if(id == 2)
        {
            vm.selected_frame = 2;
        	vm.selectedImgSrc = vm.imgSrc3;
        }
        if(id == 3)
        {
            vm.selected_frame = 3;
        	vm.selectedImgSrc = vm.imgSrc4;
        }
        
    }

    vm.setSubcatsFormatData = function(data)
    {
        var array = [];
        data = data.documents;
        for(var i = 0; i < data.length; i++)
        {
            if(data[i].subCats)
            {
                var subCats = data[i].subCats;
                if(typeof subCats == 'string') subCats = [subCats];
                for(var x = 0; x < subCats.length; x++)
                {
                    var obj = {};
                    obj["key"] = data[i]["key"];
                    obj["name"] = data[i]["name"];
                    obj["value"] = subCats[x];
                    array.push(obj);
                }                    
            }
        }
        return array;
    }

    vm.onSelect = function(obj)
    {
        vm.selectedSubCat = obj.originalObject;
    }
    
    vm.setMainImage = function()
    {
       var params = {};
       params["action"] = "set";
       params["row"] = {};
       params["row"]["key"] = vm.key;
       params["row"]["image"] = vm.images[vm.selected_frame];
       params["selected_frame"] = vm.selected_frame;
       vm.showLoadingMain = true;
        httpClient
            .get('management/api/products', params).then(
            function(data, response)
            {
                console.log("success");
                vm.default_img = data.selected_frame;
                vm.showLoadingMain = false;  
            },
            function(err) 
            {
                console.log(err);
                vm.showLoadingMain = false; 
            });   
    }
    
    vm.newItem = function()
    {
        $location.url("/setItem?"+Math.floor((Math.random() * 100) + 1))
    }

});