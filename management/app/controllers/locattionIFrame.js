myApp.controller('locattionIFrameCtl', function($scope, $sce, $location, httpClient)
{    
    var vm = this;
    
    vm.mapsSrc = $sce.trustAsResourceUrl('/management/templates/location.html?deviceId='+vm.deliveryDevice);
    
    vm.onDeliveryData = function(data)
    {
        return data.documents;
    }
    
    vm.onDeliveryDeviceSet = function(data, scope)
    {
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
    
});