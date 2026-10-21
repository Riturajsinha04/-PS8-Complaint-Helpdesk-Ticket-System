import react, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/tickets';
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type ="submit" className="btn-primary">Login</button>
            </form>
        </div>
    );
}