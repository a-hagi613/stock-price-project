import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useStore from "../../store/useStore";
import AlertCard from "./AlertCard";
import AlertForm from "./AlertForm";
import GroupManager from "./GroupManager";
import PreferencesPanel from "./PreferencesPanel";
import NotificationDrawer from "../Notifications/NotificationDrawer";
import { Alert, Notification, StockGroup } from "../../types";
import { playNotificationSound } from "../../utils/sounds";
type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  actionLabel: string;
  actionClass: string;
  accentClass: string;
  layout: "compact" | "detailed";
  indicatorColor: string;
  triggerLabel: string;
  notification: Omit<Notification, "id" | "timestamp" | "read">;
  badge?: {
    label: string;
    className: string;
  };
};

const aiSummaryScenarios: Scenario[] = [
  {
    id: "test-nvda-summary",
    title: "Example AI Powered Market Summary Notification",
    subtitle:
      "Strong earnings beat expectations with data center revenue up 94% YoY, driven by AI chip demand.",
    timeLabel: "2h",
    actionLabel: "Read more",
    actionClass: "text-indigo-600 hover:text-indigo-700",
    accentClass: "text-slate-600",
    layout: "detailed",
    indicatorColor: "#22C55E",
    triggerLabel: "Test AI summary for NVIDIA",
    notification: {
      stockId: "NVDA",
      stockName: "NVIDIA Corporation",
      title: "Market Summary · NVIDIA",
      message:
        "Strong earnings beat expectations with data center revenue up 94% YoY, driven by AI chip demand.",
      aiSummary:
        "Guidance lifted for the next quarter as cloud partners roll out new GPU clusters.",
      type: "positive",
      group: "Market Summary",
      groupColor: "#22C55E",
    },
  },
  {
    id: "test-tsla-sentiment",
    title: "Example AI Powered Sentiment Analysis Notification",
    subtitle:
      "Social media mentions down 23% following production delays and increased competition in EV market.",
    timeLabel: "1h",
    actionLabel: "Read more",
    actionClass: "text-indigo-600 hover:text-indigo-700",
    accentClass: "text-slate-600",
    layout: "detailed",
    badge: {
      label: "Negative",
      className: "bg-rose-100 text-rose-700",
    },
    indicatorColor: "#F87171",
    triggerLabel: "Test AI summary for Tesla",
    notification: {
      stockId: "TSLA",
      stockName: "Tesla, Inc.",
      title: "Sentiment Update · TSLA",
      message:
        "Social media mentions down 23% following production delays and increased competition in EV market.",
      aiSummary:
        "Community chatter highlights delivery concerns and margin compression risk.",
      type: "negative",
      group: "Sentiment",
      groupColor: "#F87171",
    },
  },
  {
    id: "test-bsw-market",
    title: "Example Black Swan Warning Notification",
    subtitle:
      "Sudden spike in VIX +87%, circuit breakers triggered across multiple exchanges. Unprecedented institutional outflows detected. Major liquidity event unfolding.",
    timeLabel: "now",
    actionLabel: "Stay Alert",
    actionClass: "bg-amber-500 hover:bg-amber-600 text-white",
    accentClass: "text-slate-600",
    layout: "detailed",
    indicatorColor: "#F59E0B",
    triggerLabel: "Test market warning",
    notification: {
      stockId: "MARKET",
      stockName: "Extreme Market Volatility",
      title: "Black Swan Warning",
      message:
        "Sudden spike in VIX +87%, circuit breakers triggered across multiple exchanges. Major liquidity event unfolding.",
      aiSummary:
        "Liquidity stress and volatility regime shift detected across macro indicators.",
      type: "negative",
      group: "Macro Alert",
      groupColor: "#F59E0B",
    },
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    alerts,
    groups,
    preferences,
    deleteAlert,
    addAlert,
    addGroup,
    deleteGroup,
    addStockToGroup,
    addNotification,
    updatePreferences,
    resetAll,
  } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Collapsible section states
  const [alertsOpen, setAlertsOpen] = useState(true);
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  const [regularAlertsOpen, setRegularAlertsOpen] = useState(true);
  const [testAlertsOpen, setTestAlertsOpen] = useState(true);
  const [proMode, setProMode] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDeleteAlert = (alertId: string) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      deleteAlert(alertId);
    }
  };

  const handleSaveAlert = (alert: Alert, newGroup?: StockGroup) => {
    if (newGroup) {
      addGroup(newGroup);
    }

    addAlert(alert);

    if (!newGroup && alert.group) {
      addStockToGroup(alert.group, alert.stockId);
    }

    setShowAlertForm(false);
  };

  const handleScenarioTrigger = (
    scenario: Scenario,
    soundType: "nvda" | "tsla" | "aapl" | "news" | "warning"
  ) => {
    playNotificationSound(soundType);
    const timestamp = new Date();
    addNotification({
      ...scenario.notification,
      id: `${scenario.id}-${timestamp.getTime()}`,
      timestamp,
      read: false,
    });
  };

  const handleEditGroup = (groupId: string) => {
    console.log("Edit group:", groupId);
    alert(`Edit functionality for group ${groupId} - Coming soon!`);
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (
      group &&
      window.confirm(
        `Are you sure you want to delete the "${group.name}" group?`
      )
    ) {
      deleteGroup(groupId);
    }
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL alerts and groups? This will reset all preferences to default. This action cannot be undone."
      )
    ) {
      resetAll();
    }
  };

  return (
    <div className="w-full h-full bg-linear-to-br from-slate-50 via-white to-slate-100 overflow-y-auto text-slate-900">
      <div className="bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back to lock screen"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="mt-5 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm">
            <span
              className={`text-sm font-semibold transition-colors ${
                !proMode ? "text-black" : "text-gray-400"
              }`}
            >
              Beginner
            </span>
            <button
              onClick={() => setProMode(!proMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                proMode ? "bg-black" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                  proMode ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors ${
                proMode ? "text-black" : "text-gray-400"
              }`}
            >
              Advanced
            </span>
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Stock Alert Settings
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-8">
        {/* My Alerts Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <h2 className="text-lg font-semibold text-slate-900">Alerts</h2>
              {alertsOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAlertForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
              <button
                onClick={handleResetAll}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {alertsOpen && (
            <>
              {/* Alert Form */}
              {showAlertForm && (
                <div className="mb-4">
                  <AlertForm
                    existingGroups={groups}
                    onSave={handleSaveAlert}
                    onCancel={() => setShowAlertForm(false)}
                  />
                </div>
              )}

              {/* Alerts List */}
              {alerts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                  <p className="text-slate-500 text-sm">
                    No alerts configured yet
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Create your first alert to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onEdit={() => console.log("Edit alert:", alert.id)}
                      onDelete={() => handleDeleteAlert(alert.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Alert Groups Section - Pro Mode Only */}
        {proMode && (
          <section>
            <button
              onClick={() => setGroupsOpen(!groupsOpen)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity mb-3"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Alert Groups
              </h2>
              {groupsOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {groupsOpen && (
              <GroupManager
                groups={groups}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
              />
            )}
          </section>
        )}

        {/* Preferences Section - Pro Mode Only */}
        {proMode && (
          <section>
            <button
              onClick={() => setPreferencesOpen(!preferencesOpen)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity mb-3"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Preferences
              </h2>
              {preferencesOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {preferencesOpen && (
              <PreferencesPanel
                preferences={preferences}
                onUpdate={updatePreferences}
                groupTags={
                  groups.length
                    ? groups.slice(0, 2).map((group) => `#${group.name}`)
                    : undefined
                }
              />
            )}
          </section>
        )}

        {/* Regular Notification Alerts Section */}
        <section>
          <button
            onClick={() => setRegularAlertsOpen(!regularAlertsOpen)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity mb-3"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Regular Notification Alerts
            </h2>
            {regularAlertsOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {regularAlertsOpen && (
            <div className="space-y-3 mb-6">
              {/* NVDA Regular Alert */}
              <button
                onClick={() => {
                  playNotificationSound("nvda");
                  const nvdaNotification: Notification = {
                    id: Date.now().toString(),
                    stockId: "NVDA",
                    stockName: "NVIDIA Corporation",
                    title: "Price Alert Triggered",
                    message: "Your alert notification was triggered.",
                    timestamp: new Date(),
                    type: "positive",
                    group: "Tech",
                    groupColor: "#3B82F6",
                    read: false,
                  };
                  addNotification(nvdaNotification);
                }}
                className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all shadow-sm hover:shadow-md w-full"
              >
                <img src="/nvidia.svg" alt="NVIDIA" className="w-8 h-8" />
                <span className="text-sm font-semibold text-green-800">
                  Test NVDA Alert
                </span>
              </button>

              {/* TSLA Regular Alert */}
              <button
                onClick={() => {
                  playNotificationSound("tsla");
                  const tslaNotification: Notification = {
                    id: Date.now().toString(),
                    stockId: "TSLA",
                    stockName: "Tesla, Inc.",
                    title: "News Alert",
                    message: "Your alert notification was triggered.",
                    timestamp: new Date(),
                    type: "negative",
                    group: "Tech",
                    groupColor: "#3B82F6",
                    read: false,
                  };
                  addNotification(tslaNotification);
                }}
                className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 rounded-xl transition-all shadow-sm hover:shadow-md w-full"
              >
                <img src="/tesla.svg" alt="Tesla" className="w-8 h-8" />
                <span className="text-sm font-semibold text-red-800">
                  Test TSLA Alert
                </span>
              </button>

              {/* AAPL Regular Alert */}
              <button
                onClick={() => {
                  playNotificationSound("aapl");
                  const appleNotification: Notification = {
                    id: Date.now().toString(),
                    stockId: "AAPL",
                    stockName: "Apple Inc.",
                    title: "Price Alert Triggered",
                    message: "Your alert notification was triggered.",
                    timestamp: new Date(),
                    type: "neutral",
                    group: "Growth",
                    groupColor: "#10B981",
                    read: false,
                  };
                  addNotification(appleNotification);
                }}
                className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md w-full"
              >
                <img src="/apple.svg" alt="Apple" className="w-8 h-8" />
                <span className="text-sm font-semibold text-gray-800">
                  Test AAPL Alert
                </span>
              </button>

              {/* Test Alert */}
              {/* <button
                onClick={() => {
                  playNotificationSound("warning");
                  const testNotification: Notification = {
                    id: Date.now().toString(),
                    stockId: "ALERT",
                    stockName: "Test Alert",
                    title: "Unusual Activity Detected",
                    message: "This is a test notification to demonstrate the regular alert system. Click Read More for full details.",
                    timestamp: new Date(),
                    type: "neutral",
                    group: "Alert",
                    groupColor: "#F59E0B",
                    read: false,
                  };
                  addNotification(testNotification);
                }}
                className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-300 rounded-xl transition-all shadow-sm hover:shadow-md w-full"
              >
                <span className="text-3xl">⚠️</span>
                <span className="text-sm font-semibold text-amber-800">
                  Test Alert
                </span>
              </button> */}
            </div>
          )}
        </section>

        {/* Test Notifications Section - Pro Mode Only */}
        {proMode && (
          <section>
            <button
              onClick={() => setTestAlertsOpen(!testAlertsOpen)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity mb-3"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                AI Powered Smart Alerts
              </h2>
              {testAlertsOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {testAlertsOpen && (
              <div className="space-y-8">
                <div>
                  <div className="grid grid-cols-1 gap-3">
                    {/* NVDA Test Button - Green */}
                    <button
                      onClick={() =>
                        handleScenarioTrigger(aiSummaryScenarios[0], "nvda")
                      }
                      className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <img src="/nvidia.svg" alt="NVIDIA" className="w-8 h-8" />
                      <span className="text-sm font-semibold text-green-800">
                        Test NVDA Smart Alert
                      </span>
                    </button>

                    {/* TSLA Test Button - Red */}
                    <button
                      onClick={() =>
                        handleScenarioTrigger(aiSummaryScenarios[1], "tsla")
                      }
                      className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <img src="/tesla.svg" alt="Tesla" className="w-8 h-8" />
                      <span className="text-sm font-semibold text-red-800">
                        Test TSLA Smart Alert
                      </span>
                    </button>

                    {/* AAPL Test Button - Gray */}
                    <button
                      onClick={() => {
                        playNotificationSound("aapl");
                        const appleNotification: Notification = {
                          id: Date.now().toString(),
                          stockId: "AAPL",
                          stockName: "Apple Inc.",
                          title: "Price Alert · AAPL",
                          message: "AAPL is stable at current price levels",
                          aiSummary:
                            "Apple stock showing steady performance with balanced trading volume and minimal volatility.",
                          timestamp: new Date(),
                          type: "neutral",
                          group: "Tech",
                          groupColor: "#6B7280",
                          read: false,
                        };
                        addNotification(appleNotification);
                      }}
                      className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <img src="/apple.svg" alt="Apple" className="w-8 h-8" />
                      <span className="text-sm font-semibold text-gray-800">
                        Test AAPL Smart Alert
                      </span>
                    </button>

                    {/* Market Warning Test Button - Yellow */}
                    <button
                      onClick={() => {
                        playNotificationSound("warning");
                        const warningNotification: Notification = {
                          id: Date.now().toString(),
                          stockId: "ALERT",
                          stockName: "Market Alert",
                          title: "Unusual Activity Detected",
                          message:
                            "High volatility spike detected across multiple sectors.",
                          aiSummary:
                            "AI detected abnormal trading patterns including sudden increase in put options volume and elevated cross-asset correlations. Consider reviewing portfolio risk exposure and hedging strategies.",
                          timestamp: new Date(),
                          type: "negative",
                          group: "Alert",
                          groupColor: "#F59E0B",
                          read: false,
                        };
                        addNotification(warningNotification);
                      }}
                      className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-300 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-3xl">⚠️</span>
                      <span className="text-sm font-semibold text-amber-800">
                        Test Market Warning Smart Alert
                      </span>
                    </button>

                    {/* News Summary Test Button - Blue */}
                    <button
                      onClick={() => {
                        playNotificationSound("news");
                        const newsNotification: Notification = {
                          id: Date.now().toString(),
                          stockId: "MARKET",
                          stockName: "Market News",
                          title: "Daily Market Summary",
                          message:
                            "Markets closed mixed today with tech leading gains while financials lagged.",
                          aiSummary:
                            "S&P 500 up 0.3%, Nasdaq up 0.8%, Dow down 0.1%. Trading volume was above average as investors digested Fed comments and corporate earnings...",
                          timestamp: new Date(),
                          type: "neutral",
                          group: "News",
                          groupColor: "#3B82F6",
                          read: false,
                        };
                        addNotification(newsNotification);
                      }}
                      className="flex items-center gap-3 px-5 py-4 bg-linear-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-3xl">📰</span>
                      <span className="text-sm font-semibold text-blue-800">
                        Test Smart Market/News Summary
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
