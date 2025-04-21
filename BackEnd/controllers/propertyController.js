const Property = require("../models/property");
const User = require("../models/user")

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProperty = async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const saved = await newProperty.save();

    await User.findByIdAndUpdate(req.params.id, {
      $push: { ownedResidencies: {
        _id: saved._id,
        title: saved.title
      }}
    });

    const userWithProperties = await User.findById(req.params.id).populate({
    path: 'ownedResidencies',
    select: '_id title'
    });

    res.json(userWithProperties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {getAllProperties, addProperty, updateProperty, deleteProperty};