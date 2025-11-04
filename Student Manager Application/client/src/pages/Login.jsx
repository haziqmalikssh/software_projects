import { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token);
      navigate('/');
    } catch {
      alert('Login failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
