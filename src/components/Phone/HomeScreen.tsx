import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

/**
 * HomeScreen - iOS-style home screen with single app icon
 * Shows Stock Alerts Settings app that navigates to /settings
 */
const HomeScreen = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="relative w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-white text-sm">
        <span className="font-semibold">
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
        <div className="flex items-center gap-1">
          {/* Signal Icon */}
          <div className="flex gap-[2px]">
            <div className="w-1 h-2 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-4 bg-white rounded-sm"></div>
          </div>
          {/* Battery Icon */}
          <span className="ml-2">100%</span>
        </div>
      </div>

      {/* App Icon Grid */}
      <div className="pt-20 px-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Stock Alerts Settings App Icon */}
          <button
            onClick={handleSettingsClick}
            className="flex flex-col items-center group border-none p-0 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="w-16 h-16 bg-linear-to-br from-sky-300 via-sky-400 to-blue-500 rounded-2xl shadow-[0_10px_25px_rgba(56,189,248,0.35)] flex items-center justify-center group-active:scale-95 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-xs mt-2 text-center leading-tight">
              Stock Alerts
            </span>
          </button>
        </div>
      </div>

      {/* Dock Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default HomeScreen;
