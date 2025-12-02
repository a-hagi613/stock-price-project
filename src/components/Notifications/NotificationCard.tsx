import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { Notification } from "../../types";
import useStore from "../../store/useStore";
import StockAvatar from "../Shared/StockAvatar";

interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
}

/**
 * NotificationCard - Individual notification in drawer
 * Features:
 * - Stock name, title, message (truncated)
 * - Timestamp (relative format)
 * - Group badge with color
 * - Unread indicator
 * - Dismiss button
 * - Click to expand (opens detail modal)
 */
const NotificationCard = ({ notification, onClick }: NotificationCardProps) => {
  const { dismissNotification } = useStore();

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when dismissing
    dismissNotification(notification.id);
  };

  // Card animation
  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClick}
      className={`
        bg-white rounded-lg p-4 border cursor-pointer
        hover:shadow-md transition-shadow
        ${
          notification.read
            ? "border-gray-200"
            : "border-blue-400 bg-blue-50/30"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <StockAvatar
            symbol={notification.stockId}
            name={notification.stockName}
            size="sm"
          />
          {!notification.read && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Stock Name & Group */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 text-sm">
              {notification.stockName}
            </span>
            {notification.group && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{
                  backgroundColor: notification.groupColor || "#6B7280",
                }}
              >
                {notification.group}
              </span>
            )}
            {notification.aiSummary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {notification.title}
          </h3>

          {/* Message (truncated) */}
          <p className="text-gray-700 text-xs line-clamp-2 mb-2">
            {notification.aiSummary || notification.message}
          </p>

          {/* Timestamp */}
          <p className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {/* Expand Icon */}
          <ChevronRight className="w-4 h-4 text-gray-400" />

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
