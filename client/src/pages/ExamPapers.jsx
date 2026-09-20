import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import previousYearPapers from "../data/previousYearPapers";

function ExamPapers() {
  const { exam } = useParams();
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState("All");

  const examName = exam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const papers = previousYearPapers.filter(
    (paper) => paper.exam.toLowerCase().replace(/\s+/g, "-") === exam,
  );

  const years = ["All", ...papers.map((paper) => paper.year)];

  const filteredPapers =
    selectedYear === "All"
      ? papers
      : papers.filter((paper) => paper.year === Number(selectedYear));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Exam
        </button>

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {examName} Previous Year Papers
            </h1>

            <p className="mt-2 text-gray-500">
              Practice previous year examination papers.
            </p>
          </div>

          {/* Year Filter */}
          <div>
            <label className="mr-2 text-sm font-medium text-gray-700">
              Filter by Year:
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Years" : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Papers */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <div
                key={paper.year}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-md"
              >
                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {paper.year}
                </span>

                <h2 className="mt-4 text-lg font-bold text-gray-800">
                  {paper.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">{paper.type}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {paper.tier}
                  </span>

                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {paper.shift}
                  </span>

                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {paper.language}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Source: {paper.sourceName}
                </p>

                <a
                  href={paper.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View Paper →
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-white p-10 text-center shadow">
              <p className="text-gray-500">
                No papers available for this year.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamPapers;
