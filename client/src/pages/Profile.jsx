import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>

        <p className="text-gray-500 mt-1">
          View and manage your SmartPrep profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-700">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>

            <p className="text-gray-500">SmartPrep Student</p>
          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>

            <div className="bg-slate-50 border rounded-lg px-4 py-3">
              {user.name}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>

            <div className="bg-slate-50 border rounded-lg px-4 py-3">
              {user.email || "Not available"}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Account Type</p>

            <div className="bg-slate-50 border rounded-lg px-4 py-3">
              {user.isAdmin ? "Administrator" : "Student"}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Platform</p>

            <div className="bg-slate-50 border rounded-lg px-4 py-3">
              SmartPrep
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
