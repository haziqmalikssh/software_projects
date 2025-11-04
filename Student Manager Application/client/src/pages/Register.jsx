import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
