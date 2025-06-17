// backend/database.js
const sqlite3 = require('sqlite3').verbose();

// Buat atau hubungkan ke file database products.db
const db = new sqlite3.Database('./products.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Terhubung ke database SQLite.');
});

// Buat tabel products dan masukkan data awal
db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS products`);
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image TEXT NOT NULL
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Tabel "products" berhasil dibuat.');
        
        const initialProducts = [
            { id: 1, name: 'Intel Core i9-13900K', description: 'Prosesor 24-core 32-thread 5.8GHz', price: 9999000, image: 'https://th.bing.com/th/id/OIP.BzL1wS1AW9Wgy3sUoqBX9AHaHa?w=188&h=188&c=7&r=0&o=5&dpr=1.1&pid=1.7' },
            { id: 2, name: 'NVIDIA RTX 4090', description: '24GB GDDR6X 384-bit', price: 32500000, image: 'https://th.bing.com/th/id/OIP.U6kN_ZgONhhUGC7OKfmMegHaEI?rs=1&pid=ImgDetMain' },
            { id: 3, name: 'NVIDIA RTX 5090', description: '32GB GDDR7 384-bit', price: 32500000, image: 'https://images.stockx.com/images/NVIDIA-GIGABYTE-GeForce-RTX-5090-AORUS-MASTER-ICE-32G-GDDR7-Graphics-Card-GV-N5090AORUSM-ICE-32GD-White.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1739222725n' },
        ];

        const stmt = db.prepare(`INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`);
        initialProducts.forEach(p => {
            stmt.run(p.name, p.description, p.price, p.image);
        });
        stmt.finalize();
        console.log('Data awal berhasil dimasukkan.');
    });
});

// Tutup koneksi database
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Koneksi database ditutup.');
});