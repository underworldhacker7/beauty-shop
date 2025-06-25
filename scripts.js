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
            window.location.href = 'checkout.html';
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


