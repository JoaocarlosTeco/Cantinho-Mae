// Contagem de cliques no logo para redirecionar ao dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script do Cantinho-Mae carregado');
    let clickCount = 0;
    let clickTimeout;

    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        console.log('Elemento .logo encontrado');
        logoElement.addEventListener('click', function() {
            console.log('Clique registrado, total de cliques:', clickCount + 1);
            clickCount++;
            clearTimeout(clickTimeout);

            if (clickCount === 9) {
                console.log('9 cliques atingidos, redirecionando para o dashboard');
                window.location.href = '/Cantinho-Mae/Cantinho-Mae/Dashboard/index.html?access=secret9clicks';
                clickCount = 0;
            } else {
                clickTimeout = setTimeout(() => {
                    console.log('Resetando contagem de cliques');
                    clickCount = 0;
                }, 1000);
            }
        });
    } else {
        console.error('Elemento .logo não encontrado no DOM');
    }
});

// Código existente do Cantinho-Mae/script.js
let cart = [];
let favorites = [];

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const isOpen = modal.style.display === 'flex';
    modal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen && document.getElementById('checkout-form').style.display === 'block') {
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('cart-items').style.display = 'block';
        document.getElementById('cart-summary').style.display = 'block';
        document.getElementById('checkout-btn').style.display = 'block';
    }
}

document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const quantityInput = button.closest('.menu-item').querySelector('.quantity');
        const quantity = parseInt(quantityInput.value);

        if (quantity <= 0) {
            alert('Selecione pelo menos 1 unidade para adicionar ao pedido.');
            return;
        }

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity, notes: '' });
        }

        quantityInput.value = 0;
        updateCart();
    });
});

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio!</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="/api/placeholder/80/80" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$${itemTotal.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="cart-quantity">${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="cart-item-notes">
                        <textarea placeholder="Observações (ex.: sem cebola)" oninput="updateNotes('${item.id}', this.value)">${item.notes}</textarea>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">Remover</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    updateCartSummary();
    updateCartCount();
    updateFavorites();
}

function updateCartQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}

function updateNotes(id, notes) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.notes = notes;
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('total').textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count || '0';
}

document.querySelectorAll('.favorite').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = document.querySelector(`.order-btn[data-id="${id}"]`).getAttribute('data-name');
        if (favorites.includes(id)) {
            favorites = favorites.filter(fav => fav !== id);
            button.classList.remove('favorited');
            button.querySelector('i').classList.replace('fas', 'far');
        } else {
            favorites.push(id);
            button.classList.add('favorited');
            button.querySelector('i').classList.replace('far', 'fas');
        }
        updateFavorites();
    });
});

function updateFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Nenhum item favoritado.</p>';
        return;
    }

    favorites.forEach(id => {
        const name = document.querySelector(`.order-btn[data-id="${id}"]`).getAttribute('data-name');
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('cart-item');
        favoriteItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${name}</div>
                <button class="order-btn" onclick="addFavoriteToCart('${id}')">Adicionar ao Pedido</button>
            </div>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

function addFavoriteToCart(id) {
    const button = document.querySelector(`.order-btn[data-id="${id}"]`);
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const quantity = 1;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity, notes: '' });
    }

    updateCart();
}

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            item.style.display = category === 'all' || item.getAttribute('data-category') === category ? 'block' : 'none';
        });
    });
});

function searchMenu() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        item.style.display = name.includes(searchTerm) || description.includes(searchTerm) ? 'block' : 'none';
    });
}

document.querySelectorAll('.quantity-selector').forEach(selector => {
    const input = selector.querySelector('.quantity');
    const minus = selector.querySelector('.minus');
    const plus = selector.querySelector('.plus');

    minus.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value > 0) input.value = value - 1;
    });

    plus.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value < 10) input.value = value + 1;
    });

    input.addEventListener('input', () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) input.value = 0;
        if (value > 10) input.value = 10;
    });
});

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens antes de finalizar o pedido.');
        return;
    }
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('cart-items').style.display = 'none';
    document.getElementById('cart-summary').style.display = 'none';
    document.getElementById('checkout-btn').style.display = 'none';
}

function cancelCheckout() {
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('cart-items').style.display = 'block';
    document.getElementById('cart-summary').style.display = 'block';
    document.getElementById('checkout-btn').style.display = 'block';
}

function submitOrder() {
    const name = document.getElementById('checkout-name').value;
    const table = document.getElementById('checkout-table').value;
    const payment = document.getElementById('checkout-payment').value;
    const orderNotes = document.getElementById('checkout-order-notes').value;

    if (!name || !table || !payment) {
        alert('Por favor, preencha todos os campos obrigatórios (*).');
        return;
    }

    const orderData = {
        name: name,
        table: table,
        payment: payment,
        orderNotes: orderNotes,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            notes: item.notes
        }))
    };

    fetch('save_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na requisição');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const orderCode = `CM${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
            let confirmationText = `Pedido #${orderCode}\n\nItens:\n`;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                confirmationText += `${item.name} x${item.quantity} - R$${itemTotal.toFixed(2).replace('.', ',')}`;
                if (item.notes) confirmationText += ` (Obs: ${item.notes})`;
                confirmationText += '\n';
            });
            confirmationText += `\nTotal: R$${orderData.total.toFixed(2).replace('.', ',')}`;
            confirmationText += `\nMesa: ${table}`;
            if (orderNotes) confirmationText += `\nObservações do Pedido: ${orderNotes}`;
            confirmationText += `\nPagamento: ${payment}`;

            document.getElementById('order-confirmation').textContent = confirmationText;
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('checkout-form').style.display = 'none';
            cart = [];
            updateCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('Erro ao salvar o pedido: ' + (data.error || 'Tente novamente.'));
        }
    })
    .catch(error => {
        alert('Erro na conexão ou ao processar o pedido: ' + error.message);
    });
}

function closeSuccessMessage() {
    document.getElementById('success-message').style.display = 'none';
    toggleCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Por favor, preencha todos os campos do formulário de contato.');
        return;
    }

    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('back-to-top');
    backToTop.style.display = window.scrollY > 200 ? 'flex' : 'none';
});

updateFavorites();