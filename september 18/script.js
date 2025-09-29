let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 3;

// === Nav Link Behavior ===
document.querySelector('a[href="#home"]').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('home').style.display = 'flex';
  document.getElementById('shopSection').classList.add('hidden');
  document.getElementById('cartPanel').style.display = 'none';
  document.body.classList.remove('cart-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


document.querySelector('a[href="#shopSection"]').addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('shopSection').classList.remove('hidden');
  document.getElementById('shopSection').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('a[href="#cartAnchor"]').addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('shopSection').classList.remove('hidden');
  document.getElementById('cartPanel').style.display = 'block';
  document.body.classList.add('cart-open');
  document.getElementById('cartAnchor').scrollIntoView({ behavior: 'smooth' });
});

// === Mobile Nav Toggle ===
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// === Enter Shop Button ===
document.getElementById("enterShop").addEventListener("click", () => {
  document.getElementById("home").style.display = "none";
  document.getElementById("shopSection").classList.remove("hidden");
});

// === Load Products ===
async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  filteredProducts = products;
  renderProducts(filteredProducts);
  renderPagination();
  setupSearch();
  renderCart();
}

document.addEventListener('DOMContentLoaded', loadProducts);

// === Render Products ===
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = list.slice(start, end);

  pageItems.forEach(product => {
    const card = document.createElement('div');
    card.className = 'shop__product-card';

    card.innerHTML = `
      <img class="shop__product-image" src="${product.image}" alt="${product.name}" />
      <h3 class="shop__product-name">${product.name}</h3>
      <p class="shop__product-price">$${product.price.toFixed(2)}</p>
      <p class="shop__product-category">${product.category || ''}</p>
      <p class="shop__product-description">${product.description}</p>
      <button class="shop__button shop__button--add" data-id="${product.id}">Add to Cart</button>
    `;

    grid.appendChild(card);
  });

  setupAddButtons();
}

// === Pagination ===
function renderPagination() {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'shop__page-button';
    if (i === currentPage) btn.classList.add('active');
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderProducts(filteredProducts);
      renderPagination();
    });
    container.appendChild(btn);
  }
}

// === Search and Sort ===
function setupSearch() {
  const input = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  function applyFilters() {
    const query = input.value.toLowerCase();
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    const sortValue = sortSelect.value;
    if (sortValue === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name-asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    currentPage = 1;
    renderProducts(filteredProducts);
    renderPagination();
  }

  input.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
}

// === Add to Cart ===
function setupAddButtons() {
  document.querySelectorAll('.shop__button--add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart();
  renderCart();
}

// === Remove from Cart ===
function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// === Render Cart ===
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  let grandTotal = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(({ id, quantity }) => {
      const product = products.find(p => p.id === id);
      const itemTotal = product.price * quantity;
      grandTotal += itemTotal;

      const item = document.createElement('div');
      item.className = 'shop__cart-item';
      item.innerHTML = `
        <span>${product.name} × ${quantity} — <strong>$${itemTotal.toFixed(2)}</strong></span>
        <div class="shop__cart-buttons">
          <button class="shop__button--remove-one" data-id="${id}">➖</button>
          <button class="shop__button--remove-all" data-id="${id}">❌</button>
        </div>
      `;
      cartItems.appendChild(item);
    });
  }

  const totalDisplay = document.createElement('div');
  totalDisplay.className = 'shop__cart-total';
  totalDisplay.innerHTML = `<strong>Total: $${grandTotal.toFixed(2)}</strong>`;
  cartItems.appendChild(totalDisplay);

  document.querySelectorAll('.shop__button--remove-one').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find(p => p.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(p => p.id !== id);
      }
      saveCart();
      renderCart();
    });
  });

  document.querySelectorAll('.shop__button--remove-all').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      cart = cart.filter(p => p.id !== id);
      saveCart();
      renderCart();
    });
  });
}

// === Cart Panel Toggle ===
document.getElementById('toggleCart').addEventListener('click', () => {
  const panel = document.getElementById('cartPanel');
  const isOpen = panel.style.display === 'block';
  panel.style.display = isOpen ? 'none' : 'block';
  document.body.classList.toggle('cart-open', !isOpen);
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartPanel').style.display = 'none';
  document.body.classList.remove('cart-open');
});

document.getElementById('clearCart').addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
});

document.getElementById('checkoutCart').addEventListener('click', () => {
  alert('Checkout not implemented yet.');
});
