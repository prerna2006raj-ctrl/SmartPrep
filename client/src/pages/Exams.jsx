import { useNavigate } from "react-router-dom";
import examCategories from "../data/examCategories";

function Exams() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/exams/${category.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700">Exam Categories</h1>

          <p className="text-gray-600 mt-3">
            Choose an exam category to explore preparation resources, previous
            year papers, mock tests, study material, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examCategories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer
                         hover:shadow-xl hover:-translate-y-1
                         transition duration-200 border border-gray-100"
            >
              <div
                className="w-12 h-12 rounded-lg bg-blue-100
                           text-blue-700 flex items-center
                           justify-center font-bold text-lg mb-4"
              >
                {category.name.charAt(0)}
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {category.name}
              </h2>

              <p className="text-sm text-gray-500 mt-2 min-h-[40px]">
                {category.description}
              </p>

              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Popular exams</p>

                <div className="flex flex-wrap gap-2">
                  {category.exams.slice(0, 3).map((exam) => (
                    <span
                      key={exam}
                      className="text-xs bg-gray-100 text-gray-600
                                 px-2 py-1 rounded"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="mt-5 text-blue-700 font-medium text-sm
                           hover:text-blue-900"
              >
                Explore exams →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Exams;
