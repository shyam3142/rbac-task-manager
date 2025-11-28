import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // 'users' | 'tasks'
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      verifyAdmin();
    }
    // eslint-disable-next-line
  }, []);

  const verifyAdmin = async () => {
    try {
      const me = await axios.get("http://localhost:4000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (me.data.user.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      // load default tab
      loadUsers();
    } catch (err) {
      console.log("ADMIN CHECK ERROR:", err.response?.data || err.message);
      setMsg("Failed to verify admin.");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setMsg("");
    } catch (err) {
      console.log("LOAD USERS ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/tasks/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setMsg("");
    } catch (err) {
      console.log("LOAD TASKS ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setMsg("");
    setActiveTab(tab);
    if (tab === "users") loadUsers();
    if (tab === "tasks") loadTasks();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadUsers();
    } catch (err) {
      console.log("UPDATE ROLE ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/v1/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTasks();
    } catch (err) {
      console.log("ADMIN DELETE TASK ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      {/* Top bar */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
        <div className="flex gap-4 text-sm items-center">
          <a href="/dashboard" className="text-blue-600">
            My Tasks
          </a>
          <button className="text-red-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-6xl mb-4 px-4">
        <div className="inline-flex rounded-lg bg-slate-200 p-1">
          <button
            className={`px-4 py-1 text-sm rounded-md ${
              activeTab === "users" ? "bg-white shadow text-slate-800" : "text-slate-600"
            }`}
            onClick={() => handleTabChange("users")}
          >
            Users
          </button>
          <button
            className={`px-4 py-1 text-sm rounded-md ${
              activeTab === "tasks" ? "bg-white shadow text-slate-800" : "text-slate-600"
            }`}
            onClick={() => handleTabChange("tasks")}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* Message */}
      <div className="w-full max-w-6xl px-4">
        {msg && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {msg}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl px-4">
        <div className="card overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "users" ? (
            users.length === 0 ? (
              <p className="text-sm text-slate-500">No users found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b last:border-0">
                      <td className="py-2 pr-3">{u.name}</td>
                      <td className="py-2 pr-3">{u.email}</td>
                      <td className="py-2 pr-3 capitalize">{u.role}</td>
                      <td className="py-2 pr-3 text-right">
                        <select
                          className="border rounded px-2 py-1 text-xs"
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t._id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{t.title}</td>
                    <td className="py-2 pr-3">{t.user?.name}</td>
                    <td className="py-2 pr-3">{t.user?.email}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={
                          t.status === "completed"
                            ? "text-green-600"
                            : "text-amber-500"
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <button
                        className="text-xs text-red-600"
                        onClick={() => handleDeleteTask(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
