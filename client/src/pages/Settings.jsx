import { useEffect, useState } from "react";

function Settings() {
  // =========================================
  // APPEARANCE
  // =========================================

  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // =========================================
  // NOTIFICATIONS
  // =========================================

  const [studyNotifications, setStudyNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [mockTestNotifications, setMockTestNotifications] = useState(true);
  const [aiNotifications, setAiNotifications] = useState(true);

  // =========================================
  // STUDY & TEST
  // =========================================

  const [autoSubmit, setAutoSubmit] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [confirmSubmit, setConfirmSubmit] = useState(true);
  const [defaultQuestions, setDefaultQuestions] = useState("10");
  const [timerWarning, setTimerWarning] = useState("5");

  // =========================================
  // SOUND
  // =========================================

  const [soundEffects, setSoundEffects] = useState(true);
  const [timerSound, setTimerSound] = useState(true);

  // =========================================
  // PRIVACY
  // =========================================

  const [saveQuizHistory, setSaveQuizHistory] = useState(true);
  const [saveRecentSearches, setSaveRecentSearches] = useState(true);

  // =========================================
  // LOAD SETTINGS
  // =========================================

  useEffect(() => {
    const getBoolean = (key, defaultValue) => {
      const value = localStorage.getItem(key);

      if (value === null) {
        return defaultValue;
      }

      return value === "true";
    };

    setDarkMode(getBoolean("darkMode", false));
    setCompactMode(getBoolean("compactMode", false));

    setStudyNotifications(
      getBoolean("studyNotifications", true)
    );

    setDailyReminder(
      getBoolean("dailyReminder", true)
    );

    setMockTestNotifications(
      getBoolean("mockTestNotifications", true)
    );

    setAiNotifications(
      getBoolean("aiNotifications", true)
    );

    setAutoSubmit(
      getBoolean("autoSubmit", true)
    );

    setShowExplanations(
      getBoolean("showExplanations", true)
    );

    setConfirmSubmit(
      getBoolean("confirmSubmit", true)
    );

    setDefaultQuestions(
      localStorage.getItem("defaultQuestions") || "10"
    );

    setTimerWarning(
      localStorage.getItem("timerWarning") || "5"
    );

    setSoundEffects(
      getBoolean("soundEffects", true)
    );

    setTimerSound(
      getBoolean("timerSound", true)
    );

    setSaveQuizHistory(
      getBoolean("saveQuizHistory", true)
    );

    setSaveRecentSearches(
      getBoolean("saveRecentSearches", true)
    );
  }, []);

  // =========================================
  // TOGGLE HELPER
  // =========================================

  const handleToggle = (setter, key, value) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  // =========================================
  // CLEAR RECENT SEARCHES
  // =========================================

  const handleClearRecentSearches = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your recent searches?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("recentSearches");

    alert("Recent searches cleared.");
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  // =========================================
  // TOGGLE COMPONENT
  // =========================================

  const Toggle = ({ value, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-6 w-12 rounded-full transition ${
        value ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          value ? "left-7" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="mt-1 text-gray-500">
            Customize how SmartPrep looks and works.
          </p>
        </div>

        {/* ========================================= */}
        {/* APPEARANCE */}
        {/* ========================================= */}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            🎨 Appearance
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Customize how SmartPrep looks.
          </p>

          {/* Dark Mode */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Dark Mode
              </p>

              <p className="text-sm text-gray-500">
                Use a darker appearance.
              </p>
            </div>

            <Toggle
              value={darkMode}
              onChange={(value) =>
                handleToggle(
                  setDarkMode,
                  "darkMode",
                  value
                )
              }
            />
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700">
                Compact Mode
              </p>

              <p className="text-sm text-gray-500">
                Reduce spacing to show more content.
              </p>
            </div>

            <Toggle
              value={compactMode}
              onChange={(value) =>
                handleToggle(
                  setCompactMode,
                  "compactMode",
                  value
                )
              }
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* NOTIFICATIONS */}
        {/* ========================================= */}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            🔔 Notifications
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Choose which SmartPrep notifications you want to receive.
          </p>

          {/* Study Notifications */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Study Notifications
              </p>

              <p className="text-sm text-gray-500">
                Receive reminders about your study activities.
              </p>
            </div>

            <Toggle
              value={studyNotifications}
              onChange={(value) =>
                handleToggle(
                  setStudyNotifications,
                  "studyNotifications",
                  value
                )
              }
            />
          </div>

          {/* Daily Reminder */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Daily Study Reminder
              </p>

              <p className="text-sm text-gray-500">
                Get a reminder to complete your daily goal.
              </p>
            </div>

            <Toggle
              value={dailyReminder}
              onChange={(value) =>
                handleToggle(
                  setDailyReminder,
                  "dailyReminder",
                  value
                )
              }
            />
          </div>

          {/* Mock Test Notifications */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Mock Test Notifications
              </p>

              <p className="text-sm text-gray-500">
                Receive updates after completing mock tests.
              </p>
            </div>

            <Toggle
              value={mockTestNotifications}
              onChange={(value) =>
                handleToggle(
                  setMockTestNotifications,
                  "mockTestNotifications",
                  value
                )
              }
            />
          </div>

          {/* AI Notifications */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700">
                AI Notifications
              </p>

              <p className="text-sm text-gray-500">
                Receive notifications about AI-generated content.
              </p>
            </div>

            <Toggle
              value={aiNotifications}
              onChange={(value) =>
                handleToggle(
                  setAiNotifications,
                  "aiNotifications",
                  value
                )
              }
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* STUDY & TEST SETTINGS */}
        {/* ========================================= */}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            📝 Study & Test Settings
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Customize how mock tests and quizzes behave.
          </p>

          {/* Auto Submit */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Auto-submit Test
              </p>

              <p className="text-sm text-gray-500">
                Automatically submit when the timer reaches zero.
              </p>
            </div>

            <Toggle
              value={autoSubmit}
              onChange={(value) =>
                handleToggle(
                  setAutoSubmit,
                  "autoSubmit",
                  value
                )
              }
            />
          </div>

          {/* Explanations */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Show Answer Explanations
              </p>

              <p className="text-sm text-gray-500">
                Show explanations after completing a test.
              </p>
            </div>

            <Toggle
              value={showExplanations}
              onChange={(value) =>
                handleToggle(
                  setShowExplanations,
                  "showExplanations",
                  value
                )
              }
            />
          </div>

          {/* Confirm Submit */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Confirm Before Submission
              </p>

              <p className="text-sm text-gray-500">
                Ask for confirmation before manually submitting.
              </p>
            </div>

            <Toggle
              value={confirmSubmit}
              onChange={(value) =>
                handleToggle(
                  setConfirmSubmit,
                  "confirmSubmit",
                  value
                )
              }
            />
          </div>

          {/* Default Questions */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Default Questions
              </p>

              <p className="text-sm text-gray-500">
                Default number of questions for generated tests.
              </p>
            </div>

            <select
              value={defaultQuestions}
              onChange={(e) => {
                setDefaultQuestions(e.target.value);
                localStorage.setItem(
                  "defaultQuestions",
                  e.target.value
                );
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          {/* Timer Warning */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700">
                Timer Warning
              </p>

              <p className="text-sm text-gray-500">
                Show a warning when the test timer is running low.
              </p>
            </div>

            <select
              value={timerWarning}
              onChange={(e) => {
                setTimerWarning(e.target.value);
                localStorage.setItem(
                  "timerWarning",
                  e.target.value
                );
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="0">Off</option>
            </select>
          </div>
        </div>

        {/* ========================================= */}
        {/* SOUND */}
        {/* ========================================= */}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            🔊 Sound & Interaction
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Control sounds during your SmartPrep sessions.
          </p>

          {/* Sound Effects */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Sound Effects
              </p>

              <p className="text-sm text-gray-500">
                Play sounds for buttons and interactions.
              </p>
            </div>

            <Toggle
              value={soundEffects}
              onChange={(value) =>
                handleToggle(
                  setSoundEffects,
                  "soundEffects",
                  value
                )
              }
            />
          </div>

          {/* Timer Sound */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700">
                Timer Sound
              </p>

              <p className="text-sm text-gray-500">
                Play a sound when the timer is nearly finished.
              </p>
            </div>

            <Toggle
              value={timerSound}
              onChange={(value) =>
                handleToggle(
                  setTimerSound,
                  "timerSound",
                  value
                )
              }
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* PRIVACY & DATA */}
        {/* ========================================= */}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            🔐 Privacy & Data
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Control what SmartPrep stores on this device.
          </p>

          {/* Quiz History */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Save Quiz History
              </p>

              <p className="text-sm text-gray-500">
                Keep your quiz history available for review.
              </p>
            </div>

            <Toggle
              value={saveQuizHistory}
              onChange={(value) =>
                handleToggle(
                  setSaveQuizHistory,
                  "saveQuizHistory",
                  value
                )
              }
            />
          </div>

          {/* Recent Searches */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div>
              <p className="font-medium text-slate-700">
                Save Recent Searches
              </p>

              <p className="text-sm text-gray-500">
                Remember your recent SmartPrep searches.
              </p>
            </div>

            <Toggle
              value={saveRecentSearches}
              onChange={(value) =>
                handleToggle(
                  setSaveRecentSearches,
                  "saveRecentSearches",
                  value
                )
              }
            />
          </div>

          {/* Clear Searches */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700">
                Clear Recent Searches
              </p>

              <p className="text-sm text-gray-500">
                Remove saved search history from this device.
              </p>
            </div>

            <button
              onClick={handleClearRecentSearches}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* ACCOUNT */}
        {/* ========================================= */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-800">
            🔑 Account
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Manage your SmartPrep account.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
              onClick={() =>
                alert(
                  "Password change feature coming soon."
                )
              }
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-50"
            >
              Logout
            </button>

          </div>

          <div className="mt-5 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            ✓ Your settings are saved automatically on this device.
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;