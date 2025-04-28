import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { NurseContext } from "../../context/NurseContext"; // ✅ Use NurseContext instead of AdminContext
import { toast } from "react-toastify";

const InventoryManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const {
    inventoryItems,
    getAllInventoryItems,
    addInventoryItem,
    deleteInventoryItem,
    updateInventoryItem,
  } = useContext(NurseContext); // ✅ NurseContext

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    type: "equipment",
    unit: "",
    expiryDate: "",
    batchNumber: "",
    serialNumber: "",
    storageRequirement: "",
    maintenanceSchedule: "",
  });

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.type) {
      return toast.error("Fill all required fields");
    }
    await addInventoryItem(newItem);
    setNewItem({
      name: "",
      quantity: 1,
      type: "equipment",
      unit: "",
      expiryDate: "",
      batchNumber: "",
      serialNumber: "",
      storageRequirement: "",
      maintenanceSchedule: "",
    });
  };

  const handleUpdateField = async (id, field, value) => {
    const updateData = { [field]: value };
    await updateInventoryItem(id, updateData);
  };

  const handleDeleteItem = async (id) => {
    await deleteInventoryItem(id);
  };

  useEffect(() => {
    getAllInventoryItems();
  }, []);

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-5">Inventory Management (Nurse)</h1>

      {/* Add Item Form */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded flex-1"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 rounded w-24"
          min="0"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: Number(e.target.value) })
          }
        />
        <select
          className="border p-2 rounded w-40"
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
        >
          <option value="equipment">Equipment</option>
          <option value="medication">Medication</option>
          <option value="consumable">Consumable</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded w-40"
          value={newItem.expiryDate}
          onChange={(e) =>
            setNewItem({ ...newItem, expiryDate: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Batch Number"
          className="border p-2 rounded w-40"
          value={newItem.batchNumber}
          onChange={(e) =>
            setNewItem({ ...newItem, batchNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Serial Number"
          className="border p-2 rounded w-40"
          value={newItem.serialNumber}
          onChange={(e) =>
            setNewItem({ ...newItem, serialNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Storage Req."
          className="border p-2 rounded w-40"
          value={newItem.storageRequirement}
          onChange={(e) =>
            setNewItem({ ...newItem, storageRequirement: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Maintenance Schedule"
          className="border p-2 rounded w-40"
          value={newItem.maintenanceSchedule}
          onChange={(e) =>
            setNewItem({ ...newItem, maintenanceSchedule: e.target.value })
          }
        />
        <button
          onClick={handleAddItem}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded p-4 shadow overflow-x-auto">
        {inventoryItems.length > 0 ? (
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Expiry</th>
                <th className="px-3 py-2">Batch No</th>
                <th className="px-3 py-2">Serial No</th>
                <th className="px-3 py-2">Storage Req</th>
                <th className="px-3 py-2">Maintenance</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="border w-20 px-2 py-1 rounded"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateField(
                          item._id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2 capitalize">{item.type}</td>
                  <td className="px-3 py-2">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{item.batchNumber || "-"}</td>
                  <td className="px-3 py-2">{item.serialNumber || "-"}</td>
                  <td className="px-3 py-2">
                    {item.storageRequirement || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {item.maintenanceSchedule || "-"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No inventory items yet.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
