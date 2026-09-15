import { useState } from 'react';
import api from '../api/axios';

function AnswerEvaluator() {
  const [question, setQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [wordLimit, setWordLimit] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEvaluation('');
    setLoading(true);

    try {
      const res = await api.post('/ai/evaluate-answer', {
        question,
        studentAnswer,
        wordLimit: wordLimit || undefined,
      });
      setEvaluation(res.data.evaluation);
    } catch (err) {
      setError('Something went wrong while evaluating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = studentAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-1 text-center">AI Answer Evaluator</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Get rubric-based feedback on your written answers, just like UPSC Mains evaluation
        </p>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            placeholder="e.g. Discuss the significance of the Right to Education Act, 2009."
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            rows={8}
            placeholder="Write or paste your answer here..."
            className="w-full border border-gray-300 rounded px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mb-4">{wordCount} words</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">Word Limit (optional)</label>
          <input
            type="number"
            value={wordLimit}
            onChange={(e) => setWordLimit(e.target.value)}
            placeholder="e.g. 150"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Evaluating...' : 'Evaluate Answer'}
          </button>
        </form>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {evaluation && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-blue-700 mb-4">Evaluation Report</h2>
            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
              {evaluation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerEvaluator;