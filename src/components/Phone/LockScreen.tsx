import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Activity,
  TriangleAlert,
  OctagonAlert,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react";

type PortfolioState =
  | {
      type: "monitoring";
      header: string;
      portfolioChange: number;
      portfolioValue: string;
    }
  | {
      type: "single";
      header: string;
      ticker: string;
      change: number;
      price: string;
      reason: string;
      portfolioChange: number;
      portfolioValue: string;
    }
  | {
      type: "multi";
      header: string;
      stocks: {
        ticker: string;
        change: number;
        price: string;
        reason: string;
      }[];
      portfolioChange: number;
      portfolioValue: string;
    }
  | {
      type: "aggregator";
      header: string;
    }
  | {
      type: "portfolio";
      header: string;
      change: number;
      reason: string;
      portfolioValue: string;
      best: {
        ticker: string;
        change: number;
      };
      worst: {
        ticker: string;
        change: number;
      };
    };

const tickerLogos: Record<string, string> = {
  GOOGL: "/google.svg",
  TSLA: "/tesla.svg",
  AAPL: "/apple.svg",
  NVDA: "/nvidia.svg",
};

type AggregatedNotification = {
  id: string;
  title: string;
  tag: string;
  timeAgo: string;
  sourcesLabel: string;
};

const aggregatedNotifications: AggregatedNotification[] = [
  {
    id: "agg-1",
    title: "Tesla Beats Q3 Earnings",
    tag: "Earnings",
    timeAgo: "15h ago",
    sourcesLabel: "3 sources",
  },
  {
    id: "agg-2",
    title: "Fed Signals Rate Cut",
    tag: "Markets",
    timeAgo: "12h ago",
    sourcesLabel: "3 sources",
  },
  {
    id: "agg-3",
    title: "Apple Announces New AI Features for iPhone",
    tag: "Tech",
    timeAgo: "12h ago",
    sourcesLabel: "3 sources",
  },
];

const formatPercentage = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const TickerAvatar = ({
  ticker,
  size = "sm",
}: {
  ticker: string;
  size?: "sm" | "md" | "lg";
}) => {
  const logo = tickerLogos[ticker];
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  const imgSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (!logo) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 text-xs font-bold flex items-center justify-center shadow-md`}
      >
        {ticker.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-white border border-slate-200/50 flex items-center justify-center shadow-lg`}
    >
      <img src={logo} alt={`${ticker} logo`} className={imgSizeClasses[size]} />
    </div>
  );
};

const LockScreen = () => {
  const navigate = useNavigate();
  const [stateIndex, setStateIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Define 4 portfolio states (iOS Live Activity style)
  const portfolioStates: PortfolioState[] = [
    {
      type: "aggregator",
      header: "Smart Notification Feed",
    },
    {
      type: "monitoring",
      header: "Portfolio Health",
      portfolioChange: 0.3,
      portfolioValue: "$40,788.75",
    },
    {
      type: "portfolio",
      header: "Portfolio Alert",
      change: -5.6,
      reason: "Market wide selloff",
      portfolioValue: "$38,275.29",
      best: {
        ticker: "AAPL",
        change: 1.9,
      },
      worst: {
        ticker: "GOOGL",
        change: -14.1,
      },
    },
    {
      type: "single",
      header: "GOOGL in portfolio",
      ticker: "GOOGL",
      change: -10.3,
      price: "$150.09",
      reason: "Missed quarterly earnings.",
      portfolioChange: -2.5,
      portfolioValue: "$9,850.12",
    },
    // {
    //   type: "multi",
    //   header: "High Volatility",
    //   stocks: [
    //     {
    //       ticker: "GOOGL",
    //       change: -14.4,
    //       price: "$130.80",
    //       reason: "antitrust ruling",
    //     },
    //     {
    //       ticker: "TSLA",
    //       change: -12.5,
    //       price: "$225.64",
    //       reason: "delivery miss",
    //     },
    //   ],
    //   portfolioChange: -3.9,
    //   portfolioValue: "$38,017.40",
    // },
  ];

  const currentState = portfolioStates[stateIndex];

  const goToPrevious = () => {
    setDirection(-1);
    setStateIndex((prev) =>
      prev === 0 ? portfolioStates.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setStateIndex((prev) => (prev + 1) % portfolioStates.length);
  };

  const handleUnlock = () => {
    navigate("/home");
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex flex-col items-center justify-between p-6">
      {/* Time Display */}
      <div className="text-center mt-10 mb-5">
        <div className="text-white text-7xl font-extralight tracking-tight">
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
        <div className="text-white/70 text-lg font-light mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Live Activity Widget - Modern iOS Style */}
      <div className="w-full flex items-center justify-center relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute -left-2  z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute -right-2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stateIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`rounded-[32px] p-6 ${
              currentState.type === "aggregator"
                ? "w-11/12 max-w-xl"
                : "w-10/12 max-w-lg bg-white/98 backdrop-blur-xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/60"
            }`}
          >
            {currentState.type === "single" && (
              <>
                {/* Alert Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <TickerAvatar ticker={currentState.ticker} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {currentState.ticker}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                          Alert
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Sharp Price Decrease Detected in {currentState.ticker}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-red-200 p-5 mb-2">
                  <div className="mb-3">
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-[Inter]">
                      {currentState.price}
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center text-red-600">
                        <ArrowDownRight className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-xl font-bold ml-0.5">
                          {formatPercentage(currentState.change)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        Today
                      </span>
                    </div>
                  </div>

                  <div className="relative h-40 bg-white/50 rounded-xl p-3 border border-red-100">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 140"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="35"
                        x2="300"
                        y2="35"
                        stroke="#FECACA"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="70"
                        x2="300"
                        y2="70"
                        stroke="#FECACA"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="105"
                        x2="300"
                        y2="105"
                        stroke="#FECACA"
                        strokeWidth="1"
                      />

                      <path
                        d="M 0 30 L 30 35 L 60 42 L 90 50 L 120 60 L 150 68 L 180 78 L 210 90 L 240 105 L 270 118 L 300 130"
                        fill="none"
                        stroke="url(#gradientRedSingle)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M 0 30 L 30 35 L 60 42 L 90 50 L 120 60 L 150 68 L 180 78 L 210 90 L 240 105 L 270 118 L 300 130 L 300 140 L 0 140 Z"
                        fill="url(#areaGradientRedSingle)"
                      />

                      <defs>
                        <linearGradient
                          id="gradientRedSingle"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                        <linearGradient
                          id="areaGradientRedSingle"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#EF4444"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#EF4444"
                            stopOpacity="0.05"
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[8px] text-red-700 font-medium">
                      <span>9:00</span>
                      <span>10:00</span>
                      <span>11:00</span>
                      <span>12:00</span>
                      <span>1:00</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-2.5">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-blue-700 font-bold">
                        AI Analysis
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-700 leading-snug mb-1.5">
                      {currentState.reason}
                    </p>
                    <button className="text-[9px] text-blue-600 hover:text-blue-700 font-semibold underline">
                      Read more →
                    </button>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-2.5">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">
                        Portfolio Impact
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">
                          Change
                        </span>
                        <span className="text-xs font-bold text-rose-600">
                          {formatPercentage(currentState.portfolioChange)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">Value</span>
                        <span className="text-xs font-bold text-slate-900">
                          {currentState.portfolioValue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentState.type === "monitoring" && (
              <>
                {/* Header with LIVE badge and Eye Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {currentState.header}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                          Live
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Real time portfolio summary
                      </p>
                    </div>
                  </div>

                  {/* Eye Toggle Button */}
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label={
                      balanceVisible ? "Hide balance" : "Show balance"
                    }
                  >
                    {balanceVisible ? (
                      <Eye className="w-5 h-5 text-slate-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Portfolio Chart */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-4">
                  {/* Portfolio Value and Change */}
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-[Inter]">
                      {balanceVisible
                        ? currentState.portfolioValue
                        : "$•••,•••.••"}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-emerald-600">
                        <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-lg font-bold ml-0.5">
                          {balanceVisible
                            ? `$142.50 (${formatPercentage(
                                currentState.portfolioChange
                              )})`
                            : "$•••.•• (•.•%)"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-400">
                        Today
                      </span>
                    </div>
                  </div>

                  {/* Simple Line Chart */}
                  <div className="relative h-52 bg-white/50 rounded-xl p-3 border border-emerald-100">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 200"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="50"
                        x2="300"
                        y2="50"
                        stroke="#D1FAE5"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="100"
                        x2="300"
                        y2="100"
                        stroke="#D1FAE5"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="150"
                        x2="300"
                        y2="150"
                        stroke="#D1FAE5"
                        strokeWidth="0.5"
                      />

                      {/* Chart line - upward trend */}
                      <path
                        d="M 0 175 L 30 170 L 60 163 L 90 155 L 120 145 L 150 137 L 180 125 L 210 113 L 240 97 L 270 80 L 300 63"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Gradient fill under line */}
                      <path
                        d="M 0 175 L 30 170 L 60 163 L 90 155 L 120 145 L 150 137 L 180 125 L 210 113 L 240 97 L 270 80 L 300 63 L 300 200 L 0 200 Z"
                        fill="url(#areaGradient)"
                      />

                      {/* Gradient definitions */}
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                        <linearGradient
                          id="areaGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10B981"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10B981"
                            stopOpacity="0.05"
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Time labels */}
                    <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[8px] text-emerald-700 font-medium">
                      <span>1W</span>
                      <span>1M</span>
                      <span>3M</span>
                      <span>6M</span>
                      <span>1Y</span>
                    </div>
                  </div>
                </div>

                {/* Market Status */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-600 me-5">
                      Market Open
                    </span>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                    <span className="text-xs text-slate-500">
                      Updated just now
                    </span>
                  </div>
                </div>
              </>
            )}

            {currentState.type === "multi" && (
              <>
                {/* Alert Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <TriangleAlert
                        className="w-6 h-6 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {currentState.header}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-orange-400 text-white text-[9px] font-bold uppercase tracking-wider">
                          Multi Stock Alert
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {currentState.stocks.length} stocks are experiencing
                        high volatility
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stock Cards */}
                <div className="space-y-2 mb-4">
                  {currentState.stocks.map((stock) => (
                    <div
                      key={stock.ticker}
                      className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4"
                    >
                      <div className="flex items-center justify-between">
                        {/* Left column: avatar + ticker */}
                        <div className="flex flex-col items-center gap-1 min-w-0">
                          <TickerAvatar ticker={stock.ticker} size="md" />
                          <h4 className="text-base font-bold text-slate-900 truncate">
                            {stock.ticker}
                          </h4>
                        </div>

                        {/* Right column: percent change + price */}
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-extrabold text-rose-600 tracking-tight">
                            {formatPercentage(stock.change)}
                          </span>
                          <span className="text-sm font-bold text-slate-700 mt-1">
                            {stock.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio Summary */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-3">
                    Portfolio Impact
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Total Change
                      </span>
                      <span className="text-base font-bold text-rose-600">
                        {formatPercentage(currentState.portfolioChange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Portfolio Value
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {currentState.portfolioValue}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentState.type === "portfolio" && (
              <>
                {/* Critical Alert Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                      <OctagonAlert
                        className="w-6 h-6 text-white"
                        strokeWidth={3}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {currentState.header}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                          Critical
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Portfolio-wide volatility detected
                      </p>
                    </div>
                  </div>

                  {/* Eye Toggle Button */}
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label={
                      balanceVisible ? "Hide balance" : "Show balance"
                    }
                  >
                    {balanceVisible ? (
                      <Eye className="w-5 h-5 text-slate-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Drawdown Chart */}
                <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-red-200 p-4 mb-3">
                  {/* Portfolio Value and Change */}
                  <div className="mb-2">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-[Inter]">
                      {balanceVisible
                        ? currentState.portfolioValue
                        : "$•••,•••.••"}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-red-600">
                        <ArrowDownRight className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-base font-bold ml-0.5">
                          {balanceVisible
                            ? `$2,513.46 (${formatPercentage(
                                currentState.change
                              )})`
                            : "$•••.•• (•.•%)"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        Today
                      </span>
                    </div>
                  </div>

                  {/* Downward Chart */}
                  <div className="relative h-34 bg-white/50 rounded-xl p-2 border border-red-100">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 140"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="35"
                        x2="300"
                        y2="35"
                        stroke="#FECACA"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="70"
                        x2="300"
                        y2="70"
                        stroke="#FECACA"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="105"
                        x2="300"
                        y2="105"
                        stroke="#FECACA"
                        strokeWidth="0.5"
                      />

                      {/* Chart line - downward trend */}
                      <path
                        d="M 0 30 L 30 35 L 60 42 L 90 50 L 120 60 L 150 68 L 180 78 L 210 90 L 240 105 L 270 118 L 300 130"
                        fill="none"
                        stroke="url(#gradientRed)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Gradient fill under line */}
                      <path
                        d="M 0 30 L 30 35 L 60 42 L 90 50 L 120 60 L 150 68 L 180 78 L 210 90 L 240 105 L 270 118 L 300 130 L 300 140 L 0 140 Z"
                        fill="url(#areaGradientRed)"
                      />

                      {/* Gradient definitions */}
                      <defs>
                        <linearGradient
                          id="gradientRed"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                        <linearGradient
                          id="areaGradientRed"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#EF4444"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#EF4444"
                            stopOpacity="0.05"
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Time labels */}
                    <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[8px] text-red-700 font-medium">
                      <span>1W</span>
                      <span>1M</span>
                      <span>3M</span>
                      <span>6M</span>
                      <span>1Y</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary & Worst Performer */}
                <div className="grid grid-cols-2 gap-2">
                  {/* AI Summary */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-2.5">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-blue-700 font-bold">
                        AI Analysis
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug mb-1.5">
                      {currentState.reason} causing broad market decline.
                    </p>
                    <button className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold underline">
                      Read more →
                    </button>
                  </div>

                  {/* Worst Performer */}
                  <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 p-3">
                    {/* Header */}
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-rose-700 font-bold">
                        Worst
                      </span>
                      <ArrowDownRight
                        className="w-3 h-3 text-rose-600"
                        strokeWidth={3}
                      />
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <TickerAvatar
                        ticker={currentState.worst.ticker}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {currentState.worst.ticker}
                        </p>
                        <p className="text-base font-black text-rose-600 tracking-tight">
                          {formatPercentage(currentState.worst.change)}
                        </p>
                      </div>
                    </div>

                    {/* Trade Now Button */}
                    <button className="text-[10px] text-red-600 hover:text-red-700 font-semibold underline text-left">
                      Trade Now →
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentState.type === "aggregator" && (
              <>
                <div className="space-y-4">
                  {aggregatedNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="w-full bg-white/95 backdrop-blur-xl rounded-3xl px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.4)] border border-white/40 flex items-start justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            {/* Badge - Left */}
                            <span className="px-3 py-1 rounded-full bg-slate-900 text-[12px] font-semibold text-slate-50">
                              {item.tag}
                            </span>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Logos - Center */}
                            <div className="flex items-center gap-1.5">
                              {/* Yahoo Finance */}
                              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                                <img
                                  src="/yahoo-symbol.svg"
                                  alt="Yahoo Finance"
                                  className="w-4 h-4"
                                />
                              </div>
                              {/* Bloomberg */}
                              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                                <img
                                  src="/bloomberg.svg"
                                  alt="Bloomberg"
                                  className="w-4 h-4"
                                />
                              </div>
                              {/* Robinhood */}
                              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden shadow-md">
                                <img
                                  src="/robinhood.svg"
                                  alt="Robinhood"
                                  className="w-4 h-4"
                                />
                              </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Sources - Right */}
                            <span className="text-[12px] ml-11 text-slate-600 font-medium whitespace-nowrap">
                              {item.sourcesLabel}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <button className="text-[12px] text-slate-500 hover:text-slate-700 font-semibold">
                              Read more →
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="ml-10 text-[12px] text-slate-500 font-medium whitespace-nowrap">
                        {item.timeAgo}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Page Indicator */}
            <div
              className={`mt-5 pt-4 ${
                currentState.type === "aggregator"
                  ? ""
                  : "border-t border-slate-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {portfolioStates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > stateIndex ? 1 : -1);
                      setStateIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentState.type === "aggregator"
                        ? index === stateIndex
                          ? "w-8 bg-gradient-to-r from-white/80 to-white/100"
                          : "w-2 bg-white/40 hover:bg-white/60"
                        : index === stateIndex
                        ? "w-8 bg-gradient-to-r from-slate-400 to-slate-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to widget ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Unlock Button */}
      <div className="mb-10 mt-3">
        <button
          onClick={handleUnlock}
          className="group relative bg-white/15 backdrop-blur-lg text-white px-6 py-2 rounded-[20px] border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 text-base font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-2"
        >
          {/* Locked icon (default) */}
          <Lock className="w-5 h-5 transition-opacity duration-300 group-hover:opacity-0" />

          {/* Unlocked icon (hover) */}
          <Unlock className="w-5 h-5 absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

          <span className="relative z-10">Unlock</span>

          <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
