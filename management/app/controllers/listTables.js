myApp.controller('listTablesCtl', function($scope, $location, httpClient)
{    
    var vm = this;
    
    vm.tables = [];
    var tablesCount = 24;

    for(var x = 1; x <= tablesCount; x++)
    {
        var table = {};
        table["id"] = x;
        table["label"] = "Table " + x;
        table["imgSrc"] = imageSrc.table;
        vm.tables.push(table);
    }
    
    httpClient
            .get('management/api/getLocalOrders', {}).then(
            function(data, response){
                console.log("success");
                for(var x = 0; x < vm.tables.length; x++){
                    vm.tables[x]["busy"] = false;
                }
                for(var y = 0; y < data.length; y++){
                    vm.tables[data[y].tableId - 1]["busy"] = true; 
                }
                vm.showLocalOrdersLoading = false;
            },
            function(err) {
                console.log(err);
                vm.showLocalOrdersLoading = false;
            });  

    vm.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: false,
        autoplaySpeed: 3000,
        method: {},
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
            }
        }
    };
    
   vm.onTableSelect = function(table)
   {
        $location.url("/orderLocally?label="+table.label+"&id="+table.id+"&busy="+table.busy);   
   }
      
});