import { useState } from "react";
import { AlertType, AlertCondition, Alert, StockGroup } from "../../types";
import StockPicker from "../Shared/StockPicker";
import ColorPicker from "../Shared/ColorPicker";

interface AlertFormProps {
  existingGroups: StockGroup[];
  onSave: (alert: Alert, newGroup?: StockGroup) => void;
  onCancel: () => void;
}

const AlertForm = ({ existingGroups, onSave, onCancel }: AlertFormProps) => {
  const [selectedStock, setSelectedStock] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("price");
  const [threshold, setThreshold] = useState("");
  const [condition, setCondition] = useState<AlertCondition>("above");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#3B82F6");
  const [aiEnabled, setAiEnabled] = useState(true);

  const isCreatingNewGroup = selectedGroup === "new";

  // Validation
  const isValid = () => {
    if (!selectedStock) return false;
    if (alertType === "price" && (!threshold || parseFloat(threshold) <= 0))
      return false;
    if (!selectedGroup) return false;
    if (isCreatingNewGroup && !newGroupName.trim()) return false;
    return true;
  };

  const resetForm = () => {
    setSelectedStock("");
    setAlertType("price");
    setThreshold("");
    setCondition("above");
    setSelectedGroup("");
    setNewGroupName("");
    setNewGroupColor("#3B82F6");
    setAiEnabled(true);
  };

  const handleSave = () => {
    if (!isValid()) {
      alert("Please fill in all required fields");
      return;
    }

    let groupId = selectedGroup;
    let groupColor = "";
    let newGroup: StockGroup | undefined;

    if (isCreatingNewGroup) {
      groupId = `group-${newGroupName.toLowerCase().replace(/\s+/g, "-")}`;
      groupColor = newGroupColor;
      newGroup = {
        id: groupId,
        name: newGroupName,
        color: newGroupColor,
        stockIds: [selectedStock],
      };
    } else {
      const group = existingGroups.find((g) => g.id === selectedGroup);
      if (group) {
        groupColor = group.color;
      }
    }

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      stockId: selectedStock,
      type: alertType,
      threshold: alertType === "price" ? parseFloat(threshold) : undefined,
      condition: alertType === "price" ? condition : undefined,
      group: groupId,
      groupColor: groupColor,
      aiEnabled,
      enabled: true,
      createdAt: new Date(),
    };

    onSave(newAlert, newGroup);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Create New Alert</h3>

      {/* Stock Picker */}
      <StockPicker
        value={selectedStock}
        onChange={setSelectedStock}
        label="Select Stock *"
      />

      {/* Alert Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alert Type *
        </label>
        <div className="flex gap-4">
          {(["price", "volume", "news"] as AlertType[]).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="alertType"
                value={type}
                checked={alertType === type}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price-specific fields */}
      {alertType === "price" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Threshold */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Threshold *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="150.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as AlertCondition)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
        </div>
      )}

      {/* Group Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alert Group *
        </label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          <option value="">Select a group...</option>
          {existingGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
          <option value="new">+ Create New Group</option>
        </select>
      </div>

      {/* New Group Fields */}
      {isCreatingNewGroup && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900">
            New Group Details
          </h4>

          {/* Group Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Group Name *
            </label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g., Growth, Tech, Portfolio"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Group Color */}
          <ColorPicker
            value={newGroupColor}
            onChange={setNewGroupColor}
            label="Group Color *"
          />
        </div>
      )}

      {/* AI Toggle */}
      <div className="flex items-center gap-3 p-4 bg-slate-200 rounded-lg">
        <input
          type="checkbox"
          id="ai-enabled"
          checked={aiEnabled}
          onChange={(e) => setAiEnabled(e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <label
          htmlFor="ai-enabled"
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          Enable AI Powered Alerts
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!isValid()}
          className={`
            flex-1 px-4 py-2 rounded-lg font-medium transition-colors
            ${
              isValid()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Save Alert
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AlertForm;
