import inventoryModel from "../models/inventoryModel.js";

// Add Item (Admin or Nurse)
const addInventoryItem = async (req, res) => {
  try {
    const {
      name,
      type,
      quantity,
      expiryDate,
      storageRequirement,
      batchNumber,
      serialNumber,
      maintenanceSchedule,
    } = req.body;

    if (!name || !type || !quantity) {
      return res.json({ success: false, message: "Missing Required Fields" });
    }

    const newItem = new inventoryModel({
      name,
      type,
      quantity,
      expiryDate,
      storageRequirement,
      batchNumber,
      serialNumber,
      maintenanceSchedule,
    });

    await newItem.save();
    res.json({ success: true, message: "Item Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Item
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedDate = new Date();

    await inventoryModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Item Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Item
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    await inventoryModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Item Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List All Items
const listInventoryItems = async (req, res) => {
  try {
    const items = await inventoryModel.find({});
    res.json({ success: true, items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
};
