import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/v1/auth/login', {
        email, password
      });

      localStorage.setItem('token', res.data.token);
      setMsg("Login successful! Redirecting...");
      window.location.href = "/dashboard";

    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input className="input mb-3" type="email" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="input mb-3" type="password" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="btn-primary w-full" onClick={handleLogin}>
          Login
        </button>

        <p className="text-sm mt-3">
          Don't have an account? <a className="text-blue-600" href="/register">Register</a>
        </p>

        {msg && (
  <p className={`mt-3 ${msg.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
    {msg}
  </p>
)}

      </div>
    </div>
  );
}

export default Login;
