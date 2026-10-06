import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  const [preferences, setPreferences] = useState({
    targetExam: "SSC CGL",
    language: "English",
    difficulty: "Medium",
    dailyGoal: "20",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const savedPreferences =
      localStorage.getItem("smartprep-preferences");

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handlePreferenceChange = (field, value) => {
    const updatedPreferences = {
      ...preferences,
      [field]: value,
    };

    setPreferences(updatedPreferences);

    localStorage.setItem(
      "smartprep-preferences",
      JSON.stringify(updatedPreferences)
    );
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your personal information and preparation preferences.
          </p>
        </div>

        {/* Personal Information */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              👤 Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your SmartPrep account information.
            </p>
          </div>

          {/* Profile Header */}
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <span className="text-3xl font-bold text-blue-700">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {user.name}
              </h2>

              <p className="mt-1 text-gray-500">
                {user.email}
              </p>

              <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {user.isAdmin ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          {/* Information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">
                Full Name
              </p>

              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-gray-800">
                {user.name}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">
                Email Address
              </p>

              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-gray-800">
                {user.email || "Not available"}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">
                Account Type
              </p>

              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-gray-800">
                {user.isAdmin ? "Administrator" : "Student"}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">
                Platform
              </p>

              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 text-gray-800">
                SmartPrep
              </div>
            </div>

          </div>
        </div>

        {/* Preparation Preferences */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              🎯 Preparation Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customize SmartPrep according to your preparation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Target Exam */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Target Exam
              </label>

              <select
                value={preferences.targetExam}
                onChange={(e) =>
                  handlePreferenceChange(
                    "targetExam",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>SSC CGL</option>
                <option>SSC CHSL</option>
                <option>SSC MTS</option>
                <option>UPSC Civil Services</option>
                <option>IBPS PO</option>
                <option>IBPS Clerk</option>
                <option>SBI PO</option>
                <option>RRB NTPC</option>
                <option>GATE CSE</option>
                <option>Punjab PSC</option>
                <option>CTET</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Preferred Language
              </label>

              <select
                value={preferences.language}
                onChange={(e) =>
                  handlePreferenceChange(
                    "language",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Punjabi</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Preferred Difficulty
              </label>

              <select
                value={preferences.difficulty}
                onChange={(e) =>
                  handlePreferenceChange(
                    "difficulty",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Daily Goal */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Daily Question Goal
              </label>

              <select
                value={preferences.dailyGoal}
                onChange={(e) =>
                  handlePreferenceChange(
                    "dailyGoal",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
                <option value="30">30 questions</option>
                <option value="50">50 questions</option>
                <option value="100">100 questions</option>
              </select>
            </div>

          </div>

          {/* Saved message */}
          <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ Your preferences are saved automatically.
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              ⚙️ Account
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic account details and actions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <p className="mt-1 font-semibold text-green-600">
                ● Active
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {user.isAdmin ? "Administrator" : "Student"}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;