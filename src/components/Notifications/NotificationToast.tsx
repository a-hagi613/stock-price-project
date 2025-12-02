import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Notification, NotificationType } from "../../types";
import StockAvatar from "../Shared/StockAvatar";
import { getStockById } from "../../data/mockData";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  onReadMore?: () => void;
}

interface StyleSpec {
  gradient: string;
  border: string;
  pill: string;
  button: string;
  accent: string;
  action: string;
}

const typeStyles: Record<NotificationType, StyleSpec> = {
  positive: {
    gradient: "from-emerald-50 via-white to-white",
    border: "border-emerald-100",
    pill: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-500 text-white hover:bg-emerald-600",
    accent: "text-emerald-600",
    action: "Buy Now",
  },
  negative: {
    gradient: "from-rose-50 via-white to-white",
    border: "border-rose-100",
    pill: "bg-rose-100 text-rose-700",
    button: "bg-rose-500 text-white hover:bg-rose-600",
    accent: "text-rose-600",
    action: "Sell Now",
  },
  neutral: {
    gradient: "from-slate-50 via-white to-white",
    border: "border-slate-100",
    pill: "bg-slate-100 text-slate-700",
    button:
      "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50",
    accent: "text-slate-600",
    action: "Hold",
  },
};

const getCustomStyles = (stockId: string, group?: string) => {
  if (stockId === "MARKET" || group === "News") {
    return {
      gradient: "from-blue-50 via-white to-white",
      border: "border-blue-100",
      pill: "bg-blue-100 text-blue-700",
      button: "bg-blue-500 text-white hover:bg-blue-600",
      accent: "text-blue-600",
      action: "Read More",
    };
  }
  if (stockId === "ALERT" || group === "Alert") {
    return {
      gradient: "from-amber-50 via-white to-white",
      border: "border-amber-100",
      pill: "bg-amber-100 text-amber-700",
      button: "bg-amber-500 text-white hover:bg-amber-600",
      accent: "text-amber-600",
      action: "Hedge Portfolio",
    };
  }
  return null;
};

const NotificationToast = ({
  notification,
  onDismiss,
  onReadMore,
}: NotificationToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const toastVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 320, damping: 32 },
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const customStyle = getCustomStyles(notification.stockId, notification.group);
  const style =
    customStyle ?? typeStyles[notification.type] ?? typeStyles.neutral;

  const timestamp = "1m ago";
  const stock = getStockById(notification.stockId);
  const formattedTitle = stock
    ? stock.change === 0
      ? `${notification.stockId} is stable at $${stock.price.toFixed(2)}`
      : `${notification.stockId} is $${stock.price.toFixed(2)} ${
          stock.change >= 0 ? "up" : "down"
        } ${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(1)}%`
    : notification.title;

  const changeColor = customStyle
    ? style.accent
    : notification.type === "positive"
    ? "text-emerald-600"
    : notification.type === "negative"
    ? "text-rose-600"
    : "text-slate-600";

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`mt-6 absolute top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[420px] bg-linear-to-br ${style.gradient} border ${style.border} rounded-3xl shadow-xl z-50`}
    >
      <div className="p-5 relative">
        {/* Timestamp - top right under X */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
          <span
            className={`text-xs ${changeColor} whitespace-nowrap font-medium`}
          >
            {timestamp}
          </span>
        </div>

        <div className="flex items-start gap-4 pr-20">
          <StockAvatar
            symbol={notification.stockId}
            name={notification.stockName}
          />
          <div className="flex-1 min-w-0">
            {/* Title only - one line with stock name, price, and change */}
            <p
              className={`text-base font-semibold mt-2 ${changeColor} leading-tight`}
            >
              {formattedTitle}
            </p>
          </div>
        </div>

        {notification.message && !notification.aiSummary && (
          <p className="text-xs text-slate-600 leading-relaxed mt-3">
            {notification.message}
          </p>
        )}
        {notification.aiSummary && (
          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            {notification.aiSummary}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {notification.aiSummary && (
              <span className={`px-2 py-0.5 rounded-full ${style.pill}`}>
                AI Smart Suggestion
              </span>
            )}
          </div>
          <button
            onClick={notification.aiSummary ? undefined : onReadMore}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              style.button
            } ${notification.aiSummary ? "cursor-default" : "cursor-pointer"}`}
          >
            {notification.aiSummary ? style.action : "View Stock"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationToast;
