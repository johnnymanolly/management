myApp.controller('settingsCtl', function($scope, $routeParams, $location, httpClient, schemaForms, dataService)
{
    var vm = this;

    vm.frmGlobalOptions = {
        "destroyStrategy" : "remove",
        "formDefaults": {"feedback": false}
    }
    vm.settingsSchema = schemaForms.settings.schema;
    vm.settingsForm = schemaForms.settings.form;
    vm.settingsModel = {};
    
    vm.listScope = {};
    
    vm.codesList = [
        {
            name : "Agios Tychonas",
            code: 4532
        },
        {
            name : "Germasoia",
            code: 4001
        }
    	]
    
    vm.callback = function(data, scope)
    {
        vm.listScope = scope;
        return data;
    }
    
    httpClient
        .get('management/api/settings', null).then(
        function(data, response)
        {
            console.log("success");
            if(data.documents[0].discountEnabled == "true")
            {
                vm.settingsModel.discountEnabled = true;
            }
            else
            {
                vm.settingsModel.discountEnabled = false;
            } 
            
            if(data.documents[0].deliveryEnabled == "true")
            {
                vm.settingsModel.deliveryEnabled = true;
            }
            else
            {
                vm.settingsModel.deliveryEnabled = false;
            }
            
            if(data.documents[0].onlinePayment == "true")
            {
                vm.settingsModel.onlinePayment = true;
            }
            else
            {
                vm.settingsModel.onlinePayment = false;
            }
            
            vm.settingsModel.discount 	 		= parseFloat(data.documents[0].discount);
            vm.settingsModel.deliveryTime 		= parseInt(data.documents[0].deliveryTime);
            vm.settingsModel.deliveryTimeout	= parseInt(data.documents[0].deliveryTimeout);
            vm.settingsModel.deliveryFee 		= parseFloat(data.documents[0].deliveryFee);
            vm.settingsModel.takeawayTime 		= parseInt(data.documents[0].takeawayTime);
            vm.settingsModel.minOrder 			= parseFloat(data.documents[0].minOrder);
            vm.settingsModel.address 			= parseInt(data.documents[0].address);
            vm.codes 				  			= JSON.parse(data.documents[0].postalCodes);

        },
        function(err) 
        {
            console.log(err);
        });   

    vm.submit = function(form)
    {
        if(vm.settingsModel.discountEnabled)
        {
            if(vm.settingsModel.discount && (vm.settingsModel.discount < 0 || vm.settingsModel.discount > 99))
            {
                dataService.showAlert("warning", "Please fill in required fields.", "alert_msg", true);
                return; 
            }
           
        }
        var params = {};
		params["action"] = "set";
        params["onlinePayment"] = vm.settingsModel.onlinePayment;
        params["deliveryEnabled"] = vm.settingsModel.deliveryEnabled;
        params["deliveryTimeout"] = vm.settingsModel.deliveryTimeout;
        params["deliveryTime"] = vm.settingsModel.deliveryTime;
        params["deliveryFee"] = vm.settingsModel.deliveryFee.toFixed(2);
        params["takeawayTime"] = vm.settingsModel.takeawayTime;
        params["discountEnabled"] = vm.settingsModel.discountEnabled;
        params["discount"] = vm.settingsModel.discount;
        params["minOrder"] = vm.settingsModel.minOrder;
        params["address"] = vm.settingsModel.address;
        
        var areas = vm.listScope.objects;
        params["postalCodes"] = JSON.stringify(areas);
        
        vm.showLoadingSubmit = true;
        httpClient
            .post('management/api/settings', params).then(
            function(data, response)
            {
                console.log("success");
                dataService.showAlert("success", "Settings successfully updated.", "alert_msg", true);
                vm.showLoadingSubmit = false;   

            },
            function(err) 
            {
                console.log(err);
                vm.showLoadingSubmit = false; 
            });   
    }
    

});