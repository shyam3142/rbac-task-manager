import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    setMsg("");
    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/register", {
        name,
        email,
        password,
      });

      setMsg("Registration successful! Redirecting to login...");
      console.log("REGISTER SUCCESS:", res.data);

      // redirect after 1.5s
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="input mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="input mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary w-full" onClick={handleRegister}>
          Create Account
        </button>

        <p className="text-sm mt-3">
          Already have an account?{" "}
          <a className="text-blue-600" href="/">
            Login
          </a>
        </p>

        {msg && (
          <p
            className={`mt-3 ${
              msg.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
