import { useState } from 'react';
import { Pen, Trash2, Bell, BellOff } from 'lucide-react';
import { StockGroup } from '../../types';
import { getStockById } from '../../data/mockData';

interface GroupManagerProps {
  groups: StockGroup[];
  onEditGroup?: (groupId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
}

/**
 * GroupManager - Displays all alert groups
 * Features:
 * - Group name and color badge
 * - Stock count
 * - List of stocks in group (tickers)
 * - Color-coded visual indicators
 * - Edit and delete buttons for each group
 */
const GroupManager = ({ groups, onEditGroup, onDeleteGroup }: GroupManagerProps) => {
  // Track muted state for each group
  const [mutedGroups, setMutedGroups] = useState<Set<string>>(new Set());

  const toggleMute = (groupId: string) => {
    setMutedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500 text-sm">No groups created yet</p>
        <p className="text-gray-400 text-xs mt-1">Groups will be created when you add alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isMuted = mutedGroups.has(group.id);
        const stockCount = group.stockIds.length;
        const stockNames = group.stockIds
          .map((id) => getStockById(id)?.id)
          .filter(Boolean)
          .join(', ');

        return (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-sm p-4 border-l-[4px] hover:shadow-md transition-shadow"
            style={{ borderLeftColor: group.color }}
          >
            <div className="flex items-start justify-between">
              {/* Group Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Color Badge */}
                  <div
                    className="w-8 h-8 rounded-full shadow-sm"
                    style={{ backgroundColor: group.color }}
                    aria-label={`${group.name} color`}
                  />

                  {/* Group Name */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    #{group.name}
                  </h3>
                </div>

                {/* Stock Details */}
                <div className="ml-11 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{stockCount}</span>{" "}
                    {stockCount === 1 ? "stock" : "stocks"}
                  </p>
                  {stockNames && (
                    <div className="flex flex-wrap gap-2">
                      {group.stockIds.map((stockId) => {
                        const stock = getStockById(stockId);
                        if (!stock) return null;

                        return (
                          <span
                            key={stockId}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {stock.id}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mute, Edit and Delete Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditGroup?.(group.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Edit group"
                >
                  <Pen className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onDeleteGroup?.(group.id)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Delete group"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                <button
                  onClick={() => toggleMute(group.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isMuted
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={isMuted ? "Unmute group" : "Mute group"}
                  title={
                    isMuted ? "Unmute notifications" : "Mute notifications"
                  }
                >
                  {isMuted ? (
                    <BellOff className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Bell className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupManager;
