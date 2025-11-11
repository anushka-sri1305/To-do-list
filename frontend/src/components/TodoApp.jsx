import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/todos");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
  if (!newTask.trim()) return;
  try {
    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask("");
  } catch (err) {
    console.error("Error adding task:", err);
  }
};


  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white/20 backdrop-blur-lg shadow-xl rounded-3xl w-full max-w-lg p-8 border border-white/30"
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-md">
          ✨ My To-Do List
        </h1>

        {/* Input Section */}
        <div className="flex items-center bg-white/20 rounded-full overflow-hidden mb-6 border border-white/30">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
          />
          <button
            onClick={addTask}
            className="bg-white text-purple-700 px-4 py-2 hover:bg-purple-200 transition-all"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl shadow hover:bg-white/40 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="text-green-300" />
                  <span className="font-medium">{task.title}</span>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* No Tasks Message */}
        {tasks.length === 0 && (
          <p className="text-white/80 text-center mt-6 italic">
            No tasks yet — add one above 🌸
          </p>
        )}
      </motion.div>
    </div>
  );
}
