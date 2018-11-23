myApp.service("dataService", function(httpClient, $timeout, $q) {
    
    this.showAlert = function(type, msg, divToScroll, timeout, time)
    {
        $("#"+divToScroll+"_content").removeClass("alert-warning");
        $("#"+divToScroll+"_content").removeClass("alert-success");
        $("#"+divToScroll+"_content").removeClass("alert-danger");
    	$("#"+divToScroll+"_content").addClass("alert-"+type);
    	$("#"+divToScroll+"_content").html(msg);
    	$("#"+divToScroll+"_content").show();

        var elementToScrollTo = jQuery("#"+divToScroll);
	    $("html,body").animate({
	            scrollTop: elementToScrollTo.offset().top - 175
	        }, 1000);
	    var time = time || 5000;
	    if(timeout){
            $timeout(function(){
                $("#"+divToScroll+"_content").hide();
            }, time);
        }
        
    }
    
    this.getProductByKey = function(params){

        var d = $q.defer(); 

        httpClient
            .get("management/api/getItemByKey", params).then(function(data, response)
            {
	            if(data)
	            {
	                d.resolve(data, response)
	            }
	        },
	        function(err)
	        {
	            d.reject(err)
	        });
	        return d.promise;    
    }
    
});