import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Question Bank",
      description: "Practice topic-wise questions",
      icon: "📚",
      path: "/mock-tests",
      style: "border-purple-100 bg-purple-50",
    },
    {
      title: "Mock Tests",
      description: "Take AI-generated mock tests",
      icon: "📝",
      path: "/mock-tests",
      style: "border-green-100 bg-green-50",
    },
    {
      title: "AI Quiz",
      description: "Generate quizzes with AI",
      icon: "🧠",
      path: "/ai-quiz",
      style: "border-pink-100 bg-pink-50",
    },
    {
      title: "AI Doubt Solver",
      description: "Get instant help with doubts",
      icon: "💬",
      path: "/doubt-solver",
      style: "border-blue-100 bg-blue-50",
    },
    {
      title: "Videos",
      description: "Learn from video resources",
      icon: "▶️",
      path: "/videos",
      style: "border-indigo-100 bg-indigo-50",
    },
  ];

  const exams = [
    {
      name: "SSC",
      description: "CGL, CHSL, MTS & GD",
      icon: "📋",
    },
    {
      name: "UPSC",
      description: "Civil Services, NDA & CDS",
      icon: "🏛️",
    },
    {
      name: "Banking",
      description: "IBPS, SBI & RBI exams",
      icon: "🏦",
    },
    {
      name: "Railways",
      description: "NTPC, Group D, ALP & JE",
      icon: "🚆",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">

        {/* ========================================= */}
        {/* WELCOME HERO */}
        {/* ========================================= */}

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">

          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100 opacity-60" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-indigo-100 opacity-50" />

          <div className="relative z-10 max-w-4xl">

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Your preparation journey
            </p>

            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Good evening! 👋
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
              Prepare smarter with previous year papers, mock tests,
              question banks and AI-powered learning tools.
            </p>

            {/* Search / preparation box */}

            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm md:flex-row">

              <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <span className="text-xl">🎯</span>

                <div>
                  <p className="text-xs text-gray-400">
                    What are you preparing for?
                  </p>

                  <p className="font-semibold text-gray-800">
                    SSC CGL
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/exams")}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Preparing →
              </button>

            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* MAIN GRID */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* ========================================= */}
          {/* LEFT / MAIN CONTENT */}
          {/* ========================================= */}

          <div className="space-y-6 xl:col-span-2">

            {/* Quick Actions */}

            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  ⚡ Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Jump directly into your preparation.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className={`group rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg ${action.style}`}
                  >
                    <div className="flex items-center justify-between">

                      <span className="text-3xl">
                        {action.icon}
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm transition group-hover:translate-x-1">
                        →
                      </span>

                    </div>

                    <h3 className="mt-5 font-bold text-gray-800">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      {action.description}
                    </p>
                  </button>
                ))}

              </div>
            </section>

            {/* Popular Exams */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    📚 Explore Exams
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Find resources for your target examination.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/exams")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All →
                </button>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {exams.map((exam) => (
                  <button
                    key={exam.name}
                    onClick={() => navigate("/exams")}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      {exam.icon}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {exam.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {exam.description}
                      </p>
                    </div>

                    <span className="ml-auto text-gray-400">
                      →
                    </span>

                  </button>
                ))}

              </div>
            </section>

            {/* Progress */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  📊 Your Progress
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep track of your preparation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                {/* Streak */}

                <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                  <span className="text-2xl">🔥</span>

                  <p className="mt-3 text-2xl font-bold text-gray-800">
                    5
                  </p>

                  <p className="text-sm text-gray-500">
                    Day Streak
                  </p>

                  <p className="mt-2 text-xs font-medium text-orange-600">
                    Keep it going!
                  </p>
                </div>

                {/* Accuracy */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <span className="text-2xl">🎯</span>

                  <p className="mt-3 text-2xl font-bold text-gray-800">
                    72%
                  </p>

                  <p className="text-sm text-gray-500">
                    Accuracy
                  </p>

                  <p className="mt-2 text-xs font-medium text-blue-600">
                    ↑ Improving
                  </p>
                </div>

                {/* Questions */}

                <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                  <span className="text-2xl">📝</span>

                  <p className="mt-3 text-2xl font-bold text-gray-800">
                    48
                  </p>

                  <p className="text-sm text-gray-500">
                    Questions Solved
                  </p>

                  <p className="mt-2 text-xs font-medium text-purple-600">
                    Keep practicing
                  </p>
                </div>

                {/* Correct */}

                <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                  <span className="text-2xl">✅</span>

                  <p className="mt-3 text-2xl font-bold text-gray-800">
                    35
                  </p>

                  <p className="text-sm text-gray-500">
                    Correct Answers
                  </p>

                  <p className="mt-2 text-xs font-medium text-green-600">
                    Great work!
                  </p>
                </div>

              </div>
            </section>

            {/* Continue Preparing */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  📖 Continue Preparing
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Pick up where you left off.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 md:flex-row md:items-center">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl text-white">
                  📋
                </div>

                <div className="flex-1">

                  <h3 className="font-bold text-gray-800">
                    SSC CGL
                  </h3>

                  <p className="text-sm text-gray-500">
                    Quantitative Aptitude
                  </p>

                  <div className="mt-3 flex items-center gap-3">

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: "72%" }}
                      />
                    </div>

                    <span className="text-sm font-bold text-blue-700">
                      72%
                    </span>

                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/exams/ssc/ssc-cgl")
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continue →
                </button>

              </div>
            </section>

          </div>

          {/* ========================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ========================================= */}

          <div className="space-y-6">

            {/* Study Streak */}

            <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-bold text-gray-800">
                  🔥 Study Streak
                </h2>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                  Keep it up!
                </span>

              </div>

              <p className="mt-5 text-4xl font-bold text-gray-800">
                3 <span className="text-xl">days</span>
              </p>

              <p className="mt-1 text-sm text-gray-500">
                You're on a roll! 🔥
              </p>

              <div className="mt-5 grid grid-cols-7 gap-2">

                {["M", "T", "W", "T", "F", "S", "S"].map(
                  (day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="text-center"
                    >
                      <div
                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                          index < 3
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index < 3 ? "✓" : ""}
                      </div>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {day}
                      </p>
                    </div>
                  )
                )}

              </div>
            </section>

            {/* Today's Goal */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🎯
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Today's Goal
                  </h2>

                  <p className="text-xs text-gray-500">
                    Keep making progress
                  </p>
                </div>

              </div>

              <div className="mt-5 flex items-end justify-between">

                <p className="text-2xl font-bold text-gray-800">
                  8
                  <span className="text-base font-normal text-gray-400">
                    {" "}
                    / 10 questions
                  </span>
                </p>

                <span className="text-sm font-semibold text-blue-600">
                  80%
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "80%" }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Only 2 more questions to complete today's goal.
              </p>

            </section>

            {/* Recommended */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-gray-800">
                💡 Recommended
              </h2>

              <div className="mt-4 divide-y">

                <button
                  onClick={() => navigate("/mock-tests")}
                  className="flex w-full items-center gap-3 py-4 text-left"
                >
                  <span className="text-xl">📐</span>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Practice Quantitative Aptitude
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Strengthen your calculation skills
                    </p>
                  </div>

                  <span className="text-gray-400">
                    →
                  </span>
                </button>

                <button
                  onClick={() => navigate("/mock-tests")}
                  className="flex w-full items-center gap-3 py-4 text-left"
                >
                  <span className="text-xl">📝</span>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Take a Mock Test
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Test your accuracy and speed
                    </p>
                  </div>

                  <span className="text-gray-400">
                    →
                  </span>
                </button>

                <button
                  onClick={() => navigate("/performance")}
                  className="flex w-full items-center gap-3 py-4 text-left"
                >
                  <span className="text-xl">📈</span>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Review Your Performance
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Find your strengths and weak areas
                    </p>
                  </div>

                  <span className="text-gray-400">
                    →
                  </span>
                </button>

              </div>
            </section>

          </div>
        </div>

        {/* ========================================= */}
        {/* BOTTOM MOTIVATION */}
        {/* ========================================= */}

        <section className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg">

          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">

            <div>
              <h2 className="text-xl font-bold">
                🚀 Small steps every day lead to big results.
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Stay consistent, practice regularly, and keep improving.
              </p>
            </div>

            <button
              onClick={() => navigate("/mock-tests")}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Start Practicing →
            </button>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Home;