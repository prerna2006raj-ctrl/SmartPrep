import { useState } from 'react';
import api from '../api/axios';

function DoubtSolver() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/solve-doubt', { question: input });
      const aiMessage = { role: 'ai', text: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { role: 'ai', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-1 text-center">AI Doubt Solver</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Ask any doubt related to your competitive exam preparation
        </p>

        <div className="flex-1 bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto max-h-[60vh] min-h-[300px]">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Start by asking a question below — e.g. "Explain the difference between Fundamental Rights and Directive Principles"
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg whitespace-pre-wrap text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your doubt here..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoubtSolver;