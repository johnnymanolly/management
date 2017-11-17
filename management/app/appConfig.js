myApp.config(wssConfig)
    .config(httpsConfig)
    .constant("menuItemsJson",  {
    "mainMenu": "col1",
    "col1": [
        {"id":"1", "iconClass":"fa fa-group", "label": "Online Orders", "route":"#/onlineOrders", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-edit", "label": "Order Online", "route":"#/orderOnline", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-edit", "label": "Order Locally", "route":"#/listTables", "active":"false"},
        {"id":"1", "iconClass":"fa fa-group", "label": "Register New Client", "route":"#/clients", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", "label": "Local Orders", "route":"#/localOrders", "active":"false"},
        {"id":"1", "iconClass":"glyphicon glyphicon-list-alt", "label": "Served Tables", "route":"#/servedTables", "active":"false"},
        {"id":"1", "iconClass":"fa fa-group", "label": "Reservations", "route":"#/reservations", "active":"false"},
    //   {"id":"3", "iconClass":"fa fa-globe", "label": "Maps", "route": "#/maps","active":"false"},
        {"id":"4", "iconClass":"glyphicon glyphicon-cloud-upload", "label": "Manage Items", "route": "#/manageItems","active":"false"},
        {"id":"5", "iconClass":"fa fa-bell-o", "label": "Suggested Items", "route": "#/suggestions","active":"false"},
        {"id":"6", "iconClass":"fa fa-bell-o", "label": "Promotions", "route": "#/promotions","active":"false"}
    ]
})

    .constant("routingJson",  {
    "params": [
        {"route": "localOrders", "template": "/management/templates/localOrders.html"},
        {"route": "servedTables", "template": "/management/templates/servedTables.html"},
        {"route": "clients", "template": "/management/templates/clients.html"},
        {"route": "onlineOrders", "template": "/management/templates/onlineOrders.html"},
        {"route": "listTables", "template": "/management/templates/listTables.html"},
        {"route": "orderOnline", "template": "/management/templates/onlineOrder.html"},
        {"route": "orderLocally", "template": "/management/templates/orderLocally.html"},
        {"route": "reservations", "template": "/management/templates/reservations.html"},
        {"route": "maps", "template": "/management/templates/maps.html"},
        {"route": "manageItems", "template": "/management/templates/manageItems.html"},
        {"route": "stats", "template": "/management/templates/statsIFrame.html"},
        {"route": "suggestions", "template": "/management/templates/suggestedItems.html"},  
        {"route": "promotions", "template": "/management/templates/promotions.html"},
        {"route": "user_management", "template": "/management/templates/userManagement.html"},
        {"route": "logs", "template": "/management/templates/orders.html"},
        {"route": "notification", "template": "/management/templates/notificationSettings.html", controller: "notificationCtrl as vm"},
        {"route": "logout", "template": "/management/logout.html"}  
    ],
    "otherwiseOption" : {"template": "/orders"}
})
    .constant("headerItemsJson", {
    "items": [ {"id":"5", "iconClass":"fa fa-dashboard", "label": "Reports", "route": "#/stats","active":"false"}],
    "subitems": [{"id":"5", "iconClass":"fa fa-dashboard", "label": "Notification Settings", "route": "#/notification","active":"false"},
                 {"id":"6", "iconClass":"fa fa-user", "label": "User Management", "route": "#/user_management","active":"false"}],  
    "appname" : "La Fourchette Libanaise",
    "logout": {"icon": "fa fa-sign-out", "label": "Logout", "route":"#/logout"}
})
    .constant("imageSrc", imageSrc)
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

