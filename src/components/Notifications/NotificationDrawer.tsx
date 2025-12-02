import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import NotificationCard from './NotificationCard';
import NotificationDetail from './NotificationDetail';
import { Notification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NotificationDrawer - Slide-up drawer showing recent notifications
 * Features:
 * - Shows max 3 most recent notifications
 * - Slide-up animation from bottom
 * - Semi-transparent backdrop
 * - Scrollable notification list
 */
const NotificationDrawer = ({ isOpen, onClose }: NotificationDrawerProps) => {
  const { notifications } = useStore();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Get most recent 3 notifications
  const recentNotifications = notifications.slice(0, 3);

  const handleCardClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  // Animation variants - slide from top down
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { y: '-100%' },
    visible: {
      y: 0,
      transition: { type: 'spring' as const, damping: 30, stiffness: 300 }
    },
    exit: {
      y: '-100%',
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
              className="absolute inset-0 bg-black/50 z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-0 left-0 right-0 bg-white rounded-b-3xl shadow-2xl z-50 max-h-[70%] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4">
                {recentNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Test an alert to see notifications
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleCardClick(notification)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetail notification={selectedNotification} onClose={handleCloseDetail} />
      )}
    </>
  );
};

export default NotificationDrawer;
