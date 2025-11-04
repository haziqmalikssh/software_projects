import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notes from './pages/Notes.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';

export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}
