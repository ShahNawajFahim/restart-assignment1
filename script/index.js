const BASE_URL = "https://fakestoreapi.com/products";

const cardContainer = document.getElementById("card-container");
const modalContainer = document.getElementById("modal-container");
const cartIcon = document.querySelector(".fa-cart-shopping");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


function updateCartCount() {
  cartIcon.innerHTML = `
    <span class="relative">
      <span class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
        ${cart.length}
      </span>
    </span>
  `;
}

updateCartCount();

// <<spinner>>
function showLoader() {
  cardContainer.innerHTML = `
    <div class="col-span-full text-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  `;
}


async function loadTrendingProducts() {
  showLoader();
  const res = await fetch(BASE_URL);
  const data = await res.json();

  const topThree = data.slice(0, 3);
  displayProducts(topThree);
}


function displayProducts(products) {
  cardContainer.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "card bg-base-100 shadow-md";

    div.innerHTML = `
      <figure class="p-5 h-60 bg-gray-300">
        <img src="${product.image}" class="h-full object-contain" />
      </figure>
      <div class="card-body">
        <div class="flex justify-between">
         <span class="text-blue-600 font-semibold badge badge-outline">${product.category}</span>
        <span class="text-stone-600">⭐ ${product.rating.rate}(${product.rating.count})</span>
        </div>

        <h2 class="card-title text-sm">
          ${product.title.slice(0, 40)}...
        </h2>
        <p class=" font-bold">$${product.price}</p>
       

        <div class="card-actions justify-between mt-3">
          <button onclick="showDetails(${product.id})"
            class="btn  btn-outline ">
           👁 Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="btn  btn-primary">
           🛒 Add   
          </button>
        </div>
      </div>
    `;

    cardContainer.appendChild(div);
  });
}

async function showDetails(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const product = await res.json();

  modalContainer.innerHTML = `
    <img src="${product.image}" class="w-40 mx-auto mb-4" />
    <h2 class="font-bold text-lg mb-2">${product.title}</h2>
    <p class="text-sm mb-2">${product.description}</p>
    <p class="font-bold text-blue-600 mb-2">$${product.price}</p>
    <p class="mb-4">⭐ ${product.rating.rate}</p>

    <button onclick="addToCart(${product.id})"
      class="btn btn-primary w-full">
      Add to Cart
    </button>
  `;

  document.getElementById("my_modal").showModal();
}


async function addToCart(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const product = await res.json();

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}



async function loadProductsByCategory(category) {
  showLoader();
  const res = await fetch(`${BASE_URL}/category/${category}`);
  const data = await res.json();
  displayProducts(data);
}


loadTrendingProducts();

