myApp.config(wssConfig)
    .config(httpsConfig)
    .constant("menuItemsJson",  {
    "mainMenu": "col1",
    "col1": [
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", 		"label": "Online Orders", 	 	"route":"#/onlineOrders"},
        {"id":"1", "iconClass":"glyphicon glyphicon-time", 			"label": "Scheduled Orders", 	"route":"#/scheduledOrders"},
        
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload",  "label": "Manage Gallery", 	 	"route": "#/manageAppMenu"},
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload",  "label": "Manage Categories",	"route": "#/manageCategories"},  
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload",  "label": "Manage Items", 	  	"route": "#/manageItems"},
       
        {"id":"1", "iconClass":"fa fa-group", 						"label": "Register New Client", "route":"#/clientRegistration"},
        {"id":"3", "iconClass":"fa fa-globe", 						"label": "Track Delivery", 		"route": "#/maps"},
        {"id":"5", "iconClass":"glyphicon glyphicon-question-sign", "label": "Suggested Items", 	"route": "#/suggestions"},
        {"id":"6", "iconClass":"fa fa-bell-o", 						"label": "Promotions", 			"route": "#/promotions"},

        
        {"id":"1", "iconClass":"glyphicon glyphicon-edit", 			"label": "Order Online", 		"route":"#/orderOnline"},
        {"id":"1", "iconClass":"glyphicon glyphicon-edit", 			"label": "Order Locally", 		"route":"#/listTables"},
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", 		"label": "Local Orders", 		"route":"#/localOrders"},
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", 		"label": "Served Tables", 		"route":"#/servedTables"},

    	]

})

    .constant("routingJson",  {
    "params": [
        
        {"route": "onlineOrders", 		 "template": "/management/templates/onlineOrders.html",       controller: "showOrdersCtl as vm"},
        {"route": "scheduledOrders", 	 "template": "/management/templates/scheduledOrders.html",	  controller: "showScheduledOrdersCtl as vm"},
        
        {"route": "manageAppMenu", 		 "template": "/management/templates/manageAppMenu.html",	  controller: "manageGalleryCtl as vm"},
        {"route": "manageCategories", 	 "template": "/management/templates/manageCategories.html",	  controller: "manageCategoriesCtl as vm"},
        {"route": "manageItems", 		 "template": "/management/templates/manageItems.html", 		  controller: "manageItemsCtl as vm"},
        
        {"route": "clientRegistration",  "template": "/management/templates/clients.html", 			  controller: "clientsCtl as vm"},
        {"route": "maps", 				 "template": "/management/templates/locationIFrame.html", 	  controller: "locattionIFrameCtl as vm"},
        {"route": "delivery", 			 "template": "/management/templates/deliveryTable.html", 	  controller: "deliveryCtl as vm"},
        {"route": "suggestions", 		 "template": "/management/templates/suggestedItems.html"}, 
        {"route": "promotions", 		 "template": "/management/templates/promotions.html", 		  controller: "promotionCtl as vm"},
        
        {"route": "orderOnline", 		 "template": "/management/templates/OrderOnline.html",		  controller: "orderOnlineCtl as vm"},
        {"route": "listTables", 		 "template": "/management/templates/listTables.html", 		  controller: "listTablesCtl as vm"},
        {"route": "localOrders", 		 "template": "/management/templates/localOrders.html", 		  controller: "localOrdersCtl as vm"},
        {"route": "servedTables", 		 "template": "/management/templates/servedTables.html", 	  controller: "servedTablesCtl as vm"},
        
        {"route": "orderLocally", 		 "template": "/management/templates/orderLocally.html",		  controller: "orderLocallyCtl as vm"},

        {"route": "stats", 			     "template": "/management/templates/statsIFrame.html"},
        
        
        {"route": "user_management", 	 "template": "/management/templates/userManagement.html"},
        
        {"route": "notification", 		 "template": "/management/templates/notificationSettings.html", controller: "notificationCtrl as vm"},
        {"route": "logout", 			 "template": "/management/logout.html"}  
    ],
    "otherwiseOption" : {"template": "/orders"}
})
    .constant("headerItemsJson", {
    "items": [
        {"id":"5", "iconClass":"fa fa-dashboard", "label": "Reports", 				"route": "#/stats","active":"false"}
    ],
    "subitems": [
        {"id":"5", "iconClass":"fa fa-dashboard", "label": "Notification Settings", "route": "#/notification","active":"false"},
        {"id":"6", "iconClass":"fa fa-user", 	  "label": "User Management", 		"route": "#/user_management","active":"false"}
    ],  
    "appname" : "",
    "logout": {"icon": "fa fa-sign-out", 		  "label": "Logout", 				"route":"#/logout"}
})
    .constant("imageSrc", imageSrc)
	.constant("categories", ["Bakery","Beverages and Juices", "Alcohol", "Chilled","Deli Meat", "Fruits and Vegetables", "Health and Beauty", "Others"])
    .config(function($routeProvider, routingJson){
    for(var i = 0; i < routingJson.params.length; i++){
        $routeProvider
            .when("/" + routingJson.params[i].route,
                  {
            templateUrl: routingJson.params[i].template,
            controller: routingJson.params[i].controller,
        })
            .otherwise({redirectTo:'/onlineOrders'})                                          
    }
}); 

