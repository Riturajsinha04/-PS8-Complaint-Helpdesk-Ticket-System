import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function TicketDetail({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');

    const loadTicket = () => {
        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/tickets/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(resData => setData(resData))
            .catch(() => setError('Failed to load ticket details'));
    };

    useEffect(() => {
        loadTicket();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const updated = await res.json();
            if (!res.ok) throw new Error(updated.message || 'Failed to update status');
            loadTicket();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: commentText })
            });
            if (!res.ok) throw new Error('Failed to post comment');
            setCommentText('');
            loadTicket();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!data) return <div className="loading">Loading ticket...</div>;

    const { ticket, comments = [] } = data;
    if (!ticket) return <div className="error-message">Ticket not found</div>;

    return (
        <div className="ticket-detail-page">
            <button onClick={() => navigate(-1)} className="btn-back">Back</button>
            <h2>{ticket.ticketId}: {ticket.title}</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="ticket-meta">
                <p><strong>Category:</strong> {ticket.category}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <p><strong>Status:</strong> <span className={`badge ${ticket.status?.toLowerCase()}`}>{ticket.status}</span></p>
                <p><strong>Description:</strong> {ticket.description}</p>
            </div>

            {/* Role-based Status Action Buttons */}
            <div className="ticket-actions" style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
                {user?.role === 'support' && ticket.status !== 'Closed' && (
                    <>
                        {ticket.status === 'Open' && (
                            <button onClick={() => handleStatusChange('In Progress')} className="btn-primary">
                                Mark In Progress
                            </button>
                        )}
                        {ticket.status !== 'Resolved' && (
                            <button onClick={() => handleStatusChange('Resolved')} className="btn-primary" style={{ backgroundColor: '#10b981' }}>
                                Resolve Ticket
                            </button>
                        )}
                        <button onClick={() => handleStatusChange('Closed')} className="btn-primary" style={{ backgroundColor: '#6b7280' }}>
                            Close Ticket
                        </button>
                    </>
                )}

                {user?.role === 'customer' && ticket.status !== 'Closed' && (
                    <>
                        {ticket.status === 'Resolved' && ticket.reopenCount < 1 && (
                            <button onClick={() => handleStatusChange('Open')} className="btn-primary" style={{ backgroundColor: '#f59e0b' }}>
                                Reopen Ticket
                            </button>
                        )}
                        <button onClick={() => handleStatusChange('Closed')} className="btn-primary" style={{ backgroundColor: '#6b7280' }}>
                            Close Ticket
                        </button>
                    </>
                )}
            </div>

            <div className="comment-section">
                <h3>Discussion Thread</h3>
                {comments.map(c => (
                    <div key={c._id} className="comment-card">
                        <strong>{c.author?.name} ({c.author?.role})</strong>: <p>{c.message}</p>
                        <small>{new Date(c.createdAt).toLocaleString()}</small>
                    </div>
                ))}

                {ticket.status !== 'Closed' && (
                    <form onSubmit={handleAddComment} className="comment-form">
                        <textarea placeholder="Write a reply..." value={commentText} onChange={e => setCommentText(e.target.value)} required />
                        <button type="submit" className="btn-primary">Post Reply</button>
                    </form>
                )}
            </div>
        </div>
    );
}