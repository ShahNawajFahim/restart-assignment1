const BASE_URL = "https://fakestoreapi.com/products";

const cardContainer = document.getElementById("card-container");
const modalContainer = document.getElementById("modal-container");
const cartIcon = document.querySelector(".fa-cart-shopping");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


function updateCartCount() {
  cartIcon.innerHTML = `
    <span class="relative">
      <i class="fa-solid fa-cart-shopping text-lg"></i>
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
      <figure class="p-5 h-60">
        <img src="${product.image}" class="h-full object-contain" />
      </figure>
      <div class="card-body">
        <h2 class="card-title text-sm">
          ${product.title.slice(0, 40)}...
        </h2>
        <p class="text-blue-600 font-bold">$${product.price}</p>
        <p class="badge badge-outline">${product.category}</p>
        <p>⭐ ${product.rating.rate}</p>

        <div class="card-actions justify-between mt-3">
          <button onclick="showDetails(${product.id})"
            class="btn btn-sm btn-outline btn-primary">
            Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="btn btn-sm btn-primary">
            Add to Cart
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

async function loadCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  const categories = await res.json();

  const categorySection = document.createElement("div");
  categorySection.className =
    "flex flex-wrap gap-4 justify-center my-6";

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline category-btn";
    btn.innerText = category;

    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("btn-primary"));

      btn.classList.add("btn-primary");
      loadProductsByCategory(category);
    });

    categorySection.appendChild(btn);
  });

  cardContainer.parentElement.insertBefore(
    categorySection,
    cardContainer
  );
}


async function loadProductsByCategory(category) {
  showLoader();
  const res = await fetch(`${BASE_URL}/category/${category}`);
  const data = await res.json();
  displayProducts(data);
}


loadTrendingProducts();
loadCategories();
