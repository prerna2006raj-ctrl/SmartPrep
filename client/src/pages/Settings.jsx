import { useEffect, useState } from "react";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedNotifications = localStorage.getItem("notifications");

    if (savedDarkMode === "true") {
      setDarkMode(true);
    }

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }
  }, []);

  const handleDarkMode = (value) => {
    setDarkMode(value);
    localStorage.setItem("darkMode", value);
  };

  const handleNotifications = (value) => {
    setNotifications(value);
    localStorage.setItem("notifications", value);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="text-gray-500 mt-1">Manage your SmartPrep preferences.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">
            Appearance
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            Customize how SmartPrep looks.
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Dark Mode</p>

              <p className="text-sm text-gray-500">Use a darker appearance.</p>
            </div>

            <button
              onClick={() => handleDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  darkMode ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">
            Notifications
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            Manage your SmartPrep notifications.
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Study Notifications</p>

              <p className="text-sm text-gray-500">
                Receive reminders about your study activities.
              </p>
            </div>

            <button
              onClick={() => handleNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition ${
                notifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  notifications ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Account</h2>

          <p className="text-sm text-gray-500 mb-5">
            Manage your account preferences.
          </p>

          <button
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert("Password change feature coming soon.")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
