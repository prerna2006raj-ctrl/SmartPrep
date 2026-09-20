import { useNavigate, useParams } from "react-router-dom";
import examCategories from "../data/examCategories";

function ExamCategory() {
  const { category } = useParams();
  const navigate = useNavigate();

  const selectedCategory = examCategories.find(
    (item) => item.name.toLowerCase().replace(/\s+/g, "-") === category,
  );

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Category Not Found
          </h1>

          <button
            onClick={() => navigate("/exams")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5
                       font-medium text-white hover:bg-blue-700"
          >
            ← Back to Exam Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/exams")}
          className="mb-6 text-sm font-medium text-blue-600
                     hover:text-blue-800"
        >
          ← Back to Exam Categories
        </button>

        {/* Header */}
        <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center
                         rounded-xl bg-blue-100 text-2xl font-bold
                         text-blue-700"
            >
              {selectedCategory.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedCategory.name} Exams
              </h1>

              <p className="mt-2 text-gray-500">
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </div>

        {/* Exams */}
        <h2 className="mb-5 text-2xl font-bold text-gray-800">Popular Exams</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {selectedCategory.exams.map((exam) => (
            <div
              key={exam}
              className="rounded-xl border border-gray-100 bg-white
                         p-6 shadow-md transition duration-200
                         hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800">{exam}</h3>

              <p className="mt-2 text-sm text-gray-500">
                Explore preparation resources, previous year papers, mock tests,
                study material and more.
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/exams/${category}/${exam
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`,
                  )
                }
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2
                           text-sm font-semibold text-white
                           transition hover:bg-blue-700"
              >
                Explore Exam →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamCategory;
