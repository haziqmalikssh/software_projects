import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Home, BookOpen, Calendar, FileText, User, LogOut, Menu, X, 
  Bell, Plus, Edit2, Trash2, Search, Star, CheckCircle, Circle,
  Clock, AlertCircle, Save, XCircle
} from 'lucide-react';

// API Configuration
const API_URL = 'http://localhost:5000/api';

// Auth Context
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// API Helper
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  return res.json();
};

// Login Component
const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Manager</h2>
        <h3 className="text-xl text-center text-gray-600 mb-8">Login</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Manager</h2>
        <h3 className="text-xl text-center text-gray-600 mb-8">Create Account</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({ tasks: 0, notes: 0, courses: 0, upcomingTasks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasks, notes, courses, upcoming] = await Promise.all([
          apiCall('/tasks'),
          apiCall('/notes'),
          apiCall('/courses'),
          apiCall('/tasks/upcoming/week')
        ]);
        
        setStats({
          tasks: tasks.filter(t => t.status !== 'completed').length,
          notes: notes.length,
          courses: courses.length,
          upcomingTasks: upcoming.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Tasks</p>
              <p className="text-3xl font-bold text-blue-600">{stats.tasks}</p>
            </div>
            <Calendar className="text-blue-600" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Notes</p>
              <p className="text-3xl font-bold text-green-600">{stats.notes}</p>
            </div>
            <FileText className="text-green-600" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Courses</p>
              <p className="text-3xl font-bold text-purple-600">{stats.courses}</p>
            </div>
            <BookOpen className="text-purple-600" size={40} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
        {stats.upcomingTasks.length === 0 ? (
          <p className="text-gray-500">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {stats.upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Notes Component (Simplified)
const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: '', tags: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const data = await apiCall('/notes');
    setNotes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNote) {
      await apiCall(`/notes/${editingNote.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    } else {
      await apiCall('/notes', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    }
    setFormData({ title: '', content: '', category: '', tags: '' });
    setEditingNote(null);
    setShowForm(false);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      await apiCall(`/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category || '',
      tags: note.tags || ''
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingNote(null);
            setFormData({ title: '', content: '', category: '', tags: '' });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? <XCircle size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'New Note'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{editingNote ? 'Edit Note' : 'Create Note'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lecture, Assignment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma separated"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              {editingNote ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800">{note.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
            {note.category && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {note.category}
              </span>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? 
      <Register onSwitchToLogin={() => setShowRegister(false)} /> : 
      <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const navigation = [
    { name: 'Dashboard', view: 'dashboard', icon: Home },
    { name: 'Notes', view: 'notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 w-64 h-full bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Student Manager</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 lg:flex-none"></div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'notes' && <Notes />}
        </main>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );