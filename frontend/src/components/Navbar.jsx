import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="nav-brand" onClick={() => navigate('/')}>Helpdesk System</div>
            <div className="nav-links">
                {user ? (
                    <>
                        <NavLink to="/tickets">My Tickets</NavLink>
                        <NavLink to="/tickets/new">Raise Ticket</NavLink>
                        {user.role === 'support' && <NavLink to="/admin/dashboard">Dashboard</NavLink>}
                        <button onClick={onLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}