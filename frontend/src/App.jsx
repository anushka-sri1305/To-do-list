import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:5000/api/todos");
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault(); // prevent page reload on Enter
    if (!task.trim()) return;
    const { data } = await axios.post("http://localhost:5000/api/todos", { text: task });
    setTodos([...todos, data]);
    setTask("");
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const toggleTodo = async (id, completed) => {
    const { data } = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
    setTodos(todos.map((t) => (t._id === id ? data : t)));
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed);
    for (let t of completedTodos) {
      await deleteTodo(t._id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">✨ To-Do List ✨</h1>

        {/* ✅ FORM so Enter key works */}
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task..."
            className="flex-1 p-2 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md transition"
          >
            Add
          </button>
        </form>

        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {todos.map((t) => (
            <li
              key={t._id}
              className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t._id, t.completed)}
                  className="accent-indigo-500 w-5 h-5"
                />
                <span
                  className={`text-lg ${t.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {t.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(t._id)}
                className="text-red-500 hover:text-red-600 font-bold text-lg"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {todos.some((t) => t.completed) && (
          <button
            onClick={clearCompleted}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition"
          >
            Clear Completed Tasks
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
