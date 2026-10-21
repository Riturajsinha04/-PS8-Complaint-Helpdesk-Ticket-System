# Customer Support Ticket System

**Assignment:** Assignment-06  
**Course:** SEMESTER-03 — Web Development (ReactJs / MERN)  
**Project Name:** Customer Support & Helpdesk Management System  

---

## 📌 Project Overview

The **Customer Support Ticket System** is a full-stack MERN (MongoDB, Express.js, React 19, Node.js) web application designed to streamline customer issue reporting and resolution workflows. It features secure JWT authentication, strict Role-Based Access Control (RBAC), end-to-end ticket lifecycle tracking, interactive discussion threads, and an administrative analytics dashboard.

---

## ✨ Key Features

### 1. Authentication & Role-Based Access Control (RBAC)
- **User Roles:** Distinct permissions for **`customer`** and **`support`** users.
- **Secure Authentication:** Password hashing using `bcryptjs` and stateless session verification using `jsonwebtoken` (JWT).
- **Route Protection:** Custom `ProtectedRoute` components in React and Express middleware (`protect`, `allowRoles`) protecting endpoints.

### 2. Ticket Management & Lifecycle
- **Auto-Generated Ticket IDs:** Sequential IDs formatted as `TKT-1001`, `TKT-1002`, etc.
- **Priority & Categorization:** Configurable priority (`Low`, `Medium`, `High`) and functional categories.
- **Lifecycle Statuses:** `Open` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
- **Scoped Visibility:**
  - Customers can only view and manage tickets raised by their own account.
  - Support staff have global access across all submitted tickets.
- **Business Logic & Integrity Rules:**
  - Customers can edit tickets only while they remain in `Open` status.
  - Resolved tickets can be reopened by customers strictly **once** (`reopenCount < 1`), reverting status to `Open`.
  - Once a ticket is marked `Closed`, it is completely immutable (read-only; no status changes, edits, or new replies allowed).

### 3. Interactive Discussion Thread
- Chronological comment feed on each ticket for back-and-forth communication between customers and support staff.
- Displays author name, role tag (`customer` / `support`), and timestamp.
- Automatically disabled once tickets are closed.

### 4. Support Admin Analytics Dashboard
- **Overview Metrics:** Summary counters for Total Tickets, Open, In Progress, and Resolved / Closed.
- **Resolution Performance:** Dynamic calculation of **Average Resolution Time** (in minutes, hours, or days) based on ticket resolution timestamps.
- **Priority Distribution:** Visual breakdown of ticket loads across High, Medium, and Low priorities with percentage bars.
- **Category Breakdown:** Statistical distribution of issues across categories.

---

## 🛠️ Tech Stack

### Frontend
- **Library/Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** Custom CSS with responsive layouts & modern UI components
- **Linting:** [Oxlint](https://oxc.rs/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Middleware:** CORS, dotenv, custom auth & error handling middleware

---

## 🔌 API Endpoints Reference

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`, `role`) | Public |
| `POST` | `/api/auth/login` | Authenticate user and return JWT bearer token | Public |

### Ticket Routes (`/api/tickets`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/tickets` | Raise a new support ticket | Private (`customer`, `support`) |
| `GET` | `/api/tickets` | Get tickets (filtered to owner for `customer`, all for `support`) | Private |
| `GET` | `/api/tickets/:id` | Get ticket details and its discussion thread | Private |
| `PUT` | `/api/tickets/:id` | Update ticket details or update status with lifecycle rules | Private |
| `POST` | `/api/tickets/:id/comments` | Post a comment to the ticket's discussion thread | Private (Open/In Progress/Resolved tickets only) |

---

## 🗺️ Client-Side Routes

| Path | Component | Protected | Allowed Roles | Description |
|---|---|---|---|---|
| `/login` | `Login.jsx` | No (Redirects if logged in) | All | User login page |
| `/register` | `Register.jsx` | No (Redirects if logged in) | All | New user registration |
| `/tickets` | `TicketList.jsx` | Yes | `customer`, `support` | List of user's or all support tickets |
| `/tickets/new` | `TicketForm.jsx` | Yes | `customer`, `support` | Form to raise a new ticket |
| `/tickets/:id` | `TicketDetail.jsx` | Yes | `customer`, `support` | Detailed view, status actions & comments |
| `/tickets/:id/edit` | `TicketForm.jsx` | Yes | `customer` (Open only) | Edit ticket details |
| `/admin/dashboard` | `AdminDashboard.jsx` | Yes (`ProtectedRoute`) | `support` | Analytics & ticket metrics dashboard |
| `*` | `NotFound.jsx` | No | All | Fallback 404 page |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or a MongoDB Atlas URI)

---

### Step 1: Clone & Navigate to Assignment-06

```bash
cd "Assignment-06"
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the `backend/` directory (or use `.env.example` as a template):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/support_ticket_db
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Or standard production start
   npm start
   ```
   The backend API will run at `http://localhost:5000`.

---

### Step 3: Configure & Start the Frontend

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open the displayed URL in your browser (usually `http://localhost:5173`).

---

## 👥 Demo Credentials & Usage Workflow

1. **Register as Customer:**
   - Role: `Customer`
   - Raise a ticket (`/tickets/new`) specifying title, category, priority, and description.
   - You can edit your ticket while its status is `Open`.

2. **Register as Support Staff:**
   - Role: `Support`
   - View all tickets in the system (`/tickets`).
   - Change ticket status (`In Progress` ➔ `Resolved` ➔ `Closed`).
   - Access the **Analytics Dashboard** (`/admin/dashboard`) to view resolution metrics, priority charts, and category breakdowns.

3. **Discussion & Reopening:**
   - Both Customer and Support can post comments in the discussion thread.
   - If a ticket is marked `Resolved`, the customer can test the single-use **Reopen Ticket** action.
   - Once marked `Closed`, all editing and commenting options are locked.

---

## 📂 Project Structure

```text
Assignment-06/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authcontroller.js     # User registration and login handlers
│   │   └── ticketController.js   # Ticket CRUD, status transitions, and comments
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification and role authorization
│   │   └── errorHandler.js       # Centralized error handling middleware
│   ├── models/
│   │   ├── Comment.js            # Comment / thread reply schema
│   │   ├── Department.js         # Department assignment schema
│   │   ├── Ticket.js             # Support ticket schema (with reopen counters)
│   │   └── User.js               # User account schema with roles
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── ticketRoutes.js       # /api/tickets routes
│   ├── .env                      # Environment configuration (ignored in git)
│   ├── .env.example              # Example environment template
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express application entry point
│
└── frontend/
    ├── public/                   # Static assets
    ├── src/
    │   ├── api/                  # API client helper modules
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar with role-based links
    │   │   ├── ProtectedRoute.jsx# Client-side role route guard
    │   │   └── TicketForm.jsx    # Create and Edit ticket form
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx# Metrics and analytics dashboard (Support role)
    │   │   ├── Login.jsx         # User login page
    │   │   ├── NotFound.jsx      # 404 fallback page
    │   │   ├── Register.jsx      # User registration page
    │   │   ├── TicketDetail.jsx  # Ticket details, status controls & comments
    │   │   └── TicketList.jsx    # Ticket grid / list view
    │   ├── App.css               # Application component styling
    │   ├── App.jsx               # Main React component with route definitions
    │   ├── index.css             # Base styles and resets
    │   └── main.jsx              # React DOM root entry point
    ├── index.html                # Vite HTML template
    ├── package.json              # Frontend dependencies and scripts
    └── vite.config.js            # Vite configuration
```

---

## 📜 Available Scripts

### Backend (`/backend`)
- `npm run dev`: Runs the backend with nodemon for automatic restarts on file changes.
- `npm start`: Runs the server with Node.js.

### Frontend (`/frontend`)
- `npm run dev`: Launches the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles production-ready frontend assets.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs Oxlint to inspect code quality.
