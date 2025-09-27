
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PlaneList from './components/PlaneList';
import PlaneForm from './components/PlaneForm';
import EditPlane from './pages/EditPlane';
import ViewPlane from './pages/ViewPlane';
import OrderFormPage from './pages/OrderFormPage';
import PlaneOrdersMenu from './components/PlaneOrdersMenu';
import { supabase } from './supabaseClient';
import './App.css';

// Auth context
const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

const ADMIN_USERNAME = 'SRPSpy1234';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      // Login with username (find email by username)
      if (!username) {
        setError('Username required');
        return;
      }
      // Fetch user by username (from public user_metadata)
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single();
      if (fetchError || !data?.email) {
        setError('No user found with that username');
        return;
      }
      const { error, data: loginData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });
      if (error) setError(error.message);
      else {
        setUser(loginData.user);
        onClose();
      }
    } else {
      // Signup: require username and email
      if (!username || !email) {
        setError('Username and email required');
        return;
      }
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) setError(error.message);
      else {
        // Optionally, insert username/email mapping into a public users table for lookup
        await supabase.from('users').insert([{ username, email }]);
        setUser(data.user);
        onClose();
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,28,34,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#232a34', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 32, minWidth: 320, color: '#eaf6fb', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>×</button>
        <h2 style={{ color: '#2de2e6', textAlign: 'center', marginBottom: 18 }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <div style={{ marginBottom: 14 }}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {!isLogin && (
          <div style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {error && <div style={{ color: '#ff6f61', marginBottom: 10 }}>{error}</div>}
        <button className="main-btn" type="submit" style={{ width: '100%', marginBottom: 10 }}>{isLogin ? 'Login' : 'Sign Up'}</button>
        <button type="button" className="main-btn" style={{ width: '100%' }} onClick={() => setIsLogin(v => !v)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  );
}

const Home: React.FC<{ onShowOrders: () => void; onShowLogin: () => void; isAdmin: boolean; user: any; onLogout: () => void }> = ({ onShowOrders, onShowLogin, isAdmin, user, onLogout }) => {
  const orderFormUrl = `${window.location.origin}/order`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '24px', color: '#2de2e6', textAlign: 'center' }}>RC Planes Manager</h1>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', justifyContent: 'center' }}>
        <Link to="/planes" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>View All Planes</Link>
        <Link to="/add" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>Add New Plane</Link>
        <Link to="/order" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>Place Order</Link>
        {isAdmin && <button className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }} onClick={onShowOrders}>Orders</button>}
      </div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#eaf6fb', marginRight: 12 }}>Logged in as <b>{user.user_metadata?.username || user.email?.split('@')[0]}</b></span>
            <button className="main-btn" style={{ fontSize: '0.95rem', padding: '6px 16px' }} onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="main-btn" style={{ fontSize: '0.95rem', padding: '6px 16px', margin: '0 auto', display: 'block' }} onClick={onShowLogin}>Login / Sign Up</button>
        )}
      </div>
      <div style={{ marginBottom: '18px', color: '#2de2e6', fontWeight: 600 }}>
        Share this link: <a href={orderFormUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0fa3b1', textDecoration: 'underline' }}>{orderFormUrl}</a>
      </div>
      <p style={{ color: '#eaf6fb', fontSize: '1.1rem', textAlign: 'center', maxWidth: 400 }}>Welcome! Manage your RC planes and their components here.</p>
    </div>
  );
};


const App: React.FC = () => {
  const { user, setUser, loading } = useAuth();
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Admin check: username and password match
  const isAdmin = user && (user.user_metadata?.username === ADMIN_USERNAME || user.email?.split('@')[0] === ADMIN_USERNAME);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div style={{ color: '#2de2e6', textAlign: 'center', marginTop: 80 }}>Loading...</div>;

  return (
    <div className="app-container">
      <div style={{ width: '100%', background: '#2de2e6', padding: '18px 0', textAlign: 'center', color: '#181c22', fontWeight: 700, fontSize: '2rem', letterSpacing: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        FlightHQ
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home onShowOrders={() => setShowOrdersMenu(true)} onShowLogin={() => setShowLogin(true)} isAdmin={isAdmin} user={user} onLogout={handleLogout} />} />
          <Route path="/planes" element={<PlaneList />} />
          <Route path="/add" element={<PlaneForm />} />
          <Route path="/edit/:id" element={<EditPlane />} />
          <Route path="/view/:id" element={<ViewPlane />} />
          <Route path="/order" element={<OrderFormPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {showOrdersMenu && isAdmin && <PlaneOrdersMenu onClose={() => setShowOrdersMenu(false)} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </Router>
    </div>
  );
};

// Wrap app in AuthProvider
const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
