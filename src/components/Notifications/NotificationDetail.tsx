import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, CheckCircle, Sparkles, TrendingUp, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Notification } from "../../types";
import useStore from "../../store/useStore";
import StockAvatar from "../Shared/StockAvatar";

interface NotificationDetailProps {
  notification: Notification;
  onClose: () => void;
}

/**
 * NotificationDetail - Full notification detail modal
 * Features:
 * - Full stock info, title, message
 * - AI summary section with trust indicator
 * - Formatted timestamp
 * - Group badge
 * - Underlined financial terms (visual only)
 * - Mark as Read / Dismiss actions
 */
const NotificationDetail = ({
  notification,
  onClose,
}: NotificationDetailProps) => {
  const { dismissNotification, markAsRead } = useStore();
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [fundamentalOpen, setFundamentalOpen] = useState(false);

  const handleDismiss = () => {
    dismissNotification(notification.id);
    onClose();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
    onClose();
  };

  // Check if this is a stock notification (not MARKET or ALERT)
  const isStockNotification = !['MARKET', 'ALERT'].includes(notification.stockId);

  // Underline potential financial terms (simple regex)
  const formatTextWithUnderlines = (text: string) => {
    const financialTerms =
      /\b(earnings|guidance|revenue|profit|loss|shares|stock|market|growth|partnership|facility|analyst|investor|delivery|target)\b/gi;
    const parts = text.split(financialTerms);

    return parts.map((part, index) => {
      if (part.match(financialTerms)) {
        return (
          <span
            key={index}
            className="underline decoration-dotted decoration-gray-400"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getTechnicalData = (stockId: string) => {
    const data: Record<string, {
      rsi: number;
      macd: { value: number; signal: number; trend: string };
      ma50: number;
      ma200: number;
      support: number;
      resistance: number;
      trend: string;
    }> = {
      NVDA: {
        rsi: 68.5,
        macd: { value: 2.34, signal: 1.89, trend: 'bullish' },
        ma50: 148.20,
        ma200: 142.50,
        support: 145.00,
        resistance: 160.00,
        trend: 'uptrend',
      },
      TSLA: {
        rsi: 42.3,
        macd: { value: -1.12, signal: -0.98, trend: 'bearish' },
        ma50: 248.75,
        ma200: 252.30,
        support: 235.00,
        resistance: 255.00,
        trend: 'downtrend',
      },
      AAPL: {
        rsi: 51.8,
        macd: { value: 0.12, signal: 0.15, trend: 'neutral' },
        ma50: 165.00,
        ma200: 164.80,
        support: 163.00,
        resistance: 168.00,
        trend: 'sideways',
      },
    };
    return data[stockId] || data.AAPL;
  };

  const getFundamentalData = (stockId: string) => {
    const data: Record<string, {
      sentiment: string;
      sentimentScore: number;
      catalysts: string[];
      socialMentions: string;
    }> = {
      NVDA: {
        sentiment: 'Very Positive',
        sentimentScore: 85,
        catalysts: ['AI chip demand surge', 'Strong Q4 earnings beat', 'New data center partnerships'],
        socialMentions: '+34% vs last week',
      },
      TSLA: {
        sentiment: 'Neutral',
        sentimentScore: 48,
        catalysts: ['Production delays reported', 'EV competition increasing', 'China expansion plans'],
        socialMentions: '-12% vs last week',
      },
      AAPL: {
        sentiment: 'Positive',
        sentimentScore: 62,
        catalysts: ['iPhone 15 sales steady', 'Services revenue growth', 'India market expansion'],
        socialMentions: '+8% vs last week',
      },
    };
    return data[stockId] || data.AAPL;
  };

  const technicalData = isStockNotification ? getTechnicalData(notification.stockId) : null;
  const fundamentalData = isStockNotification ? getFundamentalData(notification.stockId) : null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
        />

        {/* Modal */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80%] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between z-10">
            <div className="flex items-center gap-3 flex-1">
              <StockAvatar
                symbol={notification.stockId}
                name={notification.stockName}
                size="sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {notification.stockName}
                  </h2>
                  {notification.group && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        backgroundColor: notification.groupColor || "#6B7280",
                      }}
                    >
                      {notification.group}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(notification.timestamp), "PPpp")}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Message - for non-AI notifications */}
            {notification.message && !notification.aiSummary && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-800 leading-relaxed text-sm">
                  {notification.message}
                </p>
              </div>
            )}

            {/* AI Summary */}
            {notification.aiSummary && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-semibold text-purple-900">
                    AI Summary
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 mb-3 text-xs text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  <span className="font-medium">
                    Based on {isStockNotification ? '5' : '3'} verified sources
                  </span>
                </div>

                <p className="text-gray-800 leading-relaxed text-sm">
                  {isStockNotification
                    ? `Combined analysis shows ${fundamentalData?.sentiment.toLowerCase()} market sentiment with ${technicalData?.trend} technical pattern. ${notification.aiSummary}`
                    : formatTextWithUnderlines(notification.aiSummary)
                  }
                </p>
              </div>
            )}

            {/* Technical Analysis Section - Only for stock notifications */}
            {isStockNotification && technicalData && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <button
                  onClick={() => setTechnicalOpen(!technicalOpen)}
                  className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-900">
                      Technical Analysis
                    </h4>
                  </div>
                  {technicalOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  )}
                </button>

                {technicalOpen && (
                  <div className="mt-4">

                {/* Fake Mini Chart */}
                <div className="bg-white rounded-lg p-3 mb-4">
                  <svg width="100%" height="80" viewBox="0 0 300 80" className="text-blue-600">
                    <polyline
                      points={
                        technicalData.trend === 'uptrend'
                          ? "0,60 50,55 100,50 150,45 200,35 250,30 300,25"
                          : technicalData.trend === 'downtrend'
                          ? "0,20 50,25 100,35 150,40 200,50 250,55 300,60"
                          : "0,40 50,45 100,40 150,42 200,38 250,40 300,42"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points={
                        technicalData.trend === 'uptrend'
                          ? "0,60 50,55 100,50 150,45 200,35 250,30 300,25"
                          : technicalData.trend === 'downtrend'
                          ? "0,20 50,25 100,35 150,40 200,50 250,55 300,60"
                          : "0,40 50,45 100,40 150,42 200,38 250,40 300,42"
                      }
                      fill="url(#gradient)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Key Indicators Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">RSI (14)</p>
                    <p className="font-semibold text-gray-900">{technicalData.rsi}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {technicalData.rsi > 70 ? 'Overbought' : technicalData.rsi < 30 ? 'Oversold' : 'Neutral'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">MACD</p>
                    <p className="font-semibold text-gray-900">{technicalData.macd.value.toFixed(2)}</p>
                    <p className={`text-xs mt-1 ${
                      technicalData.macd.trend === 'bullish' ? 'text-green-600' :
                      technicalData.macd.trend === 'bearish' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {technicalData.macd.trend}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">MA (50)</p>
                    <p className="font-semibold text-gray-900">${technicalData.ma50.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">MA (200)</p>
                    <p className="font-semibold text-gray-900">${technicalData.ma200.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Support: <span className="font-medium">${technicalData.support.toFixed(2)}</span></span>
                    <span>Resistance: <span className="font-medium">${technicalData.resistance.toFixed(2)}</span></span>
                  </div>
                </div>
                  </div>
                )}
              </div>
            )}

            {/* Fundamental Analysis Section - Only for stock notifications */}
            {isStockNotification && fundamentalData && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <button
                  onClick={() => setFundamentalOpen(!fundamentalOpen)}
                  className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-900">
                      Fundamental Analysis
                    </h4>
                  </div>
                  {fundamentalOpen ? (
                    <ChevronUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  )}
                </button>

                {fundamentalOpen && (
                  <div className="mt-4">

                {/* Social Sentiment */}
                <div className="bg-white rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Social Sentiment</p>
                    <p className={`text-xs font-medium ${
                      fundamentalData.sentimentScore > 60 ? 'text-green-600' :
                      fundamentalData.sentimentScore < 40 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {fundamentalData.sentiment}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        fundamentalData.sentimentScore > 60 ? 'bg-green-500' :
                        fundamentalData.sentimentScore < 40 ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${fundamentalData.sentimentScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Mentions: <span className="font-medium">{fundamentalData.socialMentions}</span>
                  </p>
                </div>

                {/* Recent Catalysts */}
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Recent Catalysts</p>
                  <ul className="space-y-1.5">
                    {fundamentalData.catalysts.map((catalyst: string, idx: number) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Dismiss
            </button>
            {!notification.read && (
              <button
                onClick={handleMarkAsRead}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mark as Read
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDetail;
