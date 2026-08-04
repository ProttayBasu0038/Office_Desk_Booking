# 🏢 Office Seat Booking System

A modern **Office Seat Booking System** built using the **MERN Stack** that allows employees to reserve office desks, conference rooms, and meeting rooms through an interactive floor map. The application provides a simple and intuitive interface for selecting a booking date, viewing seat availability, and reserving workspaces.

---

## 🚀 Features

### 🪑 Interactive Floor Map
- Realistic office floor layout
- 54 employee desks
- Conference room
- Meeting rooms
- Server rooms (non-bookable)

### 📅 Seat Booking
- Book desks for a selected date
- Morning, Afternoon, and Full-Day booking slots
- Instant booking confirmation
- Booking status updates in real time

### 🎨 Visual Seat Status
- 🟢 Available
- 🔴 Booked
- 🟣 Conference Room
- 🟠 Meeting Room
- ⚪ Server Room (Disabled)

### 📍 Smart Layout
- North Zone
- Center Zone
- South Zone
- Walkways
- Office entrance

### 💻 Backend
- RESTful API
- MongoDB Atlas database
- Static seat management
- Booking management
- Duplicate booking prevention

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Icons
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Database
- MongoDB Atlas

---

# 📂 Project Structure

```
Office_Seat_Booking/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingModal.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   └── FloorMap.jsx
│   │   │
│   │   ├── api/
│   │   │   ├── bookingApi.js
│   │   │   └── seatApi.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Seat.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── seatRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── seed/
│   │   └── seedSeats.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 🗄️ Database Design

## Seat Collection

```javascript
{
  seatId: String,
  type: "desk | meeting | conference | server",
  zone: "North | Center | South",
  label: String,
  capacity: Number
}
```

---

## Booking Collection

```javascript
{
  seat: String,
  date: String,
  slot: "morning | afternoon | full-day"
}
```

---

# 📡 API Endpoints

## Seats

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/seats` | Get all seats |
| GET | `/api/seats/:id` | Get seat by ID |

---

## Bookings

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/bookings/date/:date` | Get bookings by date |
| POST | `/api/bookings` | Create booking |
| DELETE | `/api/bookings/:id` | Cancel booking |

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/office-seat-booking.git
```

---

## 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Runs on

```
http://localhost:5173
```

---

## 3. Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Runs on

```
http://localhost:5000
```

---

# 🔑 Environment Variables

Create a `.env` file inside the Backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

---

# 🌱 Seed Static Seats

Run once to populate the database with all office seats.

```bash
node seed/seedSeats.js
```

---

# 📸 Screens

- Login Page
- Interactive Floor Map
- Booking Modal
- Date Selection
- Booking Confirmation

---

# 🔄 Booking Workflow

```
User opens Floor Map
        │
        ▼
Select Booking Date
        │
        ▼
Available Seats Loaded
        │
        ▼
Click Seat
        │
        ▼
Booking Modal Opens
        │
        ▼
Select Time Slot
        │
        ▼
Confirm Booking
        │
        ▼
Booking Saved in MongoDB
        │
        ▼
Seat Status Updated
```

---

# 🎯 Future Enhancements

- User Authentication (JWT)
- Employee Login
- My Bookings Dashboard
- Booking History
- Email Notifications
- Real-time Seat Updates (Socket.io)
- Booking Analytics
- Multi-floor Support
- Admin Dashboard
- Booking Reports

---

# 👨‍💻 Author

**Prottay Basu**

- MERN Stack Developer
- Passionate about Full Stack Development and Scalable Web Applications

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub and feel free to contribute.