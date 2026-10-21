import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister =async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit = {handleRegister}>
                <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="customer">Customer</option>
                    <option value="support">Support</option>
                </select>
                <button type="submit" className="btn-primary">Register</button>
            </form>
        </div>
    );
}