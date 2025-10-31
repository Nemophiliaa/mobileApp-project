const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia_super_aman';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Format token salah' });

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Format Authorization harus Bearer' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    req.user = decoded; // { id, email, iat, exp }
    next();
  });
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myjsondb'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});


// ======================================================
// ===============  ENDPOINT REGISTER USER  ==============
// ======================================================
app.post('/register', async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ message: 'Semua field wajib diisi!' });
  }

  try {
    // ✅ Cek apakah email sudah ada
    db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
      if (err) {
        console.error('Error check email:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email sudah terdaftar!' });
      }

      // ✅ Hash password dulu biar aman
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // ✅ Simpan ke database
      const sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)';
      db.query(sql, [user_name, user_email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error insert user:', err);
          return res.status(500).json({ error: 'Gagal register user' });
        }

        res.json({
          message: 'Registrasi berhasil!',
          id: result.insertId,
          user_name,
          user_email
        });
      });
    });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// ======================================================
// ===============  ENDPOINT LOGIN USER  ==============
// ======================================================

app.post('/login',  (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  const sql = 'SELECT * FROM users WHERE user_email = ?';
  db.query(sql, [user_email], async (err, results) => {
    if (err) {
      console.error('Error login:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan!' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    const payload = { id: user.id, email: user.user_email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });


    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  });
});


// ======================================================
// ===============  ENDPOINT DATA DASHBOARD  ==================
// ======================================================


// total users
app.get("/total-users", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ total_users: result[0].total });
  });
});

// total posts
app.get("/total-posts", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM dataposts", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ total_posts: result[0].total });
  });
});


// ======================================================
// ===============  ENDPOINT POST CRUD ==================
// ======================================================

// GET semua data
app.get('/posts', verifyToken, (req, res) => {
  db.query('SELECT * FROM dataposts', (err, results) => {
    if (err) {
      console.error('Error select:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// POST tambah data
app.post('/posts', verifyToken, (req, res) => {
  const { image, postId, judul, deskripsi } = req.body;
  const sql = 'INSERT INTO dataposts (image, postId, judul, deskripsi) VALUES (?, ?, ?, ?)';
  db.query(sql, [image, postId, judul, deskripsi], (err, result) => {
    if (err) {
      console.error('Error insert:', err);
      return res.status(500).json({ error: 'Insert failed' });
    }
    const newPost = {
      id: result.insertId,
      image,
      postId,
      judul,
      deskripsi
    };
    res.json(newPost);
  });
});

// GET satu data
app.get('/posts/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM dataposts WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error select by id:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json(results[0]);
  });
});

// PUT update data
app.put('/posts/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { image, judul, deskripsi } = req.body;
  const sql = `UPDATE dataposts SET image = ?, judul = ?, deskripsi = ? WHERE id = ?`;
  db.query(sql, [image, judul, deskripsi, id], (err, result) => {
    if (err) {
      console.error('Error update:', err);
      return res.status(500).json({ error: 'Update failed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil diupdate', id, image, judul, deskripsi });
  });
});

// DELETE data
app.delete('/posts/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM dataposts WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error delete:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil dihapus', id });
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
