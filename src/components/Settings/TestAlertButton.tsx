import { TestTube } from 'lucide-react';
import { Alert } from '../../types';

interface TestAlertButtonProps {
  alert: Alert;
  onTest: (alertId: string) => void;
}

/**
 * TestAlertButton - Triggers a test notification for an alert
 * Features:
 * - Calls testAlert action from store
 * - Visual feedback on click
 * - Small, compact button design
 */
const TestAlertButton = ({ alert, onTest }: TestAlertButtonProps) => {
  const handleTest = () => {
    onTest(alert.id);
  };

  return (
    <button
      onClick={handleTest}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
      aria-label={`Test ${alert.stockId} alert`}
    >
      <TestTube className="w-4 h-4" />
      <span>Test</span>
    </button>
  );
};

export default TestAlertButton;
