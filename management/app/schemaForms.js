var schemaForms = {
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
            "subCats"
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
                "priceOffer": {
                    "title": "Price Offer",
                    "type": "number"
                },
                "unit": {
                    "title": "Unit",
                    "type": "string"
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
            "brand",
           
            "price",
            "priceOffer",
            "unit",
             {
               type : "textarea",
                key : "description", 
            }
        ]
    }

}











