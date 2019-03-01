var schemaForms = {
     settings: {
        schema: {
            "type": "object",
            "title": "Comment",
            "properties": {
                "discount": {
                    "title": "Percentage Discount",
                    "type": "number",
                    "minimum": 0,
                    "maximum": 99,
                    "description" : "Set Percentage Discount"
                },
                
                "minOrder": {
                    "title": "Set Minimum Order",
                    "type": "number"
                },
                
                 "discountEnabled": {
                  "title": "Enable Discount Percentage",
                  "type": "boolean"
                },
                
                "deliveryEnabled": {
                  "title": "Enable Delivery Mode",
                  "type": "boolean"
                },
                
                 "onlinePayment": {
                  "title": "Enable Online Payment",
                  "type": "boolean"
                },
                
                "deliveryTime": {
                  "title": "Estimated Delivery Time (+/- 5 minutes)",
                  "type": "number"
                },
                
                "deliveryFee": {
                  "title": "Delivery Fee",
                  "type": "number"
                },
                
                "takeawayTime": {
                  "title": "Estimated Takeaway Time (+/- 5 minutes)",
                  "type": "number"
                },
                
                "address": {
                  "title": "Restaurant address",
                  "type": "string"
                },
                
                "deliveryTimeout": {
                  "title": "Timeout For Delivery Approval (minutes)",
                  "type": "number"
                },
                
                "required": [
                    "discount",
                    "minOrder"
                ]
            }
        },
        form: [
              "onlinePayment",
              "deliveryEnabled",
              "deliveryTime",
              "deliveryTimeout",
              "deliveryFee",
              "takeawayTime",
              "discountEnabled",  
              {
                "key": "discount",
                "condition": "model.discountEnabled",
                "required": true
              },
              {
                "key": "discount",
                "condition": "!model.discountEnabled"
              },
              "minOrder",
            //  "address"

        ]

    },
    category: {
        schema: {
            "type": "object",
            "title": "Comment",
            "properties": {
                "name": {
                    "title": "Category Name *",
                    "type": "string"
                },
                "type": {
                    "title": "Choose Type *",
                    "type": "string"
                },
                "subCats": {
                    "type": "array",
                    "title": "Add your categories.",
                    "items": {
                        "type": "string",
                        "title": "Category Name"
                    }
                },

                "required": [
                    "name",
                    "type"
                ]
            }
        },
        form: [
            "name",
            /*
            {
                type : "select",
                key : "type",
                titleMap: {
                    "Food": "Food",
                    "Drinks": "Drinks",
                    "Fruits": "Fruits",
                    "Veggies": "Veggies",
                    "Others": "Others"
                }
            },
            */
          //  "subCats"
        ]

    },
    items : {
        schema: {
            "type": "object",
            "title": "Comment",
            "properties": {
                "name": {
                    "title": "Item Name *",
                    "type": "string"
                },
                /*
                "type": {
                    "title": "Choose Category *",
                    "type": "string"
                },
                */
                "subCats": {
                    "title": "Choose Sub Category *",
                    "type": "string"
                },
                "brand": {
                    "title": "Brand",
                    "type": "string"
                },
                "description": {
                    "title": "Description",
                    "type": "string"
                },
                "price": {
                    "title": "Price *",
                    "type": "number"
                },
                "halfPortionPrice": {
                    "title": "Half Portion Price (Optional)",
                    "type": "number"
                },
                "priceOffer": {
                    "title": "Price Offer",
                    "type": "number"
                },
                "unit": {
                    "title": "Unit",
                    "type": "string"
                },
                "default_ingredients": {
                    "type": "array",
                    "title": "Default ingredients (Client will be able to add/remove any ingedient).",
                    "items": {
                        "type": "string",
                        "title": "Ingredient Name"
                    }
                },
                "extra_ingredients": {
                    "type": "array",
                    "title": "Extra ingredients (Client will be able to add/remove any ingedient).",
                    "items": {
                        "type": "string",
                        "title": "Ingredient Name"
                    }
                },
                "calories": {
                    "title": "Calories",
                    "type": "number"
                },
                "fat": {
                    "title": "Fat",
                    "type": "number"
                },
                "carbs": {
                    "title": "Carbs",
                    "type": "number"
                },
                "protein": {
                    "title": "Protein",
                    "type": "number"
                },

                "required": [
                    "name",
                    "type"
                ]
            }
        },
        form: [
            "name",
            /*
            {
                type : "select",
                key : "subCats",
                titleMap: {
                    "Food": "Food",
                    "Drinks": "Drinks",
                    "Fruits": "Fruits",
                    "Veggies": "Veggies",
                    "Others": "Others"
                }
            },
            */
         //   "brand",
           
            "price",
            "halfPortionPrice",
         //   "priceOffer",
            "unit",
            "default_ingredients",
            "extra_ingredients",
            {
               type : "textarea",
                key : "description", 
            },
            "calories",
            "fat",
            "carbs",
            "protein"
        ]
    }

}











