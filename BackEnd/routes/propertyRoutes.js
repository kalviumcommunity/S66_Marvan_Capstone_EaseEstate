const express = require("express");
const propertyRoutes = express.Router();
const {getAllProperties, addProperty, updateProperty, deleteProperty} =  require("../controllers/propertycontroller.js");

propertyRoutes.get("/" , getAllProperties);
propertyRoutes.post("/add-property/:id", addProperty);
propertyRoutes.put("/:id", updateProperty);
propertyRoutes.delete("/:id", deleteProperty);


module.exports = propertyRoutes;
