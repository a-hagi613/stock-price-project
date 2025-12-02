import { Edit2, Trash2, Bot } from "lucide-react";
import { Alert } from "../../types";
import { getStockById } from "../../data/mockData";

interface AlertCardProps {
  alert: Alert;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * AlertCard - Displays a single alert with all its properties
 * Features:
 * - Stock ticker and name
 * - Alert type and conditions
 * - Group badge with color
 * - AI enabled indicator
 * - Left border stripe with group color (3px)
 * - Edit/Delete buttons
 */
const AlertCard = ({ alert, onEdit, onDelete }: AlertCardProps) => {
  const stock = getStockById(alert.stockId);

  if (!stock) return null;

  // Format alert details based on type
  const getAlertDetails = () => {
    switch (alert.type) {
      case "price":
        return `Price ${alert.condition} $${alert.threshold}`;
      case "volume":
        return "Volume alert";
      case "news":
        return "News alert";
      default:
        return alert.type;
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 border-l-[3px] hover:shadow-md transition-shadow"
      style={{ borderLeftColor: alert.groupColor || "#6B7280" }}
    >
      {/* Header: Stock Info */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{stock.id}</h3>
            {alert.aiEnabled && (
              <div className="flex items-center gap-1 bg-slate-800 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                <Bot className="w-4 h-5" />
                <span>AI</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{stock.name}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Edit alert"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete alert"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Alert Details */}
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Type:</span> {getAlertDetails()}
        </p>

        {/* Group Badge */}
        {alert.group && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Group:</span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: alert.groupColor || "#6B7280" }}
            >
              <span
                className="w-2 h-2 rounded-full bg-white/30"
                aria-hidden="true"
              />
              {alert.group.replace("group-", "")}
            </span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span
          className={`text-xs font-medium ${
            alert.enabled ? "text-green-600" : "text-gray-400"
          }`}
        >
          {alert.enabled ? "● Active" : "○ Inactive"}
        </span>
      </div>
    </div>
  );
};

export default AlertCard;
