document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Product filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.textContent;
                
                // Filter products
                products.forEach(product => {
                    if (filter === 'Semua' || product.querySelector('h3').textContent.includes(filter)) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
            this.reset();
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Terima kasih telah berlangganan newsletter kami dengan email ${email}`);
            this.reset();
        });
    }

    // Promo modal implementation
    const promoBtn = document.getElementById('promoBtn');
    if (promoBtn) {
        // Create modal HTML if it doesn't exist
        if (!document.getElementById('promoModal')) {
            const modalHTML = `
                <div id="promoModal" class="promo-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>🎉 PROMO SPESIAL! 🎉</h2>
                            <button class="close-btn" id="closeModal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="promo-image">
                                <img src="img/promo.jpeg" alt="Promo Banner" />
                            </div>
                            <div class="promo-details">
                                <h3>Diskon 50% untuk Semua Produk!</h3>
                                <p>Dapatkan kesempatan emas untuk berbelanja dengan harga terbaik!</p>
                                <ul>
                                    <li>✅ Gratis ongkir ke seluruh Indonesia</li>
                                    <li>✅ Garansi 100% original</li>
                                    <li>✅ Return 7 hari tanpa ribet</li>
                                    <li>✅ Berlaku sampai 31 Mei 2025</li>
                                </ul>
                                <div class="promo-code">
                                    <span>Gunakan kode: <strong>PROMO50</strong></span>
                                    <button class="copy-code-btn" onclick="copyPromoCode()">Salin Kode</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-primary" onclick="window.location.href='produk.html'">
                                Belanja Sekarang!
                            </button>
                            <button class="btn-secondary" id="closeModalBtn">Tutup</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert modal HTML into body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Add CSS styles for the modal
            const modalStyles = `
                <style>
                .promo-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                
                .modal-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    animation: modalSlideIn 0.3s ease-out;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
                
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                    color: white;
                    border-radius: 15px 15px 0 0;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 24px;
                    text-align: center;
                    flex-grow: 1;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 32px;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.3s;
                }
                
                .close-btn:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                
                .modal-body {
                    padding: 30px 20px;
                }
                
                .promo-image {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .promo-image img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .promo-details h3 {
                    color: #ff6b6b;
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 22px;
                }
                
                .promo-details p {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #666;
                    font-size: 16px;
                }
                
                .promo-details ul {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 25px;
                }
                
                .promo-details li {
                    padding: 8px 0;
                    font-size: 14px;
                    color: #555;
                }
                
                .promo-code {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    border: 2px dashed #ff6b6b;
                    margin-bottom: 20px;
                }
                
                .promo-code span {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .promo-code strong {
                    color: #ff6b6b;
                    font-size: 20px;
                    letter-spacing: 2px;
                }
                
                .copy-code-btn {
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                
                .copy-code-btn:hover {
                    background: #ff5252;
                }
                
                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
                
                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s;
                    min-width: 120px;
                }
                
                .btn-primary {
                    background: #ff6b6b;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #ff5252;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
                }
                
                .btn-secondary {
                    background: #f8f9fa;
                    color: #333;
                    border: 2px solid #ddd;
                }
                
                .btn-secondary:hover {
                    background: #e9ecef;
                    border-color: #ccc;
                }
                
                @media (max-width: 576px) {
                    .modal-content {
                        margin: 20px;
                        width: calc(100% - 40px);
                    }
                    
                    .modal-header h2 {
                        font-size: 20px;
                    }
                    
                    .promo-details h3 {
                        font-size: 18px;
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                }
                </style>
            `;
            
            // Add styles to head
            document.head.insertAdjacentHTML('beforeend', modalStyles);
        }
        
        // Get modal elements
        const modal = document.getElementById('promoModal');
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = document.getElementById('closeModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        
        // Show modal when promo button is clicked
        promoBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close modal functions
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
        
        // Event listeners for closing modal
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Close modal with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
    
});

// Function to copy promo code
function copyPromoCode() {
    const promoCode = 'PROMO50';
    
    // Create temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = promoCode;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Change button text temporarily
        const copyBtn = event.target;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        copyBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#ff6b6b';
        }, 2000);
        
        alert('Kode promo berhasil disalin!');
    } catch (err) {
        alert('Gagal menyalin kode. Silakan salin manual: ' + promoCode);
    }
    
    // Remove temporary input
    document.body.removeChild(tempInput);


    
}