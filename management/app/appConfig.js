myApp.config(wssConfig)
    .config(httpsConfig)
    .constant("menuItemsJson",  {
    "mainMenu": "col1",
    "col1": [
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", "label": "Online Orders", "route":"#/onlineOrders", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-time", "label": "Scheduled Orders", "route":"#/scheduledOrders", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-edit", "label": "Order Online", "route":"#/orderOnline", "active":"false"},
        {"id":"1", "iconClass":"fa fa-group", "label": "Register New Client", "route":"#/clientRegistration", "active":"false"},
        {"id":"3", "iconClass":"fa fa-globe", "label": "Track Delivery", "route": "#/maps","active":"false"},
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload", "label": "Manage App Menu", "route": "#/manageAppMenu","active":"false"},
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload", "label": "Manage Categories", "route": "#/manageCategories","active":"false"},
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload", "label": "Manage Items", "route": "#/manageItems","active":"false"},
        {"id":"5", "iconClass":"glyphicon glyphicon-question-sign", "label": "Suggested Items", "route": "#/suggestions","active":"false"},
        {"id":"6", "iconClass":"fa fa-bell-o", "label": "Promotions", "route": "#/promotions","active":"false"}
    //    {"id":"1", "iconClass":"glyphicon glyphicon-edit", "label": "Order Locally", "route":"#/listTables", "active":"false"},
    ]
})

    .constant("routingJson",  {
    "params": [
        {"route": "listTables", "template": "/management/templates/listTables.html"},
        {"route": "clientRegistration", "template": "/management/templates/clients.html"},
        {"route": "onlineOrders", "template": "/management/templates/onlineOrders.html"},
        {"route": "scheduledOrders", "template": "/management/templates/scheduledOrders.html"},
        {"route": "orderOnline", "template": "/management/templates/onlineOrder.html"},
        {"route": "maps", "template": "/management/templates/locationIFrame.html"},
        {"route": "manageAppMenu", "template": "/management/templates/manageAppMenu.html"},
        {"route": "manageItems", "template": "/management/templates/manageItems.html"},
        {"route": "manageCategories", "template": "/management/templates/manageCategories.html"},
        {"route": "stats", "template": "/management/templates/statsIFrame.html"},
        {"route": "suggestions", "template": "/management/templates/suggestedItems.html"},  
        {"route": "promotions", "template": "/management/templates/promotions.html"},
        {"route": "user_management", "template": "/management/templates/userManagement.html"},
        {"route": "logs", "template": "/management/templates/orders.html"},
        {"route": "delivery", "template": "/management/templates/deliveryTable.html"},
        {"route": "notification", "template": "/management/templates/notificationSettings.html", controller: "notificationCtrl as vm"},
        {"route": "logout", "template": "/management/logout.html"}  
    ],
    "otherwiseOption" : {"template": "/orders"}
})
    .constant("headerItemsJson", {
    "items": [ {"id":"5", "iconClass":"fa fa-dashboard", "label": "Reports", "route": "#/stats","active":"false"}],
    "subitems": [{"id":"5", "iconClass":"fa fa-dashboard", "label": "Notification Settings", "route": "#/notification","active":"false"},
                 {"id":"6", "iconClass":"fa fa-user", "label": "User Management", "route": "#/user_management","active":"false"}],  
    "appname" : "Cashier",
    "logout": {"icon": "fa fa-sign-out", "label": "Logout", "route":"#/logout"}
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

