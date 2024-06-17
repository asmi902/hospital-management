const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sanjna@25',
    database: 'doctor_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM doctors WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            throw err;
        }
        if (results.length > 0) {
            const doctorId = results[0].id;
            db.query('SELECT * FROM patients WHERE doctor_id = ?', [doctorId], (err, patientResults) => {
                if (err) {
                    throw err;
                }
                res.json({ success: true, patients: patientResults });
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
