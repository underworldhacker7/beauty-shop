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
})
    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.getElementById('menu-toggle');
        const navList = document.getElementById('nav-list');

        menuToggle.addEventListener('click', () => {
            // Toggle the active class on the navigation list
            navList.classList.toggle('active');
            
            // Toggle the 'open' class on the button for hamburger-to-X animation
            menuToggle.classList.toggle('open');

            // Update ARIA attribute for screen readers
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Optional: Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

