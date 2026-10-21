import { API_BASE_URL as API_URL } from './config';

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