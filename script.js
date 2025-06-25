document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.querySelector('.cart-count');
    let cartItemCount = 0;

    if (localStorage.getItem('gg_cart_count')) {
        cartItemCount = parseInt(localStorage.getItem('gg_cart_count'));
    }
    cartCountElement.textContent = cartItemCount;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('.product-image').forEach(img => {
        if (img.src.includes('via.placeholder.com')) {
            console.warn(`WARNING: Product image '${img.alt}' is still using a placeholder. Please replace it with a real image URL.`);
        }
    });

    console.log("Current time and date in Kenya (EAT):", new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }));
});
function toggleCartDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    renderCartDropdown();
}
document.addEventListener('click', function(e) {
    const cartBtn = document.getElementById('cart-dropdown-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.style.display = 'none';
    }
});