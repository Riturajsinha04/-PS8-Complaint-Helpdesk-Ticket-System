import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketForm({ isEdit = false }) {
    const [formData, setFormData] = useState({ title: '', category: '', priority: 'medium', description: '', screenshotUrl: ''});
    const [error,setError] = useState(' ');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if(isEdit && id) {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:5000/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if(data.tickets) {
                    setFormData({
                        title: data.ticket.title,
                        category: data.ticket.category,
                        priority: data.ticket.priority,
                        description: data.ticket.description,
                        screenshotUrl: data.ticket.screenshotUrl || ''
                    });
                }
            })
            .catch (() => setError('Failed to load ticket for editing'));
        }

    }, [isEdit,id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token =localStorage.getItem('token');
        const url = isEdit ? `http://localhost:5000/api/tickets/${id}` : 'http://localhost:5000/api/tickets';
        const method = isEdit ? 'PUT' : 'POST';

        try{
            const res =await fetch(url, {
                method,
                headers: { 'Content-Type' : 'application/json' , Authorization: `Bearer ${token}` },
                body : JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message || 'Something went wrong');
            navigate('/tickets');
        } catch(err){
            setError(err.message);
        }
    };

    return(
        <div className="form-container">
            <h2>{isEdit ?  'Edit Ticket' : 'Raise New Support Ticket'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <input type="text" placeholder="Screenshot URL (optional)" value={formData.screenshotUrl} onChange={e => setFormData({...formData, screenshotUrl: e.target.value})}  / >
                    <button type="submit" className="btn-primary">{isEdit ? 'Update Ticket' : 'Submit Ticket'}</button>
            </form>
        </div>
    );
}