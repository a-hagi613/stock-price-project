import { useState } from "react";
import { Preferences, AggregatorInterval } from "../../types";
import Toggle from "../Shared/Toggle";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PreferencesPanelProps {
  preferences: Preferences;
  onUpdate: (updates: Partial<Preferences>) => void;
  groupTags?: string[];
}

const PreferencesPanel = ({ preferences, onUpdate }: PreferencesPanelProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Manage your alert settings and preferences
        </p>
      </div>

      {/* All Settings in One List */}
      <div className="space-y-4">
        {/* AI Summaries */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              AI-Powered Smart Alerts
            </p>
            <p className="text-xs text-gray-500">
              Get AI-generated responses with your alerts
            </p>
          </div>
          <Toggle
            value={preferences.aiEnabled}
            onChange={(aiEnabled) => onUpdate({ aiEnabled })}
            label=""
          />
        </div>

        {/* Aggregator */}
        <div className="flex items-center justify-between py-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              News Aggregator
            </p>
            <p className="text-xs text-gray-500">
              Group multiple alerts into digest summaries
            </p>
          </div>
          <Toggle
            value={preferences.aggregator}
            onChange={(aggregator) => onUpdate({ aggregator })}
            label=""
          />
        </div>

        {/* News Sources */}
        <div className="py-3 border-b border-gray-100">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-900 mb-1">
              News Sources
            </p>
            <p className="text-xs text-gray-500">
              Select the news sources you want to receive alerts from
            </p>
          </div>
          <NewsSourcesDropdown
            selectedSources={preferences.newsSources || []}
            onChange={(newsSources) => onUpdate({ newsSources })}
          />
        </div>

        {/* Notification Aggregator Interval */}
        <div className="py-3 border-b border-gray-100">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-900 mb-1">
              News Aggregator Interval
            </p>
            <p className="text-xs text-gray-500">
              Choose how often you receive aggregated news notifications
            </p>
          </div>
          <AggregatorIntervalSelector
            value={preferences.aggregatorInterval || "daily"}
            onChange={(aggregatorInterval) => onUpdate({ aggregatorInterval })}
          />
        </div>

        {/* Quiet Hours */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Quiet Hours
            </p>
            <p className="text-xs text-gray-500">
              Deactivate alerts when market is closed (5 PM - 9 AM)
            </p>
          </div>
          <Toggle
            value={preferences.quietHours.enabled}
            onChange={(enabled) =>
              onUpdate({ quietHours: { ...preferences.quietHours, enabled } })
            }
            label=""
          />
        </div>

        {/* Location Based */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Location-Based Alerts
            </p>
            <p className="text-xs text-gray-500">
              Adjust alerts based on your location (visual only)
            </p>
          </div>
          <Toggle
            value={preferences.locationBased}
            onChange={(locationBased) => onUpdate({ locationBased })}
            label=""
          />
        </div>
      </div>
    </div>
  );
};

// News Sources Dropdown Component
const newsSourceOptions = [
  { id: "yahoo", name: "Yahoo Finance", icon: "Y" },
  { id: "bloomberg", name: "Bloomberg", icon: "B" },
  { id: "robinhood", name: "Robinhood", icon: "R" },
  { id: "cnbc", name: "CNBC", icon: "C" },
  { id: "marketwatch", name: "MarketWatch", icon: "MW" },
  { id: "reuters", name: "Reuters", icon: "R" },
];

interface NewsSourcesDropdownProps {
  selectedSources: string[];
  onChange: (sources: string[]) => void;
}

const NewsSourcesDropdown = ({
  selectedSources,
  onChange,
}: NewsSourcesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure selectedSources is always an array
  const safeSelectedSources = selectedSources || [];

  const toggleSource = (sourceId: string) => {
    if (safeSelectedSources.includes(sourceId)) {
      onChange(safeSelectedSources.filter((id) => id !== sourceId));
    } else {
      onChange([...safeSelectedSources, sourceId]);
    }
  };

  const selectedCount = safeSelectedSources.length;
  const selectedNames = newsSourceOptions
    .filter((opt) => safeSelectedSources.includes(opt.id))
    .map((opt) => opt.name)
    .join(", ");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm text-gray-700">
          {selectedCount > 0
            ? `${selectedCount} source${selectedCount > 1 ? "s" : ""} selected`
            : "Select news sources"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {newsSourceOptions.map((source) => {
              const isSelected = safeSelectedSources.includes(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{source.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedCount > 0 && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-1">
          {selectedNames}
        </p>
      )}
    </div>
  );
};

// Aggregator Interval Selector Component
interface AggregatorIntervalSelectorProps {
  value: AggregatorInterval;
  onChange: (value: AggregatorInterval) => void;
}

const AggregatorIntervalSelector = ({
  value,
  onChange,
}: AggregatorIntervalSelectorProps) => {
  const intervals: { value: AggregatorInterval; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="flex gap-2">
      {intervals.map((interval) => (
        <button
          key={interval.value}
          onClick={() => onChange(interval.value)}
          className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
            value === interval.value
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          {interval.label}
        </button>
      ))}
    </div>
  );
};

export default PreferencesPanel;
