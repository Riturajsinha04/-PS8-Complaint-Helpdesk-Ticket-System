const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB  = require("./config/db");
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Helpdesk Support Ticket API is running...' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port${PORT}`));