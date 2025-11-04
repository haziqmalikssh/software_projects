import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  return (
    <div className="p-6">
      <h1>Welcome to your Student Manager</h1>
      <Link to="/notes">Go to Notes</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
