document.addEventListener('DOMContentLoaded', function() {
    // Kredensial khusus untuk Admin
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'password123';

    // Cari link Admin di navigasi
    const adminLink = document.getElementById('admin-link');

    if (adminLink) {
        adminLink.addEventListener('click', function(event) {
            // Mencegah link berpindah halaman secara langsung
            event.preventDefault();

            // Cek apakah admin sudah login
            if (localStorage.getItem('isAdminLoggedIn') === 'true') {
                window.location.href = 'admin.html';
                return;
            }

            // Minta username admin
            const enteredUsername = prompt("Halaman ini dilindungi.\nMasukkan Username Admin:");

            // Jika pengguna menekan cancel, hentikan proses
            if (enteredUsername === null) {
                return;
            }

            // Minta password admin
            const enteredPassword = prompt("Masukkan Password Admin:");

            // Jika pengguna menekan cancel, hentikan proses
            if (enteredPassword === null) {
                return;
            }

            // Verifikasi kredensial
            if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
                // Jika benar, set flag di localStorage dan arahkan ke halaman admin
                alert('Login admin berhasil!');
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                // Jika salah, berikan pesan error
                alert('Username atau Password Admin Salah!');
            }
        });
    }

    // Tambahkan logika untuk tombol logout
    // Cek apakah kita berada di halaman admin untuk menambahkan event ke tombol logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && localStorage.getItem('isAdminLoggedIn') === 'true') {
         // Hapus juga status login admin saat logout
         logoutBtn.addEventListener('click', function() {
             localStorage.removeItem('isAdminLoggedIn');
         });
    }
});