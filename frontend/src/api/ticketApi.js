const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchTickets = async (token) => {
    const res = await fetch(`${API_URL}/tickets`,{
        headers: {Authorization: `Bearer ${token}` }
    });
    return res.json();
};

export const fetchTicketById = async (id,token) => {
const res = await fetch(`${API_URL}/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
return res.json();
}