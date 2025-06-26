const express = require("express");
const propertyRoutes = express.Router();
const {getAllProperties, addProperty, updateProperty, deleteProperty, getSpecificProperty} =  require("../controllers/propertyController.js");

propertyRoutes.get("/" , getAllProperties);
propertyRoutes.get("/:id" , getSpecificProperty);
propertyRoutes.post("/add-property/:id", addProperty);
propertyRoutes.put("/:id", updateProperty);
propertyRoutes.delete("/:id", deleteProperty);


module.exports = propertyRoutes;
