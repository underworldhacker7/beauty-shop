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

// Render cart dropdown with items and progress bar
function renderCartDropdown() {
    const cartDropdownList = document.getElementById('cart-dropdown-list');
    const cart = JSON.parse(localStorage.getItem('gg_beauty_cart')) || [];
    
    let total = 0;
    let html = '<table><tr><th>Product</th><th>Qty</th><th>Price</th><th>Action</th></tr>';
    
    if (cart.length === 0) {
        html += '<tr><td colspan="4" style="text-align:center; padding: 20px;">Your cart is empty</td></tr>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:red;cursor:pointer;">Remove</button></td>
            </tr>`;
        });
    }
    
    html += '</table>';
    cartDropdownList.innerHTML = html;
    
    // Update total
    const totalElement = document.getElementById('cart-dropdown-total');
    totalElement.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
    
    // Update progress bar
    updateShippingProgressBar(total);
}

// Update shipping progress bar
function updateShippingProgressBar(cartTotal) {
    const FREE_SHIPPING_THRESHOLD = 50;
    const progressFill = document.getElementById('shippingProgressFill');
    const progressText = document.getElementById('shippingProgressText');
    
    if (!progressFill || !progressText) return;
    
    const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    progressFill.style.width = progress + '%';
    
    if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
        progressText.textContent = '🎉 Congratulations! You qualify for free shipping!';
        progressText.style.color = '#00C851';
    } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2);
        progressText.textContent = `Add $${remaining} more for free shipping!`;
        progressText.style.color = 'var(--text-light)';
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('gg_beauty_cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('gg_beauty_cart', JSON.stringify(cart));
    renderCartDropdown();
}

// Go to checkout
function goToCheckout() {
    const cart = JSON.parse(localStorage.getItem('gg_beauty_cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    // Redirect to order page or checkout page
    window.location.href = 'order.html';
}