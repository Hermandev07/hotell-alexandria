const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const bookingsFile = path.join(__dirname, 'bookings.json');

// Middleware for statiske filer og databehandling
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST: Motta og lagre bookingdata
app.post('/book', (req, res) => {
    const { roomType, guests, name, email } = req.body;
    const ref = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newBooking = { roomType, guests, name, email, ref };

    let bookings = [];
    if (fs.existsSync(bookingsFile)) {
        bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    }

    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    res.json({ message: 'Booking lagret!', ref });
});

// GET: Hent bookinginformasjon
app.get('/bookinginfo', (req, res) => {
    const ref = req.query.ref;

    if (!fs.existsSync(bookingsFile)) {
        return res.status(404).json({ error: 'Ingen bookinger funnet' });
    }

    const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    const booking = bookings.find((b) => b.ref === ref);

    if (booking) {
        res.json(booking);
    } else {
        res.status(404).json({ error: 'Ingen booking funnet for dette referansenummeret' });
    }
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
