import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import TicketList from './pages/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [user,setuser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setuser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout}/>
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/tickets" />} />
           <Route path="/register" element={!user ? <Register /> : <Navigate to="/tickets" />} />
          <Route path="/tickets" element={user ? <TicketList user={user}/> : <Navigate to="/login" />}/>
          <Route path="/tickets/new" element={user ? <TicketForm/> : <Navigate to="/login" />}/>
          <Route path="/tickets/:id" element={user ? <TicketDetail user={user}/> : <Navigate to="/login" />}/>
          <Route path="/tickets/:id/edit" element={user ? <TicketForm uisEdit={true}/> : <Navigate to="login" />}/>
          <Route path="/admin/tickets" element={user && user.role === 'support' ? <TicketList user={user} isAdmin={true}/> : <Navigate to="login" />}/>
          <Route path="/" element={<Navigate to={user ? "/tickets" : "/login"} />}/>
          <Route path="/admin/dashboard" element={<ProtectedRoute user={user} requiredRole="support"><AdminDashboard/></ProtectedRoute>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;