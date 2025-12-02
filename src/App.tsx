import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PhoneFrame from './components/Phone/PhoneFrame';
import LockScreen from './components/Phone/LockScreen';
import HomeScreen from './components/Phone/HomeScreen';
import SettingsPage from './components/Settings/SettingsPage';
import NotificationToast from './components/Notifications/NotificationToast';
import NotificationDetail from './components/Notifications/NotificationDetail';
import useStore from './store/useStore';
import { Notification } from './types';

function App() {
  const { notifications } = useStore();
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const newestNotification = notifications[0];
      if (newestNotification.id !== lastNotificationId) {
        const timer = setTimeout(() => {
          setActiveToast(newestNotification);
          setLastNotificationId(newestNotification.id);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, lastNotificationId]);

  const handleDismissToast = () => {
    setActiveToast(null);
  };

  const handleReadMore = () => {
    if (activeToast) {
      setSelectedNotification(activeToast);
      setActiveToast(null);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  return (
    <BrowserRouter>
      <PhoneFrame >
        <div className="relative w-full h-full">
          <Routes>
            <Route path="/" element={<LockScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>

          <AnimatePresence>
            {activeToast && (
              <NotificationToast
                notification={activeToast}
                onDismiss={handleDismissToast}
                onReadMore={handleReadMore}
              />
            )}
          </AnimatePresence>

          {selectedNotification && (
            <NotificationDetail
              notification={selectedNotification}
              onClose={handleCloseDetail}
            />
          )}
        </div>
      </PhoneFrame>
    </BrowserRouter>
  );
}

export default App;
