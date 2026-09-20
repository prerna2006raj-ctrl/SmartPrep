import { useNavigate, useParams } from "react-router-dom";
import examCategories from "../data/examCategories";

function ExamPreparation() {
  const { category: categoryParam, exam } = useParams();
  const navigate = useNavigate();

  const examName = exam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const category = examCategories.find(
    (item) => item.name.toLowerCase().replace(/\s+/g, "-") === categoryParam,
  );

  const resources = [
    {
      title: "Previous Year Papers",
      description: "Practice questions from previous examinations.",
      icon: "📄",
      path: "papers",
    },
    {
      title: "Mock Tests",
      description: "Attempt mock tests and check your preparation.",
      icon: "📝",
      path: "mock-tests",
    },
    {
      title: "Question Bank",
      description: "Practice topic-wise questions.",
      icon: "❓",
    },
    {
      title: "Study Material",
      description: "Access useful preparation notes and resources.",
      icon: "📚",
    },
    {
      title: "Videos",
      description: "Learn from useful video lectures and explanations.",
      icon: "▶️",
    },
    {
      title: "Syllabus",
      description: "View the complete examination syllabus.",
      icon: "📋",
    },
    {
      title: "Exam Pattern",
      description: "Understand sections, marks and examination structure.",
      icon: "📊",
    },
    {
      title: "AI Preparation",
      description: "Use AI-powered tools to improve your preparation.",
      icon: "🤖",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            {category?.name || "Exam Preparation"}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-800">{examName}</h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Prepare for {examName} with previous year papers, mock tests, study
            material, videos, syllabus and AI-powered preparation tools.
          </p>
        </div>

        {/* Resources */}
        <h2 className="mb-5 text-2xl font-bold text-gray-800">
          Preparation Resources
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="rounded-xl border border-gray-100 bg-white
                         p-6 shadow-md transition duration-200
                         hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-3xl">{resource.icon}</div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                {resource.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {resource.description}
              </p>

              <button
                onClick={() => {
                  if (resource.path) {
                    navigate(
                      `/exams/${categoryParam}/${exam}/${resource.path}`,
                    );
                  }
                }}
                disabled={!resource.path}
                className={`mt-5 text-sm font-semibold ${
                  resource.path
                    ? "text-blue-600 hover:text-blue-800"
                    : "cursor-not-allowed text-gray-400"
                }`}
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamPreparation;
