function StudyStreak({ attempts }) {
  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Store all dates on which the user attempted a test
  const activeDates = new Set(
    attempts.map((attempt) => getDateKey(attempt.attemptedAt)),
  );

  const today = new Date();
  const todayKey = getDateKey(today);

  // Calculate current streak
  let currentStreak = 0;

  for (let i = 0; ; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    if (activeDates.has(getDateKey(date))) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Find Monday of current week
  const day = today.getDay();

  const monday = new Date(today);
  monday.setDate(
    today.getDate() - (day === 0 ? 6 : day - 1),
  );

  // Create Monday → Sunday
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const dateKey = getDateKey(date);

    weekDays.push({
      name: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      dateKey,
      active: activeDates.has(dateKey),
      isToday: dateKey === todayKey,
      isFuture: date > today,
    });
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          🔥 {currentStreak} Day Streak
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Keep studying to maintain your streak!
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day.dateKey} className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              {day.name}
            </p>

            <div
              className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                day.active
                  ? "bg-green-100 text-green-600"
                  : day.isFuture
                    ? "bg-gray-100 text-gray-300"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {day.active ? "✓" : "○"}
            </div>

            {day.isToday && (
              <p className="text-[10px] text-blue-600 mt-1">
                Today
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyStreak;