document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const miniCart = document.getElementById('mini-cart');
    const cartCountSpan = document.querySelector('.cart-count');
    const miniCartItemCountSpan = document.getElementById('mini-cart-item-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const userButton = document.getElementById('user-button');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutButton = document.getElementById('logout-button');
    const myAccountLink = document.getElementById('my-account-link');

    let cart = JSON.parse(localStorage.getItem('gg_beauty_cart')) || [];
    let isLoggedIn = false;

    function toggleDropdown(dropdownElement) {
        [miniCart, userDropdown].forEach(dropdown => {
            if (dropdown !== dropdownElement && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
        dropdownElement.classList.toggle('active');
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-quantity">Qty: ${item.quantity} | Price: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        cartCountSpan.textContent = cart.length;
        miniCartItemCountSpan.textContent = cart.length;
        cartTotalSpan.textContent = total.toFixed(2);
        localStorage.setItem('gg_beauty_cart', JSON.stringify(cart));
    }

    function addItemToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
        }
        renderCart();
        miniCart.classList.add('active');
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    cartButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown(miniCart);
    });

    userButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown(userDropdown);
    });

    document.addEventListener('click', (event) => {
        if (!miniCart.contains(event.target) && !cartButton.contains(event.target)) {
            miniCart.classList.remove('active');
        }
        if (!userDropdown.contains(event.target) && !userButton.contains(event.target)) {
            userDropdown.classList.remove('active');
        }
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.dataset.name;
            const productPrice = productCard.dataset.price;
            const productImage = productCard.dataset.image;
            addItemToCart(productId, productName, productPrice, productImage);
        });
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = event.target.dataset.id;
            removeItemFromCart(productId);
        }
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

        if (isLoggedIn) {
            alert("Proceeding to payment for logged-in user!");
            window.location.href = 'order.html';
        } else {
            alert("Please sign up or log in to proceed with payment.");
            window.location.href = 'signout.html';
        }
    });

    myAccountLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            alert("Please log in to view your account details.");
            window.location.href = 'signout.html';
        } else {
            alert("You are already logged in. Showing account details...");
        }
    });

    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        isLoggedIn = false;
        alert("You have been logged out.");
        userDropdown.classList.remove('active');
    });

    renderCart();
});
// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with hamburger menu (shop page)
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('nav-list');
    
    // Only run hamburger menu code if these elements exist
    if (menuToggle && navList) {
        const body = document.body;
        
        // Create overlay element if it doesn't exist
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            body.appendChild(overlay);
        }
        
        function toggleMenu() {
            const isOpen = navList.classList.contains('open');
            
            if (isOpen) {
                navList.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('active');
                body.style.overflow = '';
            } else {
                navList.classList.add('open');
                menuToggle.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                overlay.classList.add('active');
                body.style.overflow = 'hidden';
            }
        }
        
        function closeMenu() {
            navList.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
        
        // Toggle menu on button click
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('#nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navList.classList.contains('open')) {
                closeMenu();
            }
        });
        
        // Handle escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navList.classList.contains('open')) {
                closeMenu();
            }
        });
    }
    
    // Cart Dropdown Functionality - Check if cart elements exist
    const cartDropdownBtn = document.getElementById('cart-dropdown-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    if (cartDropdownBtn && cartDropdown) {
        // Toggle cart dropdown
        cartDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (cartDropdown.style.display === 'block') {
                cartDropdown.style.display = 'none';
            } else {
                // Close other dropdowns if needed
                cartDropdown.style.display = 'block';
            }
        });
        
        // Close cart dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (cartDropdown.style.display === 'block' && 
                !cartDropdown.contains(e.target) && 
                !cartDropdownBtn.contains(e.target)) {
                cartDropdown.style.display = 'none';
            }
        });
        
        // Prevent closing when clicking inside cart
        cartDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Product quantity and add to cart functionality (if on shop page)
    const addToCartButtons = document.querySelectorAll('.cart-icon-btn');
    const quantityInputs = document.querySelectorAll('.product-actions input[type="number"]');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Find the quantity input for this product
                const productCard = this.closest('.product-card');
                const quantityInput = productCard ? productCard.querySelector('input[type="number"]') : null;
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                const productName = productCard ? productCard.querySelector('.product-name')?.textContent : 'Product';
                
                console.log(`Added ${quantity} of ${productName} to cart`);
                // Here you would add your actual add to cart logic
                
                // Show feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }
    
    // Quantity input validation
    if (quantityInputs.length > 0) {
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                let value = parseInt(this.value);
                if (isNaN(value) || value < 1) {
                    this.value = 1;
                }
                if (value > 99) {
                    this.value = 99;
                }
            });
        });
    }
    
    // Newsletter form submission (if on shop page)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert(`Thanks for subscribing with: ${emailInput.value}`);
                emailInput.value = '';
            }
        });
    }
    
    // Active link highlighting based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav-list a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (linkPath === '/' && (currentPath === '/' || currentPath === '/index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cart-dropdown') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add loading class to buttons on click to prevent double submission
    const submitButtons = document.querySelectorAll('button[type="submit"], .btn-primary');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state (optional)
            if (this.classList.contains('btn-primary') && !this.disabled) {
                this.classList.add('loading');
                // Remove loading after timeout (adjust as needed)
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});

// Helper function to format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Helper function to update cart count (if you have cart functionality)
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        if (count > 0) {
            element.textContent = count;
            element.style.display = 'flex';
        } else {
            element.textContent = '0';
        }
    });
}

// Export functions if needed for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatCurrency, updateCartCount };
}


