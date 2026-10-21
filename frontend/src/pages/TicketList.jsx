import react, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function TicketList({ user }) {
    const [ticket, setTickets] = useState([]);
    const [error,setError] = useState('');

    useEffect(() =>{
        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(async res => {
            if (!res.ok) throw new Error('Failed to load tickets');
            return res.json();
        })
        .then(data => setTickets(data))
        .catch(error => setError(error.message));
    }, []);

    return(
        <div className="ticket-list-page">
            <h2>{user?.role === 'support' ? 'All Support Tickets' : 'My Support Tickets'}</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="ticket-grid">
                {Array.isArray(ticket) && ticket.map(t => (
                    <div key={t._id} className="ticket-card">
                        <h3>{t.ticketId}: {t.title}</h3>
                        <p><strong>Priority:</strong> {t.priority}</p>
                        <p><strong>Status:</strong> <span className={`badge ${t.status?.toLowerCase()}`}>{t.status}</span></p>
                        <Link to={`/tickets/${t._id}`} className="btn-details">View Details</Link>
                        {t.status === 'Open' && user?.role === 'customer' && (
                            <Link to={`/tickets/${t._id}/edit`} className="btn-edit">Edit</Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}