// Step 1: Set up data and DOM references
document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 59.99 },
  ]

  const cart = [];
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

// Step 2: Render initial products

  products.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
    <span>${product.name} - $${product.price.toFixed(2)}</span>
    <button data-id ="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  })
// Step 3: Handle interactions (event listener)

  productList.addEventListener("click", (e) => {
    if(e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      addToCart(product);
      renderTasks();
    }
  })
  
// Step 4: Cart functions
  
  function addToCart(product) {
    cart.push(product);
    console.log(cart);
  }

  function renderTasks() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    if(cart.length > 0){
      emptyCartMessage.classList.add('hidden');
      cartTotal.classList.remove('hidden');
      cart.forEach((item) => {
        totalPrice += item.price;
        const cartItem = document.createElement('div');
        cartItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(cartItem);
      })
      totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    } else {
      emptyCartMessage.classList.remove('hidden');
      cartTotal.classList.add('hidden');
      totalPriceDisplay.textContent = `$0.00`;
    }
  }

// Checkout handler
   checkoutBtn.addEventListener("click", () => {
    cart.length = 0;
    alert('Checkout successfully!');
    renderTasks();
  });
})