// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000; // Port untuk server

// Middleware
app.use(cors()); // Izinkan semua request dari domain lain
app.use(express.json()); // Izinkan server menerima body JSON

// Hubungkan ke database
const db = new sqlite3.Database('./products.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Terhubung ke database SQLite.');
});

// --- Rute API untuk CRUD ---

// 1. READ (Get All Products)
app.get('/api/products', (req, res) => {
    const sql = `SELECT * FROM products ORDER BY id`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 2. CREATE (Add New Product)
app.post('/api/products', (req, res) => {
    const { name, description, price, image } = req.body;
    const sql = `INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, description, price, image], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// 3. UPDATE (Edit Product)
app.put('/api/products/:id', (req, res) => {
    const { name, description, price, image } = req.body;
    const sql = `UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?`;
    db.run(sql, [name, description, price, image, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produk berhasil diperbarui', changes: this.changes });
    });
});

// 4. DELETE (Remove Product)
app.delete('/api/products/:id', (req, res) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produk berhasil dihapus', changes: this.changes });
    });
});

// 5. IMPORT (Overwrite all products)
app.post('/api/import', (req, res) => {
    const products = req.body;
    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Data yang dikirim harus berupa array.' });
    }

    const deleteSql = `DELETE FROM products`;
    const insertSql = `INSERT INTO products (id, name, description, price, image) VALUES (?, ?, ?, ?, ?)`;
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(deleteSql, function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }
        });

        const stmt = db.prepare(insertSql);
        products.forEach(p => {
            stmt.run(p.id, p.name, p.description, p.price, p.image);
        });
        stmt.finalize((err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }
            db.run('COMMIT');
            res.status(201).json({ message: 'Data produk berhasil diimpor.' });
        });
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});