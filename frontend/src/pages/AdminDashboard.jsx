import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/config';

export default function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load tickets');
            if (Array.isArray(data)) setTickets(data);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    // 1. Open vs Resolved counts
    const totalCount = tickets.length;
    const openCount = tickets.filter(t => t.status === 'Open').length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
    const closedCount = tickets.filter(t => t.status === 'Closed').length;

    // 2. Priority-wise breakdown
    const priorityBreakdown = {
        High: tickets.filter(t => t.priority === 'High').length,
        Medium: tickets.filter(t => t.priority === 'Medium').length,
        Low: tickets.filter(t => t.priority === 'Low').length
    };

    // 3. Category-wise breakdown
    const categoryBreakdown = tickets.reduce((acc, t) => {
        const cat = t.category ? t.category.trim() : 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    // 4. Average resolution time (based on Resolved & Closed tickets)
    const resolvedTickets = tickets.filter(t => (t.status === 'Resolved' || t.status === 'Closed') && t.createdAt && t.updatedAt);
    let avgResolutionTime = 'N/A';
    if (resolvedTickets.length > 0) {
        const totalMs = resolvedTickets.reduce((acc, t) => {
            const diff = new Date(t.updatedAt) - new Date(t.createdAt);
            return acc + Math.max(0, diff);
        }, 0);
        const avgMs = totalMs / resolvedTickets.length;
        const avgMinutes = Math.round(avgMs / (1000 * 60));
        if (avgMinutes < 60) {
            avgResolutionTime = `${avgMinutes} min${avgMinutes === 1 ? '' : 's'}`;
        } else if (avgMinutes < 1440) {
            const hours = (avgMinutes / 60).toFixed(1);
            avgResolutionTime = `${hours} hrs`;
        } else {
            const days = (avgMinutes / 1440).toFixed(1);
            avgResolutionTime = `${days} days`;
        }
    }

    if (loading) return <div className="loading" style={{ textAlign: 'center', marginTop: '40px' }}>Loading analytics...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '20px 0' }}>
            <h2 style={{ marginBottom: '20px' }}>Support Admin Analytics Dashboard</h2>
            {error && <div className="error-message" style={{ color: '#e74c3c', marginBottom: '15px' }}>{error}</div>}

            {/* Overview Metric Cards */}
            <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '8px' }}>Total Tickets</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>{totalCount}</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '8px' }}>Open</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db', margin: 0 }}>{openCount}</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '8px' }}>In Progress</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12', margin: 0 }}>{inProgressCount}</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '8px' }}>Resolved / Closed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60', margin: 0 }}>{resolvedCount + closedCount}</p>
                </div>
                <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '8px' }}>Avg Resolution Time</h3>
                    <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#8e44ad', margin: 0 }}>{avgResolutionTime}</p>
                </div>
            </div>

            {/* Priority & Category Breakdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Priority Breakdown */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginBottom: '15px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Priority Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(priorityBreakdown).map(([level, count]) => {
                            const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                            const color = level === 'High' ? '#e74c3c' : level === 'Medium' ? '#f39c12' : '#2ecc71';
                            return (
                                <div key={level}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.95rem' }}>
                                        <span><strong>{level}</strong> ({count})</span>
                                        <span>{percent}%</span>
                                    </div>
                                    <div style={{ background: '#ecf0f1', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, background: color, height: '100%', transition: 'width 0.3s ease' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginBottom: '15px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Category Breakdown</h3>
                    {Object.keys(categoryBreakdown).length === 0 ? (
                        <p style={{ color: '#7f8c8d' }}>No tickets available.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(categoryBreakdown).map(([category, count]) => {
                                const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                                return (
                                    <div key={category}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.95rem' }}>
                                            <span><strong>{category}</strong> ({count})</span>
                                            <span>{percent}%</span>
                                        </div>
                                        <div style={{ background: '#ecf0f1', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, background: '#34495e', height: '100%', transition: 'width 0.3s ease' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}