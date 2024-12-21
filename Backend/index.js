const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); 
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Define available time slots
const allSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

// API to fetch available slots for a specific date
app.get('/api/available-slots', (req, res) => {
  const { date } = req.query;
  
  

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  const query = "SELECT time_slot FROM bookings WHERE date = ?";
  db.query(query, [date], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const bookedSlots = results.map((row) => row.time_slot);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.json(availableSlots);
  });
});

// API to book an appointment
app.post('/api/book-appointment', (req, res) => {
  const { name, phone, date, timeSlot } = req.body;

  if (!name || !phone || !date || !timeSlot) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = "INSERT INTO bookings (name, phone, date, time_slot) VALUES (?, ?, ?, ?)";
  db.query(query, [name, phone, date, timeSlot], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Slot already booked' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Appointment booked successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
