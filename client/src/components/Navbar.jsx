import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Icon({ children }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">
      {children}
    </span>
  );
}

function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }

    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const mainLinks = [
    {
      name: "Home",
      path: "/",
      icon: "⌂",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▥",
    },
    {
      name: "Previous Year Papers",
      path: "/papers",
      icon: "▤",
    },
    {
      name: "Mock Tests",
      path: "/mock-tests",
      icon: "☷",
    },
    {
      name: "Videos",
      path: "/videos",
      icon: "▷",
    },
    {
      name: "AI Doubt Solver",
      path: "/doubt-solver",
      icon: "✦",
    },
    {
      name: "AI Answer Evaluator",
      path: "/answer-evaluator",
      icon: "✎",
    },
    {
      name: "AI Quiz",
      path: "/ai-quiz",
      icon: "🧠",
    },
    {
      name: "Quiz History",
      path: "/quiz-history",
      icon: "◷",
    },
    {
      name: "Study Planner",
      path: "/study-planner",
      icon: "▣",
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      icon: "♡",
    },
  ];

  const secondaryLinks = [
    {
      name: "Performance Analytics",
      path: "/performance-analytics",
      icon: "▥",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "♙",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-gray-200 bg-white">
        <div className="flex h-full items-center">
          {/* SmartPrep Logo */}
          <Link
            to="/"
            className="flex h-full w-[250px] shrink-0 items-center border-r border-gray-200 bg-white px-5"
          >
            <img
              src="/smartprep-logo.svg"
              alt="SmartPrep"
              className="w-[205px] h-auto"
            />
          </Link>

          {/* Search */}
          <div className="hidden flex-1 items-center px-6 md:flex">
            <div className="relative w-full max-w-[630px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search for papers, tests, or topics..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3 px-4 lg:px-6">
            {/* Notification */}
            {user && (
              <button
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-blue-600 sm:flex"
                title="Notifications"
              >
                ♧
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  2
                </span>
              </button>
            )}

            {/* User */}
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="hidden xl:block">
                  <p className="text-[11px] text-gray-400">Welcome back</p>

                  <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                </div>

                <span className="text-xs text-gray-400">▾</span>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-xl text-gray-700 lg:hidden"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed bottom-0 left-0 top-[72px] z-40 hidden w-[250px] border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
          {/* Main navigation */}
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon>{link.icon}</Icon>

                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-gray-100" />

          {/* Analytics */}
          <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Progress
          </div>

          {secondaryLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive(link.path)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon>{link.icon}</Icon>

              <span>{link.name}</span>
            </Link>
          ))}

          {/* Admin */}
          {user?.isAdmin && (
            <>
              <div className="my-5 border-t border-gray-100" />

              <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Administration
              </div>

              <Link
                to="/admin"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive("/admin")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon>⚙</Icon>
                <span>Admin Panel</span>
              </Link>
            </>
          )}

          {/* Bottom encouragement card */}
          <div className="mt-auto pt-6">
            {user && (
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  ♛
                </div>

                <p className="text-sm font-bold text-blue-800">Keep Going!</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your hard work today builds your success tomorrow.
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full w-[65%] rounded-full bg-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Icon>↪</Icon>
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu */}
          <aside className="fixed bottom-0 left-0 top-[72px] z-50 w-[280px] overflow-y-auto border-r border-gray-200 bg-white px-4 py-5 shadow-xl lg:hidden">
            <div className="space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon>{link.icon}</Icon>
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="my-4 border-t border-gray-100" />

              {secondaryLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon>{link.icon}</Icon>
                  <span>{link.name}</span>
                </Link>
              ))}

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon>⚙</Icon>
                  <span>Admin Panel</span>
                </Link>
              )}

              {user && (
                <>
                  <div className="my-4 border-t border-gray-100" />

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Signed in as</p>

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Icon>↪</Icon>
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;
