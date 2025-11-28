import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  const token = localStorage.getItem("token");

  // Redirect if not logged in, else load user + tasks
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      fetchMe();
      fetchTasks();
    }
    // eslint-disable-next-line
  }, []);

  const fetchMe = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.user.role);
    } catch (err) {
      console.log("FETCH ME ERROR:", err.response?.data || err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setMsg("");
    } catch (err) {
      console.log("FETCH TASKS ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(
        "http://localhost:4000/api/v1/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.log("CREATE TASK ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/v1/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.log("DELETE TASK ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/tasks/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.log("UPDATE TASK ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      {/* Top bar */}
      <div className="w-full max-w-5xl flex justify-between items-center px-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
        <div className="flex gap-4 items-center text-sm">
          {role === "admin" && (
            <a href="/admin" className="text-blue-600">
              Admin Dashboard
            </a>
          )}
          <button className="text-red-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Create task card */}
      <div className="card w-full max-w-5xl mb-6">
        <h2 className="font-semibold mb-3 text-slate-800">
          Create a new task
        </h2>
        <form className="flex flex-col md:flex-row gap-3 items-end" onSubmit={handleCreate}>
          <div className="flex-1 w-full">
            <label className="text-sm text-slate-700">Title</label>
            <input
              className="input mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm text-slate-700">Description</label>
            <input
              className="input mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
            />
          </div>
          <button className="btn-primary w-full md:w-auto" type="submit">
            Add
          </button>
        </form>
      </div>

      {/* Messages + list */}
      <div className="w-full max-w-5xl">
        {msg && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {msg}
          </p>
        )}

        <div className="card">
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {tasks.map((task) => (
                <li key={task._id} className="py-3 flex justify-between gap-3">
                  <div>
                    <p
                      className={`font-medium ${
                        task.status === "completed"
                          ? "line-through text-slate-400"
                          : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500">
                        {task.description}
                      </p>
                    )}
                    <p className="text-[10px] uppercase mt-1">
                      Status:{" "}
                      <span
                        className={
                          task.status === "completed"
                            ? "text-green-600"
                            : "text-amber-500"
                        }
                      >
                        {task.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs">
                    <button
                      className="text-blue-600"
                      onClick={() => handleToggleStatus(task)}
                    >
                      {task.status === "completed"
                        ? "Mark Pending"
                        : "Mark Completed"}
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
